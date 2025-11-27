'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';

interface Word {
  id: string;
  text: string;
  meaning: string;
}

interface FlipCardProps {
  word: Word;
  isFlipped: boolean;
  onFlip: () => void;
  onSpeak: () => void;
  isSpeaking: boolean;
}

const flipVariants = {
  front: {
    rotateY: 0,
    transition: { duration: 0.6, ease: 'easeInOut' },
  },
  back: {
    rotateY: 180,
    transition: { duration: 0.6, ease: 'easeInOut' },
  },
};

const speakerVariants = {
  rest: { scale: 1 },
  speaking: {
    scale: [1, 1.2, 1],
    transition: { duration: 0.6, repeat: Infinity },
  },
};

export default function FlipCard({
  word,
  isFlipped,
  onFlip,
  onSpeak,
  isSpeaking,
}: FlipCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onFlip();
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Card */}
      <div
        ref={containerRef}
        data-testid="flip-card-container"
        onClick={onFlip}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={
          isFlipped
            ? `단어: ${word.text}, 클릭하여 뜻 보기`
            : `뜻: ${word.meaning}, 클릭하여 단어 보기`
        }
        className="w-[90vw] max-w-[400px] md:w-[500px] lg:w-[600px] h-[300px] md:h-[350px] lg:h-[400px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
        style={{ perspective: '1000px' }}
      >
        <motion.div
          data-testid="flip-card-inner"
          variants={flipVariants}
          animate={isFlipped ? 'back' : 'front'}
          initial={false}
          className="w-full h-full"
          style={{
            transformStyle: 'preserve-3d' as const,
          }}
        >
          {/* Front side (Meaning) */}
          <div
            className="absolute w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg flex flex-col items-center justify-center p-6"
            style={{ backfaceVisibility: 'hidden' as const }}
          >
            <div className="text-center space-y-4">
              <p className="text-sm text-blue-600 font-medium">뜻</p>
              <p className="text-4xl md:text-5xl font-bold text-blue-900 break-words">
                {word.meaning}
              </p>
              <p className="text-sm text-blue-600">클릭하여 단어 보기</p>
            </div>
          </div>

          {/* Back side (Word) */}
          <div
            className="absolute w-full h-full bg-white rounded-lg shadow-lg flex flex-col items-center justify-center p-6"
            style={{
              backfaceVisibility: 'hidden' as const,
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="text-center space-y-4">
              <p className="text-sm text-neutral-600 font-medium">단어</p>
              <p className="text-5xl md:text-6xl font-bold text-neutral-900 break-words">
                {word.text}
              </p>
              <p className="text-sm text-neutral-600">(발음 버튼으로 재생)</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Speak button */}
      <button
        onClick={onSpeak}
        disabled={isSpeaking}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        aria-label={isSpeaking ? '음성 재생 중' : '음성 듣기'}
      >
        <motion.div
          variants={speakerVariants}
          animate={isSpeaking ? 'speaking' : 'rest'}
        >
          <Volume2 size={20} />
        </motion.div>
        <span>{isSpeaking ? '재생 중...' : '음성 듣기'}</span>
      </button>
    </div>
  );
}
