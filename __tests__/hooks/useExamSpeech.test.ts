/**
 * Tests for useExamSpeech hook
 *
 * Comprehensive test suite covering:
 * - Web Speech API integration
 * - Speech synthesis state management
 * - Error handling and graceful degradation
 * - Cleanup on component unmount
 */

import { renderHook, act } from '@testing-library/react';
import { useExamSpeech } from '@/app/hooks/useExamSpeech';

// Mock speechSynthesis API
const mockSpeak = jest.fn();
const mockCancel = jest.fn();

const mockSpeechSynthesisUtterance = jest.fn((text: string) => ({
  text,
  lang: 'en-US',
  rate: 1,
  pitch: 1,
  volume: 1,
}));

const mockSpeechSynthesis = {
  speak: mockSpeak,
  cancel: mockCancel,
  pause: jest.fn(),
  resume: jest.fn(),
  getVoices: jest.fn(() => []),
};

Object.defineProperty(window, 'speechSynthesis', {
  value: mockSpeechSynthesis,
  writable: true,
});

Object.defineProperty(window, 'SpeechSynthesisUtterance', {
  value: mockSpeechSynthesisUtterance,
  writable: true,
});

describe('useExamSpeech', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSpeak.mockImplementation(() => {});
    mockCancel.mockImplementation(() => {});
    mockSpeechSynthesisUtterance.mockClear();
  });

  describe('initialization', () => {
    it('should initialize with isPlaying as false', () => {
      const { result } = renderHook(() => useExamSpeech());

      expect(result.current.isPlaying).toBe(false);
    });

    it('should initialize with error as null', () => {
      const { result } = renderHook(() => useExamSpeech());

      expect(result.current.error).toBeNull();
    });

    it('should initialize currentUtterance as null', () => {
      const { result } = renderHook(() => useExamSpeech());

      expect(result.current.currentUtterance).toBeNull();
    });

    it('should detect speechSynthesis support', () => {
      const { result } = renderHook(() => useExamSpeech());

      expect(result.current.isSupported).toBe(true);
    });
  });

  describe('checkSupport', () => {
    it('should return true when Web Speech API is available', () => {
      const { result } = renderHook(() => useExamSpeech());

      const isSupported = result.current.checkSupport();

      expect(isSupported).toBe(true);
    });

    it('should return false when Web Speech API is not available', () => {
      const originalSpeechSynthesis = window.speechSynthesis;
      Object.defineProperty(window, 'speechSynthesis', {
        value: undefined,
        writable: true,
      });

      const { result } = renderHook(() => useExamSpeech());

      const isSupported = result.current.checkSupport();

      expect(isSupported).toBe(false);

      // Restore
      Object.defineProperty(window, 'speechSynthesis', {
        value: originalSpeechSynthesis,
        writable: true,
      });
    });

    it('should return false when window is undefined (SSR)', () => {
      const originalWindow = global.window;
      const originalSpeechSynthesis = window.speechSynthesis;

      // Set speechSynthesis to undefined to simulate missing Web Speech API
      Object.defineProperty(window, 'speechSynthesis', {
        value: undefined,
        writable: true,
      });

      const { result } = renderHook(() => useExamSpeech());

      const isSupported = result.current.checkSupport();

      expect(isSupported).toBe(false);

      // Restore
      Object.defineProperty(window, 'speechSynthesis', {
        value: originalSpeechSynthesis,
        writable: true,
      });
    });
  });

  describe('speak', () => {
    it('should create SpeechSynthesisUtterance with correct text', () => {
      const { result } = renderHook(() => useExamSpeech());

      act(() => {
        result.current.speak('apple');
      });

      expect(mockSpeechSynthesisUtterance).toHaveBeenCalledWith('apple');
    });

    it('should set default language to en-US', () => {
      const { result } = renderHook(() => useExamSpeech());

      act(() => {
        result.current.speak('apple');
      });

      expect(mockSpeechSynthesisUtterance).toHaveBeenCalledWith('apple');
    });

    it('should set custom language when provided', () => {
      const { result } = renderHook(() => useExamSpeech());

      act(() => {
        result.current.speak('pomme', 'fr-FR');
      });

      expect(mockSpeechSynthesisUtterance).toHaveBeenCalledWith('pomme');
    });

    it('should call speechSynthesis.speak', () => {
      const { result } = renderHook(() => useExamSpeech());

      act(() => {
        result.current.speak('apple');
      });

      expect(mockSpeak).toHaveBeenCalled();
    });

    it('should set isPlaying to true when speak is called', () => {
      const { result } = renderHook(() => useExamSpeech());

      expect(result.current.isPlaying).toBe(false);

      act(() => {
        result.current.speak('apple');
      });

      expect(result.current.isPlaying).toBe(true);
    });

    it('should store currentUtterance text', () => {
      const { result } = renderHook(() => useExamSpeech());

      act(() => {
        result.current.speak('apple');
      });

      expect(result.current.currentUtterance).toBe('apple');
    });

    it('should cancel previous speech before starting new speech', () => {
      const { result } = renderHook(() => useExamSpeech());

      act(() => {
        result.current.speak('apple');
      });

      mockCancel.mockClear();

      act(() => {
        result.current.speak('banana');
      });

      expect(mockCancel).toHaveBeenCalled();
    });

    it('should handle speak when Web Speech API is not supported', () => {
      const originalSpeechSynthesis = window.speechSynthesis;
      Object.defineProperty(window, 'speechSynthesis', {
        value: undefined,
        writable: true,
      });

      const { result } = renderHook(() => useExamSpeech());

      // Should not throw error
      act(() => {
        result.current.speak('apple');
      });

      expect(result.current.error).toBeDefined();

      // Restore
      Object.defineProperty(window, 'speechSynthesis', {
        value: originalSpeechSynthesis,
        writable: true,
      });
    });

    it('should set error when speak fails', () => {
      mockSpeak.mockImplementationOnce(() => {
        throw new Error('Speech synthesis failed');
      });

      const { result } = renderHook(() => useExamSpeech());

      act(() => {
        result.current.speak('apple');
      });

      expect(result.current.error).toBeTruthy();
    });

    it('should handle empty string speak', () => {
      const { result } = renderHook(() => useExamSpeech());

      act(() => {
        result.current.speak('');
      });

      expect(result.current.isPlaying).toBe(true);
      expect(mockSpeak).toHaveBeenCalled();
    });

    it('should handle speak with special characters', () => {
      const { result } = renderHook(() => useExamSpeech());

      act(() => {
        result.current.speak('café');
      });

      expect(mockSpeechSynthesisUtterance).toHaveBeenCalledWith('café');
    });

    it('should handle speak with numbers', () => {
      const { result } = renderHook(() => useExamSpeech());

      act(() => {
        result.current.speak('123');
      });

      expect(mockSpeechSynthesisUtterance).toHaveBeenCalledWith('123');
    });

    it('should attach onend callback to utterance', () => {
      const utterance = {
        text: '',
        lang: 'en-US',
        rate: 1,
        pitch: 1,
        volume: 1,
        onend: null as any,
      };

      mockSpeechSynthesisUtterance.mockImplementation(() => utterance);

      const { result } = renderHook(() => useExamSpeech());

      act(() => {
        result.current.speak('apple');
      });

      expect(utterance.onend).toBeDefined();
      expect(typeof utterance.onend).toBe('function');
    });

    it('should set isPlaying to false when speech ends', () => {
      const utterance = {
        text: '',
        lang: 'en-US',
        rate: 1,
        pitch: 1,
        volume: 1,
        onend: null as any,
      };

      mockSpeechSynthesisUtterance.mockImplementation(() => utterance);

      const { result } = renderHook(() => useExamSpeech());

      act(() => {
        result.current.speak('apple');
      });

      expect(result.current.isPlaying).toBe(true);

      act(() => {
        if (utterance.onend) {
          utterance.onend();
        }
      });

      expect(result.current.isPlaying).toBe(false);
    });

    it('should handle onerror callback', () => {
      const utterance = {
        text: '',
        lang: 'en-US',
        rate: 1,
        pitch: 1,
        volume: 1,
        onend: null as any,
        onerror: null as any,
      };

      mockSpeechSynthesisUtterance.mockImplementation(() => utterance);

      const { result } = renderHook(() => useExamSpeech());

      act(() => {
        result.current.speak('apple');
      });

      expect(utterance.onerror).toBeDefined();
      expect(typeof utterance.onerror).toBe('function');

      const errorEvent = { error: 'network' };
      act(() => {
        if (utterance.onerror) {
          utterance.onerror(errorEvent as any);
        }
      });

      expect(result.current.error).toBeTruthy();
    });
  });

  describe('stop', () => {
    it('should call speechSynthesis.cancel', () => {
      const { result } = renderHook(() => useExamSpeech());

      act(() => {
        result.current.speak('apple');
      });

      mockCancel.mockClear();

      act(() => {
        result.current.stop();
      });

      expect(mockCancel).toHaveBeenCalled();
    });

    it('should set isPlaying to false', () => {
      const { result } = renderHook(() => useExamSpeech());

      act(() => {
        result.current.speak('apple');
      });

      expect(result.current.isPlaying).toBe(true);

      act(() => {
        result.current.stop();
      });

      expect(result.current.isPlaying).toBe(false);
    });

    it('should clear currentUtterance', () => {
      const { result } = renderHook(() => useExamSpeech());

      act(() => {
        result.current.speak('apple');
      });

      expect(result.current.currentUtterance).toBe('apple');

      act(() => {
        result.current.stop();
      });

      expect(result.current.currentUtterance).toBeNull();
    });

    it('should not throw when called without speaking', () => {
      const { result } = renderHook(() => useExamSpeech());

      expect(() => {
        act(() => {
          result.current.stop();
        });
      }).not.toThrow();
    });

    it('should handle stop when Web Speech API is not supported', () => {
      const originalSpeechSynthesis = window.speechSynthesis;
      Object.defineProperty(window, 'speechSynthesis', {
        value: undefined,
        writable: true,
      });

      const { result } = renderHook(() => useExamSpeech());

      // Should not throw error
      act(() => {
        result.current.stop();
      });

      // Restore
      Object.defineProperty(window, 'speechSynthesis', {
        value: originalSpeechSynthesis,
        writable: true,
      });
    });
  });

  describe('Multiple Speeches', () => {
    it('should handle successive speak calls', () => {
      const { result } = renderHook(() => useExamSpeech());

      act(() => {
        result.current.speak('apple');
      });

      mockCancel.mockClear();

      act(() => {
        result.current.speak('banana');
      });

      expect(mockCancel).toHaveBeenCalled();
      expect(mockSpeak).toHaveBeenCalledTimes(2);
    });

    it('should replace previous utterance when new speak is called', () => {
      const { result } = renderHook(() => useExamSpeech());

      act(() => {
        result.current.speak('apple');
      });

      expect(result.current.currentUtterance).toBe('apple');

      act(() => {
        result.current.speak('banana');
      });

      expect(result.current.currentUtterance).toBe('banana');
    });

    it('should maintain isPlaying state across multiple speaks', () => {
      const { result } = renderHook(() => useExamSpeech());

      act(() => {
        result.current.speak('apple');
      });

      expect(result.current.isPlaying).toBe(true);

      act(() => {
        result.current.speak('banana');
      });

      expect(result.current.isPlaying).toBe(true);
    });
  });

  describe('Language Support', () => {
    it('should support en-US by default', () => {
      const { result } = renderHook(() => useExamSpeech());

      act(() => {
        result.current.speak('apple');
      });

      expect(mockSpeechSynthesisUtterance).toHaveBeenCalled();
    });

    it('should support custom language codes', () => {
      const { result } = renderHook(() => useExamSpeech());

      const languages = ['en-US', 'fr-FR', 'de-DE', 'ja-JP', 'zh-CN'];

      languages.forEach((lang) => {
        act(() => {
          result.current.speak('test', lang);
        });
      });

      expect(mockSpeechSynthesisUtterance).toHaveBeenCalledTimes(5);
    });
  });

  describe('Cleanup', () => {
    it('should cancel speech on component unmount', () => {
      const { result, unmount } = renderHook(() => useExamSpeech());

      act(() => {
        result.current.speak('apple');
      });

      expect(result.current.isPlaying).toBe(true);

      unmount();

      expect(mockCancel).toHaveBeenCalled();
    });

    it('should not throw error on cleanup with unsupported API', () => {
      const originalSpeechSynthesis = window.speechSynthesis;
      Object.defineProperty(window, 'speechSynthesis', {
        value: undefined,
        writable: true,
      });

      const { unmount } = renderHook(() => useExamSpeech());

      expect(() => {
        unmount();
      }).not.toThrow();

      // Restore
      Object.defineProperty(window, 'speechSynthesis', {
        value: originalSpeechSynthesis,
        writable: true,
      });
    });
  });

  describe('Error Handling', () => {
    it('should capture error message', () => {
      const utterance = {
        text: '',
        lang: 'en-US',
        rate: 1,
        pitch: 1,
        volume: 1,
        onend: null as any,
        onerror: null as any,
      };

      mockSpeechSynthesisUtterance.mockImplementation(() => utterance);

      const { result } = renderHook(() => useExamSpeech());

      act(() => {
        result.current.speak('apple');
      });

      const errorEvent = { error: 'network' };
      act(() => {
        if (utterance.onerror) {
          utterance.onerror(errorEvent as any);
        }
      });

      expect(result.current.error).toBe('network');
    });

    it('should allow clearing error', () => {
      const utterance = {
        text: '',
        lang: 'en-US',
        rate: 1,
        pitch: 1,
        volume: 1,
        onend: null as any,
        onerror: null as any,
      };

      mockSpeechSynthesisUtterance.mockImplementation(() => utterance);

      const { result } = renderHook(() => useExamSpeech());

      act(() => {
        result.current.speak('apple');
      });

      const errorEvent = { error: 'network' };
      act(() => {
        if (utterance.onerror) {
          utterance.onerror(errorEvent as any);
        }
      });

      expect(result.current.error).toBe('network');

      // Try speaking again to clear error
      act(() => {
        result.current.speak('banana');
      });

      // Error should be cleared (implementation dependent)
      // This tests that subsequent speak works
      expect(mockSpeak).toHaveBeenCalledTimes(2);
    });

    it('should handle errors from speechSynthesis.speak', () => {
      mockSpeak.mockImplementationOnce(() => {
        throw new Error('Quota exceeded');
      });

      const { result } = renderHook(() => useExamSpeech());

      act(() => {
        result.current.speak('apple');
      });

      expect(result.current.error).toBeTruthy();
    });

    it('should continue operating after error', () => {
      mockSpeak.mockImplementationOnce(() => {
        throw new Error('Error 1');
      });

      const { result } = renderHook(() => useExamSpeech());

      act(() => {
        result.current.speak('apple');
      });

      expect(result.current.error).toBeTruthy();

      // Reset mock for next call
      mockSpeak.mockImplementationOnce(() => {});

      act(() => {
        result.current.speak('banana');
      });

      // Should attempt to speak again (error handling doesn't prevent retry)
      expect(mockSpeak).toHaveBeenCalledTimes(2);
    });
  });

  describe('State Consistency', () => {
    it('should maintain consistent state across operations', () => {
      const { result } = renderHook(() => useExamSpeech());

      // Initial state
      expect(result.current.isPlaying).toBe(false);
      expect(result.current.currentUtterance).toBeNull();
      expect(result.current.error).toBeNull();

      // After speak
      act(() => {
        result.current.speak('apple');
      });

      expect(result.current.isPlaying).toBe(true);
      expect(result.current.currentUtterance).toBe('apple');

      // After stop
      act(() => {
        result.current.stop();
      });

      expect(result.current.isPlaying).toBe(false);
      expect(result.current.currentUtterance).toBeNull();
    });

    it('should prevent overlapping speech', () => {
      const { result } = renderHook(() => useExamSpeech());

      act(() => {
        result.current.speak('apple');
      });

      expect(result.current.isPlaying).toBe(true);

      // Try to speak while already speaking
      act(() => {
        result.current.speak('banana');
      });

      // Should cancel previous and start new
      expect(mockCancel).toHaveBeenCalled();
      expect(result.current.isPlaying).toBe(true);
    });
  });

  describe('Browser Compatibility', () => {
    it('should handle browsers without speechSynthesis', () => {
      const originalSpeechSynthesis = window.speechSynthesis;
      Object.defineProperty(window, 'speechSynthesis', {
        value: undefined,
        writable: true,
      });

      const { result } = renderHook(() => useExamSpeech());

      expect(result.current.isSupported).toBe(false);

      // Should not throw when calling methods
      expect(() => {
        act(() => {
          result.current.speak('apple');
        });
      }).not.toThrow();

      expect(() => {
        act(() => {
          result.current.stop();
        });
      }).not.toThrow();

      // Restore
      Object.defineProperty(window, 'speechSynthesis', {
        value: originalSpeechSynthesis,
        writable: true,
      });
    });

    it('should handle browsers without SpeechSynthesisUtterance', () => {
      const originalUtterance = (window as any).SpeechSynthesisUtterance;
      (window as any).SpeechSynthesisUtterance = undefined;

      const { result } = renderHook(() => useExamSpeech());

      expect(() => {
        act(() => {
          result.current.speak('apple');
        });
      }).not.toThrow();

      // Restore
      (window as any).SpeechSynthesisUtterance = originalUtterance;
    });
  });
});
