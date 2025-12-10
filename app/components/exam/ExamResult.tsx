'use client';

import React, { useMemo } from 'react';
import { Button } from '@/app/components/ui/Button';
import { Card } from '@/app/components/ui/Card';
import type { ExamResult as ExamResultType, WordItem } from '@/lib/utils/exam/types';

interface ExamResultProps {
  result: ExamResultType;
  onReviewIncorrect: () => void;
  onRetry: () => void;
  onFinish: () => void;
  incorrectWords?: WordItem[];
}

/**
 * ExamResult Component
 * Displays exam results with score, stats, and action buttons
 */
export function ExamResult({
  result,
  onReviewIncorrect,
  onRetry,
  onFinish,
  incorrectWords = [],
}: ExamResultProps) {
  const { correctCount, incorrectCount, percentage, duration } = result;
  const totalQuestions = correctCount + incorrectCount;

  // Format elapsed time (milliseconds to MM:SS)
  const formattedTime = useMemo(() => {
    const totalSeconds = Math.floor(duration / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}분 ${seconds}초`;
  }, [duration]);

  // Determine message based on score
  const getMessage = () => {
    if (percentage === 100) {
      return '완벽한 점수입니다! 최고예요! 🌟';
    } else if (percentage >= 80) {
      return '훌륭한 성과입니다! 좋은 점수를 받았어요! 👏';
    } else if (percentage >= 60) {
      return '괜찮습니다. 더 노력하면 더 좋은 점수를 받을 수 있어요! 💪';
    } else {
      return '복습이 필요합니다. 다시 공부해보세요! 📚';
    }
  };

  const showCelebration = percentage >= 80;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-2xl space-y-8">
        {/* Celebration Animation */}
        {showCelebration && (
          <div className="text-center text-6xl animate-bounce mb-4">
            🎉
          </div>
        )}

        {/* Main Result Card */}
        <Card className="p-8 text-center space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">
            시험 결과
          </h1>

          {/* Score Display */}
          <div className="space-y-2">
            <div className="text-6xl font-bold text-blue-600">
              {percentage.toFixed(1)}점
            </div>
            <p className="text-2xl text-gray-700">
              {correctCount} / {totalQuestions} 정답
            </p>
          </div>

          {/* Message */}
          <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <p className="text-lg font-semibold text-blue-700">
              {getMessage()}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-600 text-sm">정답</p>
              <p className="text-2xl font-bold text-green-600">{correctCount}</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-600 text-sm">오답</p>
              <p className="text-2xl font-bold text-red-600">{incorrectCount}</p>
            </div>
          </div>

          {/* Time */}
          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="text-gray-600 text-sm">소요 시간</p>
            <p className="text-xl font-semibold text-gray-800">{formattedTime}</p>
          </div>
        </Card>

        {/* Incorrect Words Display */}
        {incorrectWords && incorrectWords.length > 0 && (
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">오답 목록</h2>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {incorrectWords.map((word) => (
                <div
                  key={word.id}
                  className="p-3 bg-red-50 border-l-4 border-red-500 rounded"
                >
                  <p className="font-semibold text-red-700">{word.word}</p>
                  <p className="text-red-600 text-sm">{word.meaning}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {incorrectWords && incorrectWords.length > 0 && (
            <Button
              variant="outline"
              size="lg"
              onClick={onReviewIncorrect}
              className="w-full"
            >
              오답 복습하기
            </Button>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              size="lg"
              onClick={onRetry}
              className="w-full"
            >
              다시 풀기
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={onFinish}
              className="w-full"
            >
              완료
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
