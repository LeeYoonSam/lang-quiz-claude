'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/app/lib/utils/cn';
import { Button } from '@/app/components/ui/Button';
import type { ExamQuestion } from '@/lib/utils/exam/types';

interface ShortAnswerQuestionProps {
  question: ExamQuestion;
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  showResult?: boolean;
  isCorrect?: boolean;
  disabled?: boolean;
  showPronunciationButton?: boolean;
  onPronounce?: () => void;
}

/**
 * ShortAnswerQuestion Component
 * Displays a short-answer question with text input field
 */
export function ShortAnswerQuestion({
  question,
  userAnswer,
  onAnswerChange,
  onSubmit,
  showResult = false,
  isCorrect = false,
  disabled = false,
  showPronunciationButton = false,
  onPronounce,
}: ShortAnswerQuestionProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when mounted
  useEffect(() => {
    if (!disabled && !showResult && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled, showResult]);

  if (question.type !== 'short-answer') {
    return null;
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && userAnswer.trim()) {
      onSubmit();
    }
  };

  const isSubmitDisabled = !userAnswer.trim() || disabled;

  return (
    <div className="w-full space-y-6">
      {/* Question Prompt */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          {question.prompt}
        </h2>
      </div>

      {/* Pronunciation Button for Reverse Mode */}
      {showPronunciationButton && (
        <div className="text-center">
          <button
            onClick={onPronounce}
            className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition"
            disabled={disabled || showResult}
          >
            🔊 다시 듣기
          </button>
        </div>
      )}

      {/* Answer Input */}
      <div className="space-y-3">
        <input
          ref={inputRef}
          type="text"
          value={userAnswer}
          onChange={(e) => onAnswerChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="답변을 입력하세요"
          disabled={disabled || showResult}
          className={cn(
            'w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none focus:ring-2 transition',
            disabled && 'opacity-50 cursor-not-allowed',
            showResult && isCorrect
              ? 'border-green-500 bg-green-50 focus:ring-green-400'
              : showResult && !isCorrect
              ? 'border-red-500 bg-red-50 focus:ring-red-400'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-400'
          )}
        />
      </div>

      {/* Submit Button */}
      <Button
        variant="primary"
        size="lg"
        onClick={onSubmit}
        disabled={isSubmitDisabled}
        className="w-full"
      >
        {showResult ? '다음' : '제출'}
      </Button>

      {/* Result Feedback */}
      {showResult && (
        <div className={cn(
          'p-4 rounded-lg text-center font-semibold space-y-2',
          isCorrect
            ? 'bg-green-100 border-2 border-green-500 text-green-700'
            : 'bg-red-100 border-2 border-red-500 text-red-700'
        )}>
          {isCorrect ? (
            <p>정답입니다! 🎉</p>
          ) : (
            <div>
              <p>오답입니다.</p>
              <p className="text-sm mt-1">정답: {question.correctAnswer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
