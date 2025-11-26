'use client';

import React from 'react';
import { cn } from '@/app/lib/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, required, className, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;

    const baseStyles =
      'w-full px-4 py-2 border rounded-lg text-base transition-colors duration-200 ' +
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500';

    const borderStyles = error
      ? 'border-error-500 focus:ring-error-500'
      : 'border-neutral-300 focus:ring-primary-500';

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-neutral-900 mb-2">
            {label}
            {required && <span className="text-error-600 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={cn(baseStyles, borderStyles, className)}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-1 text-sm text-error-600">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-neutral-500">{helperText}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
