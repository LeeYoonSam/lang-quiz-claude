/**
 * useLearnSession Hook
 *
 * Manages the state and persistence of a learning session,
 * including word navigation, flip state, and session storage.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { LearnSession, LearnMode, Word, UseLearnSessionResult } from '@/app/types/learn';
import { shuffleWords } from '@/app/lib/learn/shuffle';
import { saveSession, loadSession, removeSession } from '@/app/lib/learn/sessionStorage';

/**
 * Hook for managing learning session state
 * @param wordSetId ID of the word set
 * @param words Initial words array
 * @param mode Learning mode (sequential or random)
 * @returns Learning session state and methods
 */
export function useLearnSession(
  wordSetId: string,
  words: Word[],
  mode: LearnMode,
): UseLearnSessionResult {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionWords, setSessionWords] = useState<Word[]>(words);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize session from storage or create new one
  useEffect(() => {
    const existingSession = loadSession(wordSetId);

    if (existingSession) {
      // Restore from session storage
      setSessionWords(existingSession.words);
      setCurrentIndex(existingSession.currentIndex);
    } else {
      // Create new session
      const orderedWords = mode === 'random' ? shuffleWords(words) : words;
      setSessionWords(orderedWords);
      setCurrentIndex(0);

      // Save initial session
      const newSession: LearnSession = {
        wordSetId,
        mode,
        words: orderedWords,
        currentIndex: 0,
        startTime: Date.now(),
      };
      saveSession(newSession);
    }

    setIsInitialized(true);
  }, [wordSetId, words, mode]);

  // Save session whenever currentIndex or words change
  useEffect(() => {
    if (!isInitialized) return;

    const session: LearnSession = {
      wordSetId,
      mode,
      words: sessionWords,
      currentIndex,
      startTime: Date.now(),
    };
    saveSession(session);
  }, [currentIndex, sessionWords, wordSetId, mode, isInitialized]);

  /**
   * Navigate to next word
   */
  const next = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const newIndex = Math.min(prevIndex + 1, sessionWords.length - 1);
      return newIndex;
    });
    setIsFlipped(false);
  }, [sessionWords.length]);

  /**
   * Navigate to previous word
   */
  const previous = useCallback(() => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    setIsFlipped(false);
  }, []);

  /**
   * Flip current card
   */
  const flip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  /**
   * Reset session (for retry)
   */
  const reset = useCallback(() => {
    const orderedWords = mode === 'random' ? shuffleWords(words) : words;
    setSessionWords(orderedWords);
    setCurrentIndex(0);
    setIsFlipped(false);

    const newSession: LearnSession = {
      wordSetId,
      mode,
      words: orderedWords,
      currentIndex: 0,
      startTime: Date.now(),
    };
    saveSession(newSession);
  }, [wordSetId, words, mode]);

  /**
   * Manually save current session state
   */
  const saveSessionManually = useCallback(() => {
    const session: LearnSession = {
      wordSetId,
      mode,
      words: sessionWords,
      currentIndex,
      startTime: Date.now(),
    };
    saveSession(session);
  }, [wordSetId, mode, sessionWords, currentIndex]);

  /**
   * Manually load session from storage
   */
  const loadSessionManually = useCallback(() => {
    const session = loadSession(wordSetId);
    if (session) {
      setSessionWords(session.words);
      setCurrentIndex(session.currentIndex);
    }
  }, [wordSetId]);

  return {
    words: sessionWords,
    currentIndex,
    isFlipped,
    mode,
    next,
    previous,
    flip,
    reset,
    saveSession: saveSessionManually,
    loadSession: loadSessionManually,
  };
}
