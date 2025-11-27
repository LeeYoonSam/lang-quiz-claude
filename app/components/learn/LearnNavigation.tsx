'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface LearnNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  onComplete: () => void;
  isFirstCard: boolean;
  isLastCard: boolean;
}

export default function LearnNavigation({
  onPrevious,
  onNext,
  onComplete,
  isFirstCard,
  isLastCard,
}: LearnNavigationProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      {/* Previous button */}
      <button
        onClick={onPrevious}
        disabled={isFirstCard}
        aria-label={isFirstCard ? '이전 버튼 (첫 카드입니다)' : '이전 카드'}
        aria-disabled={isFirstCard}
        className="flex items-center gap-2 px-4 py-2 bg-neutral-200 text-neutral-900 rounded-lg hover:bg-neutral-300 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={20} />
        <span>이전</span>
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Next or Complete button */}
      {isLastCard ? (
        <button
          onClick={onComplete}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          aria-label="학습 완료"
        >
          <span>학습 완료</span>
          <span>✓</span>
        </button>
      ) : (
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          aria-label="다음 카드"
        >
          <span>다음</span>
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}
