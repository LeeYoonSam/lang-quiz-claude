import { useState, useEffect, useCallback } from 'react';
import {
  loadSession,
  saveSession,
  clearSession,
  LearnSession,
} from '@/lib/learn/sessionStorage';
import { fisherYatesShuffle } from '@/lib/learn/shuffle';

export interface Word {
  id: string;
  text: string;
  meaning: string;
}

export interface UseLearnSessionResult {
  words: Word[];
  currentIndex: number;
  currentWord: Word | null;
  isFlipped: boolean;
  mode: 'sequential' | 'random';
  next: () => void;
  previous: () => void;
  toggleFlip: () => void;
  reset: () => void;
}

export function useLearnSession(
  wordSetId: string,
  initialWords: Word[],
  mode: 'sequential' | 'random'
): UseLearnSessionResult {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Initialize session on mount
  useEffect(() => {
    const existing = loadSession(wordSetId);

    if (existing) {
      // Load from sessionStorage
      setWords(existing.words);
      setCurrentIndex(existing.currentIndex);
    } else {
      // Create new session
      const orderedWords =
        mode === 'random' ? fisherYatesShuffle(initialWords) : initialWords;

      setWords(orderedWords);

      // Save initial session
      const newSession: LearnSession = {
        wordSetId,
        mode,
        words: orderedWords,
        currentIndex: 0,
        startTime: Date.now(),
      };

      saveSession(wordSetId, newSession);
    }
  }, [wordSetId, mode, initialWords]);

  // Save session whenever currentIndex changes
  useEffect(() => {
    if (words.length > 0) {
      const session: LearnSession = {
        wordSetId,
        mode,
        words,
        currentIndex,
        startTime: Date.now(),
      };

      saveSession(wordSetId, session);
    }
  }, [currentIndex, words, wordSetId, mode]);

  const currentWord = words[currentIndex] || null;

  const next = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev < words.length - 1) {
        return prev + 1;
      }
      return prev;
    });
    setIsFlipped(false);
  }, [words.length]);

  const previous = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev > 0) {
        return prev - 1;
      }
      return prev;
    });
    setIsFlipped(false);
  }, []);

  const toggleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    clearSession(wordSetId);
  }, [wordSetId]);

  return {
    words,
    currentIndex,
    currentWord,
    isFlipped,
    mode,
    next,
    previous,
    toggleFlip,
    reset,
  };
}
