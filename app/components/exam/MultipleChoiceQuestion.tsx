'use client';

import React from 'react';
import { cn } from '@/app/lib/utils/cn';
import type { ExamQuestion } from '@/lib/utils/exam/types';

interface MultipleChoiceQuestionProps {
  question: ExamQuestion;
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string) => void;
  showResult?: boolean;
  isCorrect?: boolean;
  disabled?: boolean;
  showPronunciationButton?: boolean;
  onPronounce?: () => void;
}

/**
 * MultipleChoiceQuestion Component
 * Displays a multiple-choice question with 4 answer options
 */
export function MultipleChoiceQuestion({
  question,
  selectedAnswer,
  onSelectAnswer,
  showResult = false,
  isCorrect = false,
  disabled = false,
  showPronunciationButton = false,
  onPronounce,
}: MultipleChoiceQuestionProps) {
  if (question.type !== 'multiple-choice' || !question.choices) {
    return null;
  }

  return (
    <div className="w-full space-y-6">
      {/* Question Prompt */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900" data-testid="question-prompt">
          {question.prompt}
        </h2>
      </div>

      {/* Pronunciation Button for Reverse Mode */}
      {showPronunciationButton && (
        <div className="text-center">
          <button
            onClick={onPronounce}
            className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition"
            disabled={disabled}
          >
            🔊 다시 듣기
          </button>
        </div>
      )}

      {/* Choice Buttons */}
      <div className="space-y-3">
        {question.choices.map((choice, index) => {
          const isSelected = selectedAnswer === choice;
          const isCorrectChoice = choice === question.correctAnswer;

          let buttonClassName = 'w-full p-4 rounded-lg border-2 transition text-left font-medium';

          if (showResult) {
            if (isCorrectChoice) {
              buttonClassName += ' bg-green-50 border-green-500 text-green-700';
            } else if (isSelected && !isCorrect) {
              buttonClassName += ' bg-red-50 border-red-500 text-red-700';
            } else {
              buttonClassName += ' bg-gray-50 border-gray-300 text-gray-600';
            }
          } else {
            if (isSelected) {
              buttonClassName += ' ring-2 ring-blue-400 border-blue-500 bg-blue-50';
            } else {
              buttonClassName += ' border-gray-300 hover:border-blue-400 bg-white';
            }
          }

          if (disabled) {
            buttonClassName += ' opacity-50 cursor-not-allowed';
          }

          return (
            <button
              key={index}
              data-testid={`choice-${index}`}
              onClick={() => !disabled && onSelectAnswer(choice)}
              className={buttonClassName}
              disabled={disabled || showResult}
              aria-pressed={isSelected}
              type="button"
            >
              {choice}
            </button>
          );
        })}
      </div>

      {/* Result Feedback */}
      {showResult && (
        <div
          data-testid="feedback-message"
          className={cn(
          'p-4 rounded-lg text-center font-semibold',
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
