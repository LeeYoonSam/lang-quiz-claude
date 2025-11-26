'use client';

import React from 'react';
import { cn } from '@/app/lib/utils/cn';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error';
type BadgeSize = 'sm' | 'md';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    const variantStyles: Record<BadgeVariant, string> = {
      primary: 'bg-primary-100 text-primary-800',
      secondary: 'bg-neutral-100 text-neutral-800',
      success: 'bg-success-100 text-success-800',
      warning: 'bg-warning-100 text-warning-800',
      error: 'bg-error-100 text-error-800',
    };

    const sizeStyles: Record<BadgeSize, string> = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1 text-sm',
    };

    const baseStyles = 'inline-flex items-center font-medium rounded-full';

    return (
      <span ref={ref} className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)} {...props}>
        {children}
      </span>
    );
  }
);
Badge.displayName = 'Badge';

export { Badge };
