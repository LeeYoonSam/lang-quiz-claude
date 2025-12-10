'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useExamSession } from '@/app/hooks/useExamSession';
import { useExamSpeech } from '@/app/hooks/useExamSpeech';
import { MultipleChoiceQuestion } from '@/app/components/exam/MultipleChoiceQuestion';
import { ShortAnswerQuestion } from '@/app/components/exam/ShortAnswerQuestion';
import { ExamProgress } from '@/app/components/exam/ExamProgress';
import type { WordItem } from '@/lib/utils/exam/types';

/**
 * Exam Progress Page
 *
 * Route: /wordsets/[id]/exam/progress
 *
 * Displays exam questions one by one:
 * - Shows current question with appropriate component type
 * - Displays exam progress
 * - Handles answer submission
 * - Auto-redirects to result page when exam is completed
 *
 * Features:
 * - Supports both multiple-choice and short-answer questions
 * - Speech synthesis for reverse mode (word pronunciation)
 * - Real-time answer validation via useExamSession
 */
export default function ProgressPage() {
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

  // Initialize exam session and speech hooks
  const {
    status,
    questions,
    currentIndex,
    direction,
    submitAnswer,
    nextQuestion,
    finishExam,
  } = useExamSession(wordSetId, mockWordSet);

  const { speak } = useExamSpeech();

  // Auto-redirect if no active exam
  useEffect(() => {
    if (status !== 'in-progress' || questions.length === 0) {
      router.push('./');
    }
  }, [status, questions.length, router]);

  // Speak word for reverse direction
  useEffect(() => {
    if (
      direction === 'reverse' &&
      questions.length > 0 &&
      currentIndex < questions.length
    ) {
      const currentQuestion = questions[currentIndex];
      // Extract word from prompt or use wordId to find word
      const word = mockWordSet.find(w => w.id === currentQuestion.wordId);
      if (word) {
        speak(word.word, 'en-US');
      }
    }
  }, [currentIndex, direction, questions, speak]);

  if (status !== 'in-progress' || questions.length === 0) {
    return null;
  }

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  /**
   * Handle answer submission
   */
  const handleAnswerSubmit = (answer: string) => {
    submitAnswer(answer);

    if (isLastQuestion) {
      // Finish exam and navigate to result page
      finishExam();
      router.push('./result');
    } else {
      // Move to next question
      nextQuestion();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <ExamProgress
        currentIndex={currentIndex}
        totalQuestions={questions.length}
      />

      {/* Question Display */}
      <div className="flex-1 flex items-center justify-center p-4">
        {currentQuestion.type === 'multiple-choice' ? (
          <MultipleChoiceQuestion
            question={currentQuestion}
            onSubmit={handleAnswerSubmit}
          />
        ) : (
          <ShortAnswerQuestion
            question={currentQuestion}
            onSubmit={handleAnswerSubmit}
          />
        )}
      </div>

      {/* Footer with question number */}
      <div className="py-4 text-center text-sm text-gray-600">
        Question {currentIndex + 1} of {questions.length}
      </div>
    </div>
  );
}
