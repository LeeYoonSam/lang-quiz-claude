import { renderHook, act } from '@testing-library/react';
import { useKeyboard } from '../useKeyboard';

describe('useKeyboard Hook', () => {
  const handlers = {
    onFlip: jest.fn(),
    onNext: jest.fn(),
    onPrevious: jest.fn(),
    onExit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clean up event listeners
    jest.clearAllTimers();
  });

  describe('Space key', () => {
    it('should call onFlip when Space key is pressed', () => {
      renderHook(() => useKeyboard(handlers));

      const event = new KeyboardEvent('keydown', { key: ' ' });
      act(() => {
        window.dispatchEvent(event);
      });

      expect(handlers.onFlip).toHaveBeenCalledTimes(1);
    });

    it('should prevent default behavior for Space key', () => {
      renderHook(() => useKeyboard(handlers));

      const event = new KeyboardEvent('keydown', { key: ' ' });
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

      act(() => {
        window.dispatchEvent(event);
      });

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Arrow keys', () => {
    it('should call onNext when ArrowRight is pressed', () => {
      renderHook(() => useKeyboard(handlers));

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      act(() => {
        window.dispatchEvent(event);
      });

      expect(handlers.onNext).toHaveBeenCalledTimes(1);
    });

    it('should call onPrevious when ArrowLeft is pressed', () => {
      renderHook(() => useKeyboard(handlers));

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      act(() => {
        window.dispatchEvent(event);
      });

      expect(handlers.onPrevious).toHaveBeenCalledTimes(1);
    });
  });

  describe('Escape key', () => {
    it('should call onExit when Escape key is pressed', () => {
      renderHook(() => useKeyboard(handlers));

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      act(() => {
        window.dispatchEvent(event);
      });

      expect(handlers.onExit).toHaveBeenCalledTimes(1);
    });
  });

  describe('Other keys', () => {
    it('should not call any handler for other keys', () => {
      renderHook(() => useKeyboard(handlers));

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      act(() => {
        window.dispatchEvent(event);
      });

      expect(handlers.onFlip).not.toHaveBeenCalled();
      expect(handlers.onNext).not.toHaveBeenCalled();
      expect(handlers.onPrevious).not.toHaveBeenCalled();
      expect(handlers.onExit).not.toHaveBeenCalled();
    });
  });

  describe('Event listener cleanup', () => {
    it('should remove event listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

      const { unmount } = renderHook(() => useKeyboard(handlers));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Multiple key presses', () => {
    it('should handle multiple key presses correctly', () => {
      renderHook(() => useKeyboard(handlers));

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      });
      expect(handlers.onFlip).toHaveBeenCalledTimes(1);

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      });
      expect(handlers.onNext).toHaveBeenCalledTimes(1);

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      });
      expect(handlers.onPrevious).toHaveBeenCalledTimes(1);

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      });
      expect(handlers.onExit).toHaveBeenCalledTimes(1);
    });
  });

  describe('Handler updates', () => {
    it('should use updated handlers', () => {
      const initialHandlers = {
        onFlip: jest.fn(),
        onNext: jest.fn(),
        onPrevious: jest.fn(),
        onExit: jest.fn(),
      };

      const { rerender } = renderHook(
        ({ handlers: h }) => useKeyboard(h),
        { initialProps: { handlers: initialHandlers } }
      );

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      });

      expect(initialHandlers.onFlip).toHaveBeenCalledTimes(1);

      // Update handlers
      const updatedHandlers = {
        onFlip: jest.fn(),
        onNext: jest.fn(),
        onPrevious: jest.fn(),
        onExit: jest.fn(),
      };

      rerender({ handlers: updatedHandlers });

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      });

      expect(updatedHandlers.onFlip).toHaveBeenCalledTimes(1);
      // Initial handler should not be called again
      expect(initialHandlers.onFlip).toHaveBeenCalledTimes(1);
    });
  });

  describe('Key combinations', () => {
    it('should handle Shift+Space correctly', () => {
      renderHook(() => useKeyboard(handlers));

      const event = new KeyboardEvent('keydown', {
        key: ' ',
        shiftKey: true,
      });
      act(() => {
        window.dispatchEvent(event);
      });

      // Should still trigger onFlip (we only care about the key, not modifiers)
      expect(handlers.onFlip).toHaveBeenCalledTimes(1);
    });
  });
});
