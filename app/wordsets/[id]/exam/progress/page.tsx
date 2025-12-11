'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useExamSession } from '@/app/hooks/useExamSession';
import { useExamSpeech } from '@/app/hooks/useExamSpeech';
import { MultipleChoiceQuestion } from '@/app/components/exam/MultipleChoiceQuestion';
import { ShortAnswerQuestion } from '@/app/components/exam/ShortAnswerQuestion';
import { ExamProgress } from '@/app/components/exam/ExamProgress';
import { wordsToWordItems } from '@/lib/utils/exam';
import type { WordItem } from '@/lib/utils/exam/types';
import type { Word } from '@/app/types/learn';

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

  // State for loaded word set data
  const [wordSet, setWordSet] = useState<WordItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [shortAnswer, setShortAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  // Initialize exam session and speech hooks
  const {
    status,
    questions,
    currentIndex,
    direction,
    answers,
    submitAnswer,
    nextQuestion,
    finishExam,
  } = useExamSession(wordSetId, wordSet);

  const { speak } = useExamSpeech();

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

  // Auto-redirect if no active exam
  useEffect(() => {
    if (!isLoading && (status !== 'in-progress' || questions.length === 0)) {
      router.push('./');
    }
  }, [status, questions.length, router, isLoading]);

  // Reset answer state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setShortAnswer('');
    setShowResult(false);
    setIsAnswerCorrect(false);
  }, [currentIndex]);

  // Speak word for reverse direction
  useEffect(() => {
    if (
      direction === 'reverse' &&
      questions.length > 0 &&
      currentIndex < questions.length
    ) {
      const currentQuestion = questions[currentIndex];
      const word = wordSet.find(w => w.id === currentQuestion.wordId);
      if (word) {
        speak(word.word, 'en-US');
      }
    }
  }, [currentIndex, direction, questions, wordSet, speak]);

  const handleSelectAnswer = useCallback((answer: string) => {
    setSelectedAnswer(answer);
  }, []);

  const handleShortAnswerChange = useCallback((answer: string) => {
    setShortAnswer(answer);
  }, []);

  const handleAnswerSubmit = useCallback(() => {
    if (status !== 'in-progress' || questions.length === 0) {
      return;
    }

    const currentQuestion = questions[currentIndex];
    const userAnswer = currentQuestion.type === 'multiple-choice'
      ? selectedAnswer || ''
      : shortAnswer;

    if (!userAnswer.trim()) {
      return;
    }

    // Check if answer is correct
    const isCorrect = userAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();
    setIsAnswerCorrect(isCorrect);

    // Submit answer to session
    submitAnswer(userAnswer);
    setShowResult(true);
  }, [status, questions, currentIndex, selectedAnswer, shortAnswer, submitAnswer]);

  const handleNextQuestion = useCallback(() => {
    const isLastQuestion = currentIndex === questions.length - 1;

    if (isLastQuestion) {
      finishExam();
      router.push('./result');
    } else {
      nextQuestion();
    }
  }, [currentIndex, questions.length, finishExam, nextQuestion, router]);

  if (isLoading || status !== 'in-progress' || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

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
            selectedAnswer={selectedAnswer}
            onSelectAnswer={handleSelectAnswer}
            showResult={showResult}
            isCorrect={isAnswerCorrect}
            disabled={showResult}
            showPronunciationButton={direction === 'reverse'}
            onPronounce={() => {
              const word = wordSet.find(w => w.id === currentQuestion.wordId);
              if (word) {
                speak(word.word, 'en-US');
              }
            }}
          />
        ) : (
          <ShortAnswerQuestion
            question={currentQuestion}
            userAnswer={shortAnswer}
            onAnswerChange={handleShortAnswerChange}
            onSubmit={showResult ? handleNextQuestion : handleAnswerSubmit}
            showResult={showResult}
            isCorrect={isAnswerCorrect}
            disabled={showResult}
            showPronunciationButton={direction === 'reverse'}
            onPronounce={() => {
              const word = wordSet.find(w => w.id === currentQuestion.wordId);
              if (word) {
                speak(word.word, 'en-US');
              }
            }}
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
