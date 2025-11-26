'use client';

import React from 'react';
import { cn } from '@/app/lib/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

/**
 * Button Component
 * Reusable button with variants, sizes, and loading states
 *
 * @example
 * <Button variant="primary" size="md">Save</Button>
 * <Button variant="outline" loading>Loading...</Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, disabled, className, children, ...props }, ref) => {
    // Variant styles
    const variantStyles: Record<ButtonVariant, string> = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
      secondary: 'bg-neutral-600 text-white hover:bg-neutral-700 active:bg-neutral-800',
      outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 active:bg-primary-100',
      ghost: 'text-primary-600 hover:bg-primary-50 active:bg-primary-100',
    };

    // Size styles
    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    // Base styles - use actual classes for disabled state
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 ' +
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500';

    const disabledClasses = (disabled || loading) ? 'opacity-50 cursor-not-allowed' : '';

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled || loading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], disabledClasses, className)}
        {...props}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span
              role="status"
              aria-hidden="true"
              className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
            />
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
