'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LearnCompleteProps {
  wordCount: number;
  onRestart: () => void;
  onReturn: () => void;
}

const containerVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function LearnComplete({
  wordCount,
  onRestart,
  onReturn,
}: LearnCompleteProps) {
  return (
    <motion.main
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center p-6"
    >
      {/* Celebration emoji */}
      <motion.div variants={itemVariants} className="text-6xl mb-4">
        🎉
      </motion.div>

      {/* Title */}
      <motion.h1
        variants={itemVariants}
        className="text-3xl md:text-4xl font-bold text-center text-green-900 mb-4"
      >
        학습을 완료했습니다!
      </motion.h1>

      {/* Statistics */}
      <motion.div variants={itemVariants} className="text-center mb-8 space-y-2">
        <p className="text-lg text-neutral-700">
          <span className="font-bold text-green-600">{wordCount}개</span> 단어를
          학습했습니다
        </p>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-4"
      >
        <button
          onClick={onRestart}
          aria-label="다시 학습"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          다시 학습
        </button>
        <button
          onClick={onReturn}
          aria-label="세트로 돌아가기"
          className="px-6 py-3 bg-neutral-200 text-neutral-900 rounded-lg hover:bg-neutral-300 transition-colors font-medium"
        >
          세트로 돌아가기
        </button>
      </motion.div>
    </motion.main>
  );
}
