import { renderHook, act } from '@testing-library/react';
import { useSpeech } from '../useSpeech';

// Mock Web Speech API
const mockSpeak = jest.fn();
const mockCancel = jest.fn();

describe('useSpeech Hook', () => {
  let mockUtterance: any;
  let originalSpeechSynthesis: any;

  beforeEach(() => {
    // Save original
    originalSpeechSynthesis = window.speechSynthesis;

    // Create mock utterance
    mockUtterance = {
      onstart: null,
      onend: null,
      onerror: null,
    };

    // Mock speechSynthesis
    (window as any).speechSynthesis = {
      speak: mockSpeak,
      cancel: mockCancel,
    };

    // Mock SpeechSynthesisUtterance constructor
    (window as any).SpeechSynthesisUtterance = jest.fn((text) => {
      return { text, ...mockUtterance };
    });

    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore original
    Object.defineProperty(window, 'speechSynthesis', {
      value: originalSpeechSynthesis,
      writable: true,
    });
  });

  describe('Basic functionality', () => {
    it('should initialize with correct state', () => {
      const { result } = renderHook(() => useSpeech());

      expect(result.current.isSpeaking).toBe(false);
      expect(result.current.isSupported).toBe(true);
      expect(typeof result.current.speak).toBe('function');
    });

    it('should have isSupported as false when speechSynthesis is not available', () => {
      // Create a new window object for this test
      const originalSpeechSynthesis = (window as any).speechSynthesis;
      delete (window as any).speechSynthesis;

      const { result } = renderHook(() => useSpeech());

      expect(result.current.isSupported).toBe(false);

      // Restore
      (window as any).speechSynthesis = originalSpeechSynthesis;
    });
  });

  describe('speak function', () => {
    it('should call speechSynthesis.speak when speak is called', () => {
      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak('apple');
      });

      expect(mockSpeak).toHaveBeenCalled();
    });

    it('should call speechSynthesis.cancel before speaking', () => {
      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak('apple');
      });

      expect(mockCancel).toHaveBeenCalled();
    });

    it('should accept text and language parameters', () => {
      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak('apple', 'en-US');
      });

      expect((window.SpeechSynthesisUtterance as jest.Mock).mock.calls[0][0]).toBe('apple');
    });

    it('should set language to en-US by default', () => {
      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak('apple');
      });

      const utteranceInstance = (window.SpeechSynthesisUtterance as jest.Mock).mock.results[0].value;
      expect(utteranceInstance.lang).toBe('en-US');
    });

    it('should set language when provided', () => {
      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak('apple', 'ko-KR');
      });

      const utteranceInstance = (window.SpeechSynthesisUtterance as jest.Mock).mock.results[0].value;
      expect(utteranceInstance.lang).toBe('ko-KR');
    });

    it('should set rate to 0.9 for slower speech', () => {
      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak('apple');
      });

      const utteranceInstance = (window.SpeechSynthesisUtterance as jest.Mock).mock.results[0].value;
      expect(utteranceInstance.rate).toBe(0.9);
    });

    it('should set pitch to 1.0', () => {
      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak('apple');
      });

      const utteranceInstance = (window.SpeechSynthesisUtterance as jest.Mock).mock.results[0].value;
      expect(utteranceInstance.pitch).toBe(1.0);
    });

    it('should not speak if not supported', () => {
      const originalSpeechSynthesis = (window as any).speechSynthesis;
      delete (window as any).speechSynthesis;

      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak('apple');
      });

      expect(mockSpeak).not.toHaveBeenCalled();

      // Restore
      (window as any).speechSynthesis = originalSpeechSynthesis;
    });
  });

  describe('isSpeaking state', () => {
    it('should set isSpeaking to true when utterance starts', () => {
      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak('apple');
      });

      const utteranceInstance = (window.SpeechSynthesisUtterance as jest.Mock).mock.results[0].value;

      // Simulate onstart
      act(() => {
        utteranceInstance.onstart?.();
      });

      expect(result.current.isSpeaking).toBe(true);
    });

    it('should set isSpeaking to false when utterance ends', () => {
      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak('apple');
      });

      const utteranceInstance = (window.SpeechSynthesisUtterance as jest.Mock).mock.results[0].value;

      // Start speaking
      act(() => {
        utteranceInstance.onstart?.();
      });

      expect(result.current.isSpeaking).toBe(true);

      // Stop speaking
      act(() => {
        utteranceInstance.onend?.();
      });

      expect(result.current.isSpeaking).toBe(false);
    });

    it('should set isSpeaking to false when error occurs', () => {
      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak('apple');
      });

      const utteranceInstance = (window.SpeechSynthesisUtterance as jest.Mock).mock.results[0].value;

      // Start speaking
      act(() => {
        utteranceInstance.onstart?.();
      });

      expect(result.current.isSpeaking).toBe(true);

      // Error occurs
      act(() => {
        utteranceInstance.onerror?.();
      });

      expect(result.current.isSpeaking).toBe(false);
    });
  });

  describe('Multiple speak calls', () => {
    it('should cancel previous speech before speaking new text', () => {
      const { result } = renderHook(() => useSpeech());

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
  });

  describe('Browser compatibility', () => {
    it('should handle missing speechSynthesis gracefully', () => {
      const originalSpeechSynthesis = (window as any).speechSynthesis;
      delete (window as any).speechSynthesis;

      expect(() => {
        renderHook(() => useSpeech());
      }).not.toThrow();

      // Restore
      (window as any).speechSynthesis = originalSpeechSynthesis;
    });
  });
});
