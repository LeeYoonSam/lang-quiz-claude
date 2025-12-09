/**
 * LearnComplete Component
 *
 * Displays completion screen with options to retry or return to word set.
 */

'use client';

import type { LearnCompleteProps } from '@/app/types/learn';

export function LearnComplete({
  wordSetName,
  wordCount,
  duration,
  onRetry,
  onExit,
}: LearnCompleteProps) {
  const formatDuration = (ms?: number) => {
    if (!ms) return '';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}분 ${remainingSeconds}초`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-6">🎉</div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">학습을 완료했습니다!</h1>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <p className="text-gray-700 mb-4">
            <span className="font-bold text-lg text-blue-600">{wordCount}</span>개 단어를
            학습했습니다
          </p>
          {duration && (
            <p className="text-gray-700">
              소요 시간: <span className="font-bold text-lg text-blue-600">{formatDuration(duration)}</span>
            </p>
          )}
        </div>

        <div className="space-y-4">
          <button
            onClick={onRetry}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            data-testid="retry-button"
          >
            다시 학습
          </button>

          <button
            onClick={onExit}
            className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            data-testid="exit-button"
          >
            세트로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
