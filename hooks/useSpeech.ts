import { useState, useCallback, useRef } from 'react';

export interface UseSpeechResult {
  speak: (text: string, lang?: string) => void;
  isSpeaking: boolean;
  isSupported: boolean;
  cancel: () => void;
}

export function useSpeech(): UseSpeechResult {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported] = useState(() => 'speechSynthesis' in window);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const cancel = useCallback(() => {
    if (!isSupported) {
      return;
    }

    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  const speak = useCallback(
    (text: string, lang = 'en-US') => {
      if (!isSupported) {
        console.warn('Speech Synthesis is not supported in this browser');
        return;
      }

      // Cancel any ongoing speech
      try {
        window.speechSynthesis.cancel();
      } catch (error) {
        console.error('Failed to cancel speech synthesis:', error);
      }

      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9; // Slower for learning purposes
      utterance.pitch = 1.0;

      // Set up event handlers
      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (error) => {
        console.error('Speech synthesis error:', error);
        setIsSpeaking(false);
      };

      // Store reference and speak
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isSupported]
  );

  return {
    speak,
    isSpeaking,
    isSupported,
    cancel,
  };
}
