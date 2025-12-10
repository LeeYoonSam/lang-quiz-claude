'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/app/components/ui/Button';
import type { WordItem } from '@/lib/utils/exam/types';

export interface ExamConfig {
  mode: 'multiple-choice' | 'short-answer' | 'mixed';
  direction: 'forward' | 'reverse';
  questionCount: number;
}

interface ExamConfigScreenProps {
  wordSet: WordItem[];
  onStart: (config: ExamConfig) => void;
  onCancel?: () => void;
}

/**
 * ExamConfigScreen Component
 * Provides UI for users to configure exam settings:
 * - Mode selection (객관식, 주관식, 혼합)
 * - Direction selection (정방향, 역방향)
 * - Question count selection
 */
export function ExamConfigScreen({
  wordSet,
  onStart,
  onCancel,
}: ExamConfigScreenProps) {
  const [mode, setMode] = useState<ExamConfig['mode'] | undefined>();
  const [direction, setDirection] = useState<ExamConfig['direction'] | undefined>();
  const [questionCount, setQuestionCount] = useState(Math.min(5, wordSet.length));

  // Determine if multiple-choice mode has enough words
  const hasEnoughWordsForMultipleChoice = wordSet.length >= 4;
  const isMultipleChoiceSelected = mode === 'multiple-choice';
  const isInsufficientWordsWarning = isMultipleChoiceSelected && !hasEnoughWordsForMultipleChoice;

  // Determine if start button should be enabled
  const isStartButtonDisabled = !mode || !direction || isInsufficientWordsWarning;

  const handleStart = () => {
    if (mode && direction && !isInsufficientWordsWarning) {
      onStart({
        mode,
        direction,
        questionCount,
      });
    }
  };

  const maxQuestions = wordSet.length;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          시험 설정
        </h1>

        {/* Mode Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">시험 모드</h2>
          <div className="space-y-3">
            <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition">
              <input
                type="radio"
                name="mode"
                value="multiple-choice"
                checked={mode === 'multiple-choice'}
                onChange={(e) => setMode(e.target.value as ExamConfig['mode'])}
                className="w-4 h-4 text-blue-600"
              />
              <span className="ml-3 text-gray-700 font-medium">객관식 (4지선다)</span>
            </label>

            <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition">
              <input
                type="radio"
                name="mode"
                value="short-answer"
                checked={mode === 'short-answer'}
                onChange={(e) => setMode(e.target.value as ExamConfig['mode'])}
                className="w-4 h-4 text-blue-600"
              />
              <span className="ml-3 text-gray-700 font-medium">주관식 (단어 입력)</span>
            </label>

            <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition">
              <input
                type="radio"
                name="mode"
                value="mixed"
                checked={mode === 'mixed'}
                onChange={(e) => setMode(e.target.value as ExamConfig['mode'])}
                className="w-4 h-4 text-blue-600"
              />
              <span className="ml-3 text-gray-700 font-medium">혼합 (객관식 + 주관식)</span>
            </label>
          </div>

          {/* Insufficient Words Warning */}
          {isInsufficientWordsWarning && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-red-700 font-medium">
                객관식은 단어가 4개 이상이어야 합니다
              </p>
              <p className="text-red-600 text-sm mt-1">
                현재: {wordSet.length}개 단어
              </p>
            </div>
          )}
        </div>

        {/* Direction Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">출제 방향</h2>
          <div className="space-y-3">
            <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition">
              <input
                type="radio"
                name="direction"
                value="forward"
                checked={direction === 'forward'}
                onChange={(e) => setDirection(e.target.value as ExamConfig['direction'])}
                className="w-4 h-4 text-blue-600"
              />
              <span className="ml-3 text-gray-700 font-medium">
                정방향 (뜻 → 단어)
              </span>
            </label>

            <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition">
              <input
                type="radio"
                name="direction"
                value="reverse"
                checked={direction === 'reverse'}
                onChange={(e) => setDirection(e.target.value as ExamConfig['direction'])}
                className="w-4 h-4 text-blue-600"
              />
              <span className="ml-3 text-gray-700 font-medium">
                역방향 (단어 → 뜻)
              </span>
            </label>
          </div>
        </div>

        {/* Question Count Selection */}
        <div className="mb-8">
          <label className="block text-lg font-semibold text-gray-800 mb-4">
            문제 개수: {questionCount}개
          </label>
          <input
            type="range"
            min="5"
            max={maxQuestions}
            value={questionCount}
            onChange={(e) => setQuestionCount(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            aria-label="문제 개수"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>5개</span>
            <span>{maxQuestions}개</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-10">
          {onCancel && (
            <Button
              variant="outline"
              size="lg"
              onClick={onCancel}
              className="flex-1"
            >
              취소
            </Button>
          )}
          <Button
            variant="primary"
            size="lg"
            onClick={handleStart}
            disabled={isStartButtonDisabled}
            className="flex-1"
          >
            시험 시작
          </Button>
        </div>
      </div>
    </div>
  );
}
