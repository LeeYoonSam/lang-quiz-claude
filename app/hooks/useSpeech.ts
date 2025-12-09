/**
 * useSpeech Hook
 *
 * Provides TTS (Text-To-Speech) functionality using Web Speech API.
 * Handles audio playback, browser support detection, and error management.
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import type { UseSpeechResult } from '@/app/types/learn';

/**
 * Hook for speech synthesis (TTS)
 * @returns Object with speak function, speaking state, and support status
 */
export function useSpeech(): UseSpeechResult {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check if speechSynthesis API is supported
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const speak = useCallback(
    (text: string, lang: string = 'en-US') => {
      if (!isSupported) {
        console.warn('Speech Synthesis API is not supported in this browser');
        return;
      }

      try {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        // Create new utterance
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 0.9; // Slightly slower for learning purposes
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Handle playback events
        utterance.onstart = () => {
          setIsSpeaking(true);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
        };

        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event.error);
          setIsSpeaking(false);
        };

        utterance.onpause = () => {
          // Do nothing on pause
        };

        utterance.onresume = () => {
          // Do nothing on resume
        };

        // Store reference and speak
        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Failed to speak:', error);
        setIsSpeaking(false);
      }
    },
    [isSupported],
  );

  const stop = useCallback(() => {
    if (isSupported && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  const pause = useCallback(() => {
    if (isSupported && window.speechSynthesis) {
      window.speechSynthesis.pause();
    }
  }, [isSupported]);

  const resume = useCallback(() => {
    if (isSupported && window.speechSynthesis) {
      window.speechSynthesis.resume();
    }
  }, [isSupported]);

  return {
    speak,
    isSpeaking,
    isSupported,
  };
}

/**
 * Get available voices for speech synthesis
 * @returns Array of available voices
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }

  return window.speechSynthesis.getVoices();
}

/**
 * Get voice by language code
 * @param lang Language code (e.g., 'en-US', 'ko-KR')
 * @returns Voice object or null if not found
 */
export function getVoiceByLang(lang: string): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  return voices.find((voice) => voice.lang.startsWith(lang.split('-')[0])) || null;
}

/**
 * Check if specific language is supported
 * @param lang Language code
 * @returns true if language is supported
 */
export function isSpeechLanguageSupported(lang: string): boolean {
  const voices = getAvailableVoices();
  return voices.some((voice) => voice.lang.startsWith(lang.split('-')[0]));
}
