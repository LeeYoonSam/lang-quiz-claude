'use client';

import React from 'react';
import { cn } from '@/app/lib/utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'card' | 'avatar';
  count?: number;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = 'text', count = 1, className, ...props }, ref) => {
    const baseStyles = 'bg-neutral-200 rounded animate-pulse';

    const variantStyles: Record<string, string> = {
      text: 'h-4 w-3/4',
      card: 'h-48 w-full rounded-lg',
      avatar: 'h-12 w-12 rounded-full',
    };

    const skeletons = Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        ref={i === 0 ? ref : undefined}
        className={cn(baseStyles, variantStyles[variant], className, i > 0 && 'mt-2')}
        {...(i === 0 ? props : {})}
      />
    ));

    return count === 1 ? skeletons[0] : <div className="space-y-2">{skeletons}</div>;
  }
);
Skeleton.displayName = 'Skeleton';

export { Skeleton };
