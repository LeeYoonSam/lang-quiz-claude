/**
 * Tests for useSpeech hook
 */

import { renderHook, act } from '@testing-library/react';
import { useSpeech, getAvailableVoices, getVoiceByLang, isSpeechLanguageSupported } from '../useSpeech';

// Mock Web Speech API
const mockUtterance = {
  onstart: jest.fn(),
  onend: jest.fn(),
  onerror: jest.fn(),
  onpause: jest.fn(),
  onresume: jest.fn(),
  lang: '',
  rate: 1,
  pitch: 1,
  volume: 1,
};

const mockSpeechSynthesis = {
  speak: jest.fn(),
  cancel: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  getVoices: jest.fn(() => [
    { lang: 'en-US', name: 'English US', default: true } as SpeechSynthesisVoice,
    { lang: 'ko-KR', name: 'Korean KR', default: false } as SpeechSynthesisVoice,
  ]),
};

// Setup mock
Object.defineProperty(window, 'speechSynthesis', {
  value: mockSpeechSynthesis,
  writable: true,
  configurable: true,
});

// Mock SpeechSynthesisUtterance
(global as any).SpeechSynthesisUtterance = jest.fn((text: string) => ({
  text,
  onstart: null,
  onend: null,
  onerror: null,
  onpause: null,
  onresume: null,
  lang: 'en-US',
  rate: 1,
  pitch: 1,
  volume: 1,
}));

describe('useSpeech', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('basic functionality', () => {
    it('should initialize with isSupported true when API available', () => {
      const { result } = renderHook(() => useSpeech());

      expect(result.current.isSupported).toBe(true);
      expect(result.current.isSpeaking).toBe(false);
    });

    it('should speak text', () => {
      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak('apple');
      });

      expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
    });

    it('should set correct language', () => {
      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak('apple', 'en-US');
      });

      expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
      const utterance = (mockSpeechSynthesis.speak as jest.Mock).mock.calls[0][0];
      expect(utterance.lang).toBe('en-US');
    });

    it('should use default language en-US when not specified', () => {
      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak('apple');
      });

      const utterance = (mockSpeechSynthesis.speak as jest.Mock).mock.calls[0][0];
      expect(utterance.lang).toBe('en-US');
    });

    it('should set rate to 0.9 for learning purposes', () => {
      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak('apple');
      });

      const utterance = (mockSpeechSynthesis.speak as jest.Mock).mock.calls[0][0];
      expect(utterance.rate).toBe(0.9);
    });

    it('should set pitch to 1.0', () => {
      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak('apple');
      });

      const utterance = (mockSpeechSynthesis.speak as jest.Mock).mock.calls[0][0];
      expect(utterance.pitch).toBe(1.0);
    });

    it('should set volume to 1.0', () => {
      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak('apple');
      });

      const utterance = (mockSpeechSynthesis.speak as jest.Mock).mock.calls[0][0];
      expect(utterance.volume).toBe(1.0);
    });
  });

  describe('speaking state management', () => {
    it('should set isSpeaking to true when speech starts', () => {
      const { result } = renderHook(() => useSpeech());

      expect(result.current.isSpeaking).toBe(false);

      act(() => {
        result.current.speak('apple');
      });

      const utterance = (mockSpeechSynthesis.speak as jest.Mock).mock.calls[0][0];

      // Simulate onstart event
      act(() => {
        utterance.onstart();
      });

      expect(result.current.isSpeaking).toBe(true);
    });

    it('should set isSpeaking to false when speech ends', () => {
      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak('apple');
      });

      const utterance = (mockSpeechSynthesis.speak as jest.Mock).mock.calls[0][0];

      act(() => {
        utterance.onstart();
      });

      expect(result.current.isSpeaking).toBe(true);

      act(() => {
        utterance.onend();
      });

      expect(result.current.isSpeaking).toBe(false);
    });

    it('should set isSpeaking to false on error', () => {
      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak('apple');
      });

      const utterance = (mockSpeechSynthesis.speak as jest.Mock).mock.calls[0][0];

      act(() => {
        utterance.onstart();
      });

      expect(result.current.isSpeaking).toBe(true);

      act(() => {
        utterance.onerror({ error: 'network' });
      });

      expect(result.current.isSpeaking).toBe(false);
    });
  });

  describe('speech control', () => {
    it('should cancel previous speech before starting new speech', () => {
      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak('apple');
        result.current.speak('banana');
      });

      expect(mockSpeechSynthesis.cancel).toHaveBeenCalledTimes(2);
    });

    it('should handle multiple sequential speak calls', () => {
      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak('apple');
      });

      expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(1);

      act(() => {
        result.current.speak('banana');
      });

      expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(2);
    });

    it('should handle empty text gracefully', () => {
      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak('');
      });

      expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
    });

    it('should handle special characters', () => {
      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak('café');
      });

      expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
      const utterance = (mockSpeechSynthesis.speak as jest.Mock).mock.calls[0][0];
      expect(utterance.text).toBe('café');
    });
  });

  describe('error handling', () => {
    it('should handle speech synthesis errors', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak('apple');
      });

      const utterance = (mockSpeechSynthesis.speak as jest.Mock).mock.calls[0][0];

      act(() => {
        utterance.onerror({ error: 'network' });
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith('Speech synthesis error:', 'network');
      consoleErrorSpy.mockRestore();
    });

    it('should handle speak failures gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockSpeechSynthesis.speak.mockImplementation(() => {
        throw new Error('Speech API error');
      });

      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak('apple');
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to speak:', expect.any(Error));
      consoleErrorSpy.mockRestore();
    });
  });

  describe('browser support detection', () => {
    it('should detect speechSynthesis availability', () => {
      const { result } = renderHook(() => useSpeech());
      expect(result.current.isSupported).toBe(true);
      expect(typeof result.current.speak).toBe('function');
    });
  });
});

