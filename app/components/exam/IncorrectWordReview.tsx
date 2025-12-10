'use client';

import React from 'react';
import { Button } from '@/app/components/ui/Button';
import { Card } from '@/app/components/ui/Card';
import type { ExamQuestion } from '@/lib/utils/exam/types';

interface IncorrectAnswer {
  question: ExamQuestion;
  userAnswer: string;
  correctAnswer: string;
}

interface IncorrectWordReviewProps {
  incorrectAnswers: IncorrectAnswer[];
  onClose: () => void;
  onAddToStudyList?: (wordIds: string[]) => void;
  onSpeak?: (text: string) => void;
}

/**
 * IncorrectWordReview Component
 * Displays incorrect answers with user answers and correct answers
 */
export function IncorrectWordReview({
  incorrectAnswers,
  onClose,
  onAddToStudyList,
  onSpeak,
}: IncorrectWordReviewProps) {
  const handleAddToStudyList = () => {
    if (onAddToStudyList) {
      const wordIds = incorrectAnswers.map((item) => item.question.wordId);
      onAddToStudyList(wordIds);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-2xl space-y-6">
        <Card className="p-8 space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">
            오답 복습
          </h1>

          {incorrectAnswers.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <p className="text-2xl font-semibold text-green-600">
                🎉 완벽해요!
              </p>
              <p className="text-gray-600">
                모든 문제를 정답했습니다!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Incorrect Answers List */}
              <ul className="space-y-4 max-h-96 overflow-y-auto">
                {incorrectAnswers.map((item, index) => (
                  <li
                    key={index}
                    className="p-4 bg-gray-50 border-l-4 border-red-500 rounded-lg space-y-3"
                  >
                    {/* Question */}
                    <div>
                      <p className="text-sm text-gray-600 font-medium">문제</p>
                      <p className="text-lg font-semibold text-gray-900 break-words">
                        {item.question.prompt}
                      </p>
                    </div>

                    {/* User Answer (Red) */}
                    <div>
                      <p className="text-sm text-red-600 font-medium">
                        나의 답변 (틀림)
                      </p>
                      <p className="text-base text-red-700 break-words">
                        {item.userAnswer}
                      </p>
                    </div>

                    {/* Correct Answer (Green) */}
                    <div>
                      <p className="text-sm text-green-600 font-medium">
                        정답
                      </p>
                      <p className="text-base text-green-700 break-words">
                        {item.correctAnswer}
                      </p>
                    </div>

                    {/* Pronunciation Button */}
                    <button
                      onClick={() => onSpeak?.(item.question.prompt)}
                      disabled={!onSpeak}
                      className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-600 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      🔊 다시 듣기
                    </button>
                  </li>
                ))}
              </ul>

              {/* Add to Study List Button */}
              {onAddToStudyList && (
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleAddToStudyList}
                  className="w-full mt-4"
                >
                  학습 목록에 추가하기
                </Button>
              )}
            </div>
          )}
        </Card>

        {/* Close Button */}
        <Button
          variant="primary"
          size="lg"
          onClick={onClose}
          className="w-full"
        >
          확인
        </Button>
      </div>
    </div>
  );
}
