/**
 * FlipCard Component
 *
 * 3D flip card animation using Framer Motion.
 * Displays word on front side and meaning on back side.
 */

'use client';

import { motion } from 'framer-motion';
import type { FlipCardProps } from '@/app/types/learn';

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

export function FlipCard({
  word,
  isFlipped,
  onFlip,
  onSpeak,
  isSpeaking,
}: FlipCardProps) {
  return (
    <motion.div
      className="w-[90vw] max-w-[400px] md:w-[500px] lg:w-[600px] h-[300px] md:h-[350px] lg:h-[400px] cursor-pointer"
      onClick={onFlip}
      data-testid="flip-card"
      role="button"
      tabIndex={0}
      aria-label={isFlipped ? `단어: ${word.text}` : `뜻: ${word.meaning}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onFlip();
        }
      }}
    >
      <motion.div
        className="w-full h-full relative"
        variants={flipVariants}
        animate={isFlipped ? 'back' : 'front'}
        style={{
          transformStyle: 'preserve-3d' as const,
          perspective: '1000px',
        }}
      >
        {/* Front side - Meaning */}
        <motion.div
          className="absolute w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center"
          style={{
            backfaceVisibility: 'hidden' as const,
          }}
        >
          <div className="text-center">
            <p className="text-sm text-blue-600 mb-4">뜻</p>
            <p className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900 break-words">
              {word.meaning}
            </p>
            <p className="text-xs md:text-sm text-blue-500 mt-6">클릭하여 단어 보기</p>
          </div>
        </motion.div>

        {/* Back side - Word */}
        <motion.div
          className="absolute w-full h-full bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center"
          style={{
            backfaceVisibility: 'hidden' as const,
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="text-center w-full">
            <p className="text-sm text-gray-600 mb-4">단어</p>
            <p className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 break-words mb-6">
              {word.text}
            </p>

            {/* Speak Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSpeak();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              aria-label={isSpeaking ? '재생 중...' : '음성 듣기'}
            >
              {isSpeaking ? (
                <>
                  <span className="text-lg animate-pulse">🔊</span>
                  <span className="text-sm">재생 중...</span>
                </>
              ) : (
                <>
                  <span className="text-lg">🔊</span>
                  <span className="text-sm">음성 듣기</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
