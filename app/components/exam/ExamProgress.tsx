'use client';

import React, { useMemo } from 'react';

interface ExamProgressProps {
  currentIndex: number;
  totalQuestions: number;
  answeredCount: number;
  timeElapsed?: number;
}

/**
 * ExamProgress Component
 * Displays exam progress including progress bar, question counter, and elapsed time
 */
export function ExamProgress({
  currentIndex,
  totalQuestions,
  answeredCount,
  timeElapsed,
}: ExamProgressProps) {
  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    if (totalQuestions === 0) return 0;
    return (currentIndex / totalQuestions) * 100;
  }, [currentIndex, totalQuestions]);

  // Format elapsed time (milliseconds to MM:SS)
  const formattedTime = useMemo(() => {
    if (!timeElapsed) return null;
    const totalSeconds = Math.floor(timeElapsed / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}분 ${seconds}초`;
  }, [timeElapsed]);

  return (
    <div className="w-full bg-white border-b border-gray-200 p-6 shadow-sm">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div
            role="progressbar"
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            className="w-full h-3 bg-gray-200 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          {/* Question Counter */}
          <div className="text-center md:text-left">
            <p className="text-gray-700 font-semibold">
              문제 {currentIndex + 1}/{totalQuestions}
            </p>
          </div>

          {/* Answered Counter */}
          <div className="text-center">
            <p className="text-gray-700 font-semibold">
              답변 완료: {answeredCount}/{totalQuestions}
            </p>
          </div>

          {/* Elapsed Time */}
          {timeElapsed !== undefined && (
            <div className="text-center md:text-right">
              <p className="text-gray-700 font-semibold">
                소요 시간: {formattedTime}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
