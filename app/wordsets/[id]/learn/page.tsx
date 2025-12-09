/**
 * Learn Page
 *
 * Main learning experience page that manages the complete learning flow:
 * 1. Mode selection (sequential/random)
 * 2. Flip card learning with TTS
 * 3. Navigation and progress tracking
 * 4. Completion screen
 */

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FlipCard } from './FlipCard';
import { LearnProgress } from './LearnProgress';
import { LearnNavigation } from './LearnNavigation';
import { LearnModeSelect } from './LearnModeSelect';
import { LearnComplete } from './LearnComplete';
import { useLearnSession } from '@/app/hooks/useLearnSession';
import { useSpeech } from '@/app/hooks/useSpeech';
import type { LearnMode } from '@/app/types/learn';

type PageState = 'mode-select' | 'learning' | 'complete';

export default function LearnPage() {
  const params = useParams();
  const router = useRouter();
  const wordSetId = params.id as string;

  const [pageState, setPageState] = useState<PageState>('mode-select');
  const [mode, setMode] = useState<LearnMode>('sequential');
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [startTime] = useState(Date.now());

  // Fetch word set data
  const { data: wordset, isLoading, error } = useQuery({
    queryKey: ['wordsets', wordSetId],
    queryFn: async () => {
      const res = await fetch(`/api/wordsets/${wordSetId}`);
      if (!res.ok) throw new Error('Failed to fetch wordset');
      return res.json();
    },
  });

  // Learning session management
  const learnSession = useLearnSession(wordSetId, wordset?.words || [], mode);
  const { speak, isSpeaking } = useSpeech();

  // Handle mode selection
  const handleModeSelect = (selectedMode: LearnMode) => {
    setMode(selectedMode);
    setPageState('learning');
  };

  // Handle navigation
  const handlePrevious = () => {
    learnSession.previous();
  };

  const handleNext = () => {
    const { currentIndex, words } = learnSession;
    if (currentIndex === words.length - 1) {
      handleComplete();
    } else {
      learnSession.next();
    }
  };

  // Handle card flip with TTS
  const handleFlip = () => {
    learnSession.flip();
    if (!learnSession.isFlipped) {
      // Card is about to be flipped to back, trigger TTS
      const currentWord = learnSession.words[learnSession.currentIndex];
      if (currentWord) {
        speak(currentWord.text, 'en-US');
      }
    }
  };

  // Handle speak button
  const handleSpeak = () => {
    const currentWord = learnSession.words[learnSession.currentIndex];
    if (currentWord) {
      speak(currentWord.text, 'en-US');
    }
  };

  // Handle learning complete
  const handleComplete = () => {
    const duration = Date.now() - startTime;
    setPageState('complete');
  };

  // Handle retry
  const handleRetry = () => {
    learnSession.reset();
    setPageState('mode-select');
    setMode('sequential');
  };

  // Handle exit
  const handleExit = () => {
    router.push(`/wordsets/${wordSetId}`);
  };

  // Handle back button
  const handleBack = () => {
    if (pageState === 'learning') {
      setShowExitDialog(true);
    } else if (pageState === 'mode-select') {
      router.push(`/wordsets/${wordSetId}`);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    if (pageState !== 'learning') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
          e.preventDefault();
          handleFlip();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (learnSession.currentIndex > 0) {
            handlePrevious();
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
        case 'Escape':
          e.preventDefault();
          handleBack();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pageState, learnSession.currentIndex, learnSession.isFlipped]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error || !wordset) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">오류: 단어 세트를 찾을 수 없습니다</p>
        </div>
      </div>
    );
  }

  if (!wordset.words || wordset.words.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">학습하려면 단어를 추가하세요</p>
          <button
            onClick={() => router.push(`/wordsets/${wordSetId}`)}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  // Render page states
  if (pageState === 'mode-select') {
    return (
      <LearnModeSelect
        wordSetId={wordSetId}
        wordSetName={wordset.name}
        wordCount={wordset.words.length}
        onModeSelect={handleModeSelect}
        onBack={handleBack}
      />
    );
  }

  if (pageState === 'complete') {
    const duration = Date.now() - startTime;
    return (
      <LearnComplete
        wordSetId={wordSetId}
        wordSetName={wordset.name}
        wordCount={wordset.words.length}
        duration={duration}
        onRetry={handleRetry}
        onExit={handleExit}
      />
    );
  }

  // Learning view
  const currentWord = learnSession.words[learnSession.currentIndex];
  const isFirst = learnSession.currentIndex === 0;
  const isLast = learnSession.currentIndex === learnSession.words.length - 1;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← 뒤로
          </button>
          <h1 className="text-xl font-semibold text-gray-900">{wordset.name}</h1>
          <LearnProgress
            current={learnSession.currentIndex + 1}
            total={learnSession.words.length}
          />
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-200">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{
            width: `${((learnSession.currentIndex + 1) / learnSession.words.length) * 100}%`,
          }}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        {currentWord && (
          <FlipCard
            word={currentWord}
            isFlipped={learnSession.isFlipped}
            onFlip={handleFlip}
            onSpeak={handleSpeak}
            isSpeaking={isSpeaking}
          />
        )}
      </main>

      {/* Navigation */}
      <LearnNavigation
        isFirst={isFirst}
        isLast={isLast}
        isSpeaking={isSpeaking}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSpeak={handleSpeak}
        onComplete={handleComplete}
      />

      {/* Exit Confirmation Dialog */}
      {showExitDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              학습을 중단하시겠습니까?
            </h2>
            <p className="text-gray-600 mb-6">진행 상태가 저장되지 않습니다.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowExitDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                아니오
              </button>
              <button
                onClick={() => {
                  setShowExitDialog(false);
                  handleExit();
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                예
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
