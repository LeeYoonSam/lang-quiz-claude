import { useEffect } from 'react';

export interface KeyboardHandlers {
  onFlip: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onExit: () => void;
}

export function useKeyboard(handlers: KeyboardHandlers): void {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
          // Space: flip card
          e.preventDefault();
          handlers.onFlip();
          break;
        case 'ArrowRight':
          // Right arrow: next card
          handlers.onNext();
          break;
        case 'ArrowLeft':
          // Left arrow: previous card
          handlers.onPrevious();
          break;
        case 'Escape':
          // Escape: exit learning
          handlers.onExit();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlers]);
}
