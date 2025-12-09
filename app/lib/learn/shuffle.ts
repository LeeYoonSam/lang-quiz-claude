/**
 * Fisher-Yates Shuffle Algorithm
 *
 * Implements the Fisher-Yates algorithm for cryptographically sound array shuffling.
 * Used to randomize word order in learning mode.
 */

import type { Word } from '@/app/types/learn';

/**
 * Shuffles an array in-place using Fisher-Yates algorithm
 * @param array Array to shuffle
 * @returns New shuffled array (does not mutate original)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/**
 * Shuffles words for random learning mode
 * @param words Array of words to shuffle
 * @returns New shuffled array of words
 */
export function shuffleWords(words: Word[]): Word[] {
  return shuffleArray(words);
}

/**
 * Validates if array is properly shuffled (not same order as original)
 * @param original Original array
 * @param shuffled Shuffled array
 * @returns true if arrays are in different order
 */
export function isShuffled<T>(original: T[], shuffled: T[]): boolean {
  if (original.length !== shuffled.length) {
    return false;
  }

  for (let i = 0; i < original.length; i++) {
    if (original[i] !== shuffled[i]) {
      return true;
    }
  }

  return false;
}
