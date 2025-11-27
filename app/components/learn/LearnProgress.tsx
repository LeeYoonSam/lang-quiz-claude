'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LearnProgressProps {
  current: number;
  total: number;
}

export default function LearnProgress({ current, total }: LearnProgressProps) {
  const percentage = (current / total) * 100;

  return (
    <div
      role="region"
      aria-label={`학습 진행률: ${current}/${total}`}
      className="w-full space-y-2"
    >
      {/* Progress text */}
      <div className="flex justify-center">
        <p className="text-sm font-medium text-neutral-600">
          {current} / {total}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
        <motion.div
          data-testid="progress-bar"
          className="h-full bg-blue-600"
          initial={{ width: '0%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
}
