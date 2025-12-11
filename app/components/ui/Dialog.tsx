'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/app/lib/utils/cn';

interface DialogContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextType | undefined>(undefined);

function useDialog() {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error('Dialog components must be used within a Dialog');
  }
  return context;
}

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

/**
 * Dialog Root Component
 * Manages dialog state and provides context to child components
 */
const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  ({ open: controlledOpen, onOpenChange, children }, ref) => {
    const [internalOpen, setInternalOpen] = useState(controlledOpen ?? false);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    const handleOpenChange = (newOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    };

    return (
      <DialogContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
        <div ref={ref}>{children}</div>
      </DialogContext.Provider>
    );
  }
);

Dialog.displayName = 'Dialog';

interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

/**
 * DialogTrigger Component
 * Button that opens the dialog when clicked
 */
const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ children, onClick, className, ...props }, ref) => {
    const { onOpenChange } = useDialog();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onOpenChange(true);
      onClick?.(e);
    };

    return (
      <button ref={ref} onClick={handleClick} className={className} {...props}>
        {children}
      </button>
    );
  }
);

DialogTrigger.displayName = 'DialogTrigger';

interface DialogOverlayProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * DialogOverlay Component
 * Backdrop/overlay that closes dialog when clicked
 */
const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlayProps>(
  ({ onClick, className }, ref) => {
    const { onOpenChange } = useDialog();

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onOpenChange(false);
      }
      onClick?.(e);
    };

    return (
      <motion.div
        ref={ref}
        role="presentation"
        onClick={handleClick}
        className={cn(
          'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm',
          className
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
    );
  }
);

DialogOverlay.displayName = 'DialogOverlay';

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * DialogContent Component
 * Main dialog container with modal functionality
 */
const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ children, className }, ref) => {
    const { open, onOpenChange } = useDialog();
    const contentRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    // Handle escape key
    useEffect(() => {
      if (!open) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onOpenChange(false);
        }
      };

      // Store previous focus
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Add event listener
      document.addEventListener('keydown', handleKeyDown);

      // Trap focus in dialog
      const focusableElements = contentRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) || [];

      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        // Restore focus to previous element
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }, [open, onOpenChange]);

    return (
      <AnimatePresence>
        {open && (
          <>
            <DialogOverlay />
            <motion.div
              ref={ref}
              role="dialog"
              aria-modal="true"
              className={cn(
                'fixed z-50 w-full max-w-md rounded-lg bg-white shadow-lg',
                'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
                'p-6 max-h-[90vh] overflow-y-auto',
                className
              )}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div ref={contentRef}>{children}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }
);

DialogContent.displayName = 'DialogContent';

interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

/**
 * DialogTitle Component
 * Semantic heading for dialog content
 */
const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, children, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn('text-xl font-semibold text-neutral-900 mb-2', className)}
      {...props}
    >
      {children}
    </h2>
  )
);

DialogTitle.displayName = 'DialogTitle';

interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

/**
 * DialogDescription Component
 * Optional description text for dialog
 */
const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-neutral-600 mb-4', className)}
      {...props}
    >
      {children}
    </p>
  )
);

DialogDescription.displayName = 'DialogDescription';

interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * DialogFooter Component
 * Footer section for action buttons
 */
const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

DialogFooter.displayName = 'DialogFooter';

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
  DialogFooter,
};
