'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useExamSession } from '@/app/hooks/useExamSession';
import { ExamResult } from '@/app/components/exam/ExamResult';
import type { ExamResult as ExamResultType, WordItem } from '@/lib/utils/exam/types';

/**
 * Exam Result Page
 *
 * Route: /wordsets/[id]/exam/result
 *
 * Displays exam results:
 * - Score and percentage
 * - Correct and incorrect counts
 * - Time taken
 *
 * Provides navigation options:
 * - Retry exam
 * - Back to word set
 * - Review incorrect words
 *
 * Auto-redirects if exam not completed
 */
export default function ResultPage() {
  const router = useRouter();
  const params = useParams();
  const wordSetId = params.id as string;

  // Mock word set data (in production, fetch from API)
  const mockWordSet: WordItem[] = [
    { id: '1', word: 'apple', meaning: 'A red fruit' },
    { id: '2', word: 'banana', meaning: 'A yellow fruit' },
    { id: '3', word: 'cherry', meaning: 'A small red fruit' },
    { id: '4', word: 'date', meaning: 'A sweet dried fruit' },
    { id: '5', word: 'elderberry', meaning: 'A dark purple berry' },
  ];

  // Initialize exam session hook
  const { status, answers, questions, resetExam, startTime } = useExamSession(
    wordSetId,
    mockWordSet
  );

  const [result, setResult] = useState<ExamResultType | null>(null);

  // Calculate result when component mounts
  useEffect(() => {
    if (status !== 'completed' || answers.length === 0) {
      // Auto-redirect if exam not completed
      router.push('./');
      return;
    }

    // Calculate result
    const correctCount = answers.filter(a => a.isCorrect).length;
    const incorrectCount = answers.length - correctCount;
    const percentage = Math.round((correctCount / answers.length) * 100);
    const duration = Date.now() - startTime;

    setResult({
      correctCount,
      incorrectCount,
      percentage,
      duration,
    });
  }, [status, answers, startTime, router]);

  /**
   * Handle retry exam
   */
  const handleRetry = () => {
    resetExam();
    router.push('./');
  };

  /**
   * Handle finish (back to word set)
   */
  const handleFinish = () => {
    router.push('../');
  };

  /**
   * Handle review incorrect words
   * Navigate to learn mode with incorrect word filter
   */
  const handleReviewIncorrect = () => {
    // Get incorrect word IDs
    const incorrectWordIds = answers
      .filter(a => !a.isCorrect)
      .map(a => questions[a.questionIndex]?.wordId)
      .filter(Boolean);

    const query = new URLSearchParams({
      ids: incorrectWordIds.join(','),
      mode: 'review',
    });

    router.push(`../learn?${query.toString()}`);
  };

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading results...</div>
      </div>
    );
  }

  return (
    <div>
      <ExamResult
        result={result}
        onRetry={handleRetry}
        onFinish={handleFinish}
        onReviewIncorrect={handleReviewIncorrect}
      />
    </div>
  );
}
