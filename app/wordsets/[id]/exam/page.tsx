'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useExamSession } from '@/app/hooks/useExamSession';
import { ExamConfigScreen } from '@/app/components/exam/ExamConfigScreen';
import type { WordItem } from '@/lib/utils/exam/types';

/**
 * Exam Config Page
 *
 * Route: /wordsets/[id]/exam
 *
 * Displays exam configuration screen where users can:
 * - Select exam mode (multiple-choice, short-answer, mixed)
 * - Select question direction (forward, reverse)
 * - Choose number of questions
 *
 * Integrates with useExamSession to manage exam state
 */
export default function ExamPage() {
  const router = useRouter();
  const params = useParams();
  const wordSetId = params.id as string;

  // Placeholder for actual word set data
  // In production, this would be fetched from an API based on wordSetId
  const [wordSet, setWordSet] = useState<WordItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize exam session hook
  const { startExam } = useExamSession(wordSetId, wordSet);

  // Load word set data
  useEffect(() => {
    const loadWordSet = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/wordsets/${wordSetId}`);
        // const data = await response.json();
        // setWordSet(data.words);

        // Mock data for now
        const mockWords: WordItem[] = [
          { id: '1', word: 'apple', meaning: 'A red fruit' },
          { id: '2', word: 'banana', meaning: 'A yellow fruit' },
          { id: '3', word: 'cherry', meaning: 'A small red fruit' },
          { id: '4', word: 'date', meaning: 'A sweet dried fruit' },
          { id: '5', word: 'elderberry', meaning: 'A dark purple berry' },
        ];
        setWordSet(mockWords);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load word set';
        setError(errorMessage);
        console.error('Error loading word set:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (wordSetId) {
      loadWordSet();
    }
  }, [wordSetId]);

  /**
   * Handle exam start
   * Calls startExam with config and navigates to progress page
   */
  const handleStartExam = (config: any) => {
    startExam(config);
    router.push('./progress');
  };

  /**
   * Handle cancel
   * Navigates back to word set detail page
   */
  const handleCancel = () => {
    router.push('./');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading exam settings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div>
      <ExamConfigScreen
        wordSet={wordSet}
        onStart={handleStartExam}
        onCancel={handleCancel}
      />
    </div>
  );
}