describe('Speech API utility functions', () => {
  let originalSynthesis: any;

  beforeEach(() => {
    jest.clearAllMocks();
    originalSynthesis = window.speechSynthesis;
    mockSpeechSynthesis.getVoices.mockReturnValue([
      { lang: 'en-US', name: 'English US', default: true } as SpeechSynthesisVoice,
      { lang: 'ko-KR', name: 'Korean KR', default: false } as SpeechSynthesisVoice,
    ]);
  });

  afterEach(() => {
    // Always restore speechSynthesis
    Object.defineProperty(window, 'speechSynthesis', {
      value: originalSynthesis,
      writable: true,
      configurable: true,
    });

    // Restore the mock to default state
    mockSpeechSynthesis.getVoices.mockReturnValue([
      { lang: 'en-US', name: 'English US', default: true } as SpeechSynthesisVoice,
      { lang: 'ko-KR', name: 'Korean KR', default: false } as SpeechSynthesisVoice,
    ]);
  });

  describe('getAvailableVoices', () => {
    it('should return available voices', () => {
      const voices = getAvailableVoices();
      expect(Array.isArray(voices)).toBe(true);
      expect(voices.length).toBeGreaterThan(0);
    });
  });

  describe('getVoiceByLang', () => {
    it('should find voice by language code', () => {
      const voice = getVoiceByLang('en');
      expect(voice).toBeDefined();
      expect(voice?.lang).toContain('en');
    });

    it('should return null for unsupported language', () => {
      mockSpeechSynthesis.getVoices.mockReturnValueOnce([]);
      const voice = getVoiceByLang('xx');
      expect(voice).toBeNull();
    });

    it('should handle full language codes', () => {
      mockSpeechSynthesis.getVoices.mockReturnValueOnce([
        { lang: 'en-US', name: 'English US', default: true } as SpeechSynthesisVoice,
      ]);
      const voice = getVoiceByLang('en-GB');
      expect(voice).toBeDefined();
      expect(voice?.lang).toContain('en');
    });
  });

  describe('isSpeechLanguageSupported', () => {
    it('should return true for supported language', () => {
      const supported = isSpeechLanguageSupported('en');
      expect(supported).toBe(true);
    });

    it('should return false for unsupported language', () => {
      mockSpeechSynthesis.getVoices.mockReturnValueOnce([]);
      const supported = isSpeechLanguageSupported('xx');
      expect(supported).toBe(false);
    });

    it('should handle full language codes', () => {
      mockSpeechSynthesis.getVoices.mockReturnValueOnce([
        { lang: 'en-US', name: 'English US', default: true } as SpeechSynthesisVoice,
      ]);
      const supported = isSpeechLanguageSupported('en-GB');
      expect(supported).toBe(true);
    });
  });
});
