/**
 * Session Storage Utilities
 *
 * Manages persistence of learning session state in browser sessionStorage.
 * Sessions are cleared on tab close, maintaining learning progress during active session.
 */

import type { LearnSession } from '@/app/types/learn';

/**
 * Session storage key prefix
 */
const SESSION_KEY_PREFIX = 'learn_session_';

/**
 * Generates a session storage key for a word set
 * @param wordSetId ID of the word set
 * @returns Storage key string
 */
export function getSessionKey(wordSetId: string): string {
  return `${SESSION_KEY_PREFIX}${wordSetId}`;
}

/**
 * Saves learning session to sessionStorage
 * @param session Session data to save
 * @throws Error if sessionStorage is unavailable or quota exceeded
 */
export function saveSession(session: LearnSession): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const key = getSessionKey(session.wordSetId);
    const serialized = JSON.stringify(session);
    window.sessionStorage.setItem(key, serialized);
  } catch (error) {
    console.error('Failed to save learning session:', error);
    throw new Error('세션 저장에 실패했습니다.');
  }
}

/**
 * Loads learning session from sessionStorage
 * @param wordSetId ID of the word set to load session for
 * @returns Session data or null if not found
 */
export function loadSession(wordSetId: string): LearnSession | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const key = getSessionKey(wordSetId);
    const serialized = window.sessionStorage.getItem(key);

    if (!serialized) {
      return null;
    }

    return JSON.parse(serialized) as LearnSession;
  } catch (error) {
    console.error('Failed to load learning session:', error);
    return null;
  }
}

/**
 * Removes learning session from sessionStorage
 * @param wordSetId ID of the word set
 */
export function removeSession(wordSetId: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const key = getSessionKey(wordSetId);
    window.sessionStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove learning session:', error);
  }
}

/**
 * Checks if a learning session exists
 * @param wordSetId ID of the word set
 * @returns true if session exists
 */
export function hasSession(wordSetId: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const key = getSessionKey(wordSetId);
  return window.sessionStorage.getItem(key) !== null;
}

/**
 * Clears all learning sessions from sessionStorage
 */
export function clearAllSessions(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    // Iterate through all keys in sessionStorage
    for (let i = 0; i < window.sessionStorage.length; i++) {
      const key = window.sessionStorage.key(i);
      if (key && key.startsWith(SESSION_KEY_PREFIX)) {
        window.sessionStorage.removeItem(key);
        i--; // Decrement index since we removed an item
      }
    }
  } catch (error) {
    console.error('Failed to clear sessions:', error);
  }
}
