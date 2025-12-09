/**
 * LearnNavigation Component
 *
 * Provides navigation controls: previous, speak, and next/complete buttons.
 */

'use client';

import type { LearnNavigationProps } from '@/app/types/learn';

export function LearnNavigation({
  isFirst,
  isLast,
  isSpeaking,
  onPrevious,
  onNext,
  onSpeak,
  onComplete,
}: LearnNavigationProps) {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 px-6">
      <div className="max-w-4xl mx-auto flex justify-between items-center gap-4">
        <button
          onClick={onPrevious}
          disabled={isFirst}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="이전 카드"
          data-testid="prev-button"
        >
          ← 이전
        </button>

        <button
          onClick={onSpeak}
          className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
          aria-label={isSpeaking ? '재생 중' : '음성 듣기'}
          data-testid="speak-button"
        >
          {isSpeaking ? '🔊 재생 중...' : '🔊 음성 듣기'}
        </button>

        {isLast ? (
          <button
            onClick={onComplete}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold"
            aria-label="학습 완료"
            data-testid="complete-button"
          >
            학습 완료 ✓
          </button>
        ) : (
          <button
            onClick={onNext}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="다음 카드"
            data-testid="next-button"
          >
            다음 →
          </button>
        )}
      </div>
    </footer>
  );
}
