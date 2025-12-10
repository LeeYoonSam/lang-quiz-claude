/**
 * useExamSpeech Hook
 *
 * Web Speech API integration for pronunciation playback.
 * Provides graceful degradation when API is not available.
 * Automatically stops speech on component unmount.
 *
 * Features:
 * - Web Speech API with fallback to webkit variant
 * - Prevents overlapping speech synthesis
 * - Graceful error handling
 * - Auto-cleanup on unmount
 * - Support for multiple languages
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface ExamSpeechState {
  isPlaying: boolean;
  isSupported: boolean;
  currentUtterance: string | null;
  error: string | null;
}

export interface UseExamSpeechResult {
  isPlaying: boolean;
  isSupported: boolean;
  currentUtterance: string | null;
  error: string | null;
  speak: (text: string, lang?: string) => void;
  stop: () => void;
  checkSupport: () => boolean;
}

/**
 * Get speechSynthesis API (supports both standard and webkit variants)
 */
function getSpeechSynthesis():
  | SpeechSynthesis
  | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }
  return window.speechSynthesis || (window as any).webkitSpeechSynthesis;
}

/**
 * Get SpeechSynthesisUtterance constructor (supports both standard and webkit variants)
 */
function getSpeechSynthesisUtterance():
  | typeof SpeechSynthesisUtterance
  | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }
  return (
    window.SpeechSynthesisUtterance ||
    (window as any).webkitSpeechSynthesisUtterance
  );
}

/**
 * Check if Web Speech API is available
 */
function isSpeechSynthesisSupported(): boolean {
  if (typeof window === 'undefined' || !window) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    (window.speechSynthesis !== undefined ||
      (window as any).webkitSpeechSynthesis !== undefined)
  );
}

/**
 * Hook for Web Speech API integration
 */
export function useExamSpeech(): UseExamSpeechResult {
  const [state, setState] = useState<ExamSpeechState>({
    isPlaying: false,
    isSupported: false,
    currentUtterance: null,
    error: null,
  });

  // Check Web Speech API support on mount
  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      isSupported: isSpeechSynthesisSupported(),
    }));
  }, []);

  /**
   * Check if Web Speech API is supported
   */
  const checkSupport = useCallback((): boolean => {
    return isSpeechSynthesisSupported();
  }, []);

  /**
   * Start speech synthesis
   */
  const speak = useCallback(
    (text: string, lang: string = 'en-US') => {
      if (!isSpeechSynthesisSupported()) {
        setState((prevState) => ({
          ...prevState,
          error: 'Web Speech API is not supported in this browser',
        }));
        return;
      }

      try {
        const speechSynthesis = getSpeechSynthesis();
        const SpeechSynthesisUtterance = getSpeechSynthesisUtterance();

        if (!speechSynthesis || !SpeechSynthesisUtterance) {
          throw new Error('Speech API components not available');
        }

        // Cancel any ongoing speech to prevent overlapping
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;

        /**
         * Handle speech end event
         */
        utterance.onend = () => {
          setState((prevState) => ({
            ...prevState,
            isPlaying: false,
          }));
        };

        /**
         * Handle speech error event
         */
        utterance.onerror = (event) => {
          setState((prevState) => ({
            ...prevState,
            isPlaying: false,
            error: event.error,
          }));
        };

        speechSynthesis.speak(utterance);

        setState((prevState) => ({
          ...prevState,
          isPlaying: true,
          currentUtterance: text,
          error: null,
        }));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';

        setState((prevState) => ({
          ...prevState,
          error: errorMessage,
        }));
      }
    },
    []
  );

  /**
   * Stop current speech
   */
  const stop = useCallback(() => {
    try {
      const speechSynthesis = getSpeechSynthesis();

      if (speechSynthesis) {
        speechSynthesis.cancel();
      }

      setState((prevState) => ({
        ...prevState,
        isPlaying: false,
        currentUtterance: null,
      }));
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  }, []);

  /**
   * Stop speech on component unmount
   */
  useEffect(() => {
    return () => {
      if (state.isPlaying) {
        stop();
      }
    };
  }, [state.isPlaying, stop]);

  return {
    isPlaying: state.isPlaying,
    isSupported: state.isSupported,
    currentUtterance: state.currentUtterance,
    error: state.error,
    speak,
    stop,
    checkSupport,
  };
}
