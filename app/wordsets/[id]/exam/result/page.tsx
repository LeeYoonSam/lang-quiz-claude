'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useExamSession } from '@/app/hooks/useExamSession';
import { ExamResult } from '@/app/components/exam/ExamResult';
import { wordsToWordItems } from '@/lib/utils/exam';
import type { ExamResult as ExamResultType, WordItem } from '@/lib/utils/exam/types';
import type { Word } from '@/app/types/learn';

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

  // State for loaded word set data
  const [wordSet, setWordSet] = useState<WordItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize exam session hook
  const { status, answers, questions, resetExam, startTime } = useExamSession(
    wordSetId,
    wordSet
  );

  const [result, setResult] = useState<ExamResultType | null>(null);

  // Load word set data from API
  useEffect(() => {
    const loadWordSet = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/wordsets/${wordSetId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch wordset');
        }

        const data = await response.json();
        const convertedWords = wordsToWordItems(data.words as Word[]);
        setWordSet(convertedWords);
      } catch (err) {
        console.error('Error loading wordset:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (wordSetId) {
      loadWordSet();
    }
  }, [wordSetId]);

  // Calculate result when component mounts
  useEffect(() => {
    if (isLoading || status !== 'completed' || answers.length === 0) {
      // Auto-redirect if exam not completed or still loading
      if (!isLoading && status !== 'completed') {
        router.push('./');
      }
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
  }, [status, answers, startTime, router, isLoading]);

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

  // Get incorrect words
  const incorrectWords = answers
    .filter(a => !a.isCorrect)
    .map(a => {
      const question = questions[a.questionIndex];
      return wordSet.find(w => w.id === question?.wordId);
    })
    .filter(Boolean) as WordItem[];

  return (
    <div>
      <ExamResult
        result={result}
        onRetry={handleRetry}
        onFinish={handleFinish}
        onReviewIncorrect={handleReviewIncorrect}
        incorrectWords={incorrectWords}
      />
    </div>
  );
}
