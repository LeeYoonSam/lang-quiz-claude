/**
 * LearnModeSelect Component
 *
 * Displays learning mode selection screen: Sequential or Random.
 */

'use client';

import type { LearnModeSelectProps } from '@/app/types/learn';

export function LearnModeSelect({
  wordSetName,
  wordCount,
  onModeSelect,
  onBack,
}: LearnModeSelectProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 mb-6 font-semibold"
          aria-label="돌아가기"
          data-testid="back-button"
        >
          ← 돌아가기
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">{wordSetName}</h1>
        <p className="text-gray-600 mb-8">{wordCount}개 단어를 학습합니다</p>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">학습 방법을 선택하세요</h2>

        <div className="space-y-4">
          <button
            onClick={() => onModeSelect('sequential')}
            className="w-full p-6 border-2 border-blue-300 hover:border-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-left"
            data-testid="sequential-button"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">순서대로 학습</h3>
            <p className="text-gray-600">단어 세트의 원래 순서대로 학습합니다</p>
          </button>

          <button
            onClick={() => onModeSelect('random')}
            className="w-full p-6 border-2 border-green-300 hover:border-green-600 hover:bg-green-50 rounded-lg transition-colors text-left"
            data-testid="random-button"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">랜덤 학습</h3>
            <p className="text-gray-600">단어를 무작위 순서로 학습합니다</p>
          </button>
        </div>
      </div>
    </div>
  );
}
