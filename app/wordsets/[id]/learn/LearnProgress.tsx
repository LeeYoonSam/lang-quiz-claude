/**
 * LearnProgress Component
 *
 * Displays current progress with text and animated progress bar.
 */

'use client';

import { motion } from 'framer-motion';
import type { LearnProgressProps } from '@/app/types/learn';

export function LearnProgress({ current, total }: LearnProgressProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="flex items-center gap-4">
      <span
        className="text-sm font-semibold text-gray-700 whitespace-nowrap"
        data-testid="progress-text"
      >
        {current} / {total}
      </span>

      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-600"
          initial={{ width: '0%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: 'easeInOut' as const }}
          data-testid="progress-bar"
        />
      </div>
    </div>
  );
}
