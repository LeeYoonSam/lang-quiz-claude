/**
 * Type Adapters
 *
 * Utility functions to convert between Word and WordItem types
 */

import type { Word } from '@/app/types/learn';
import type { WordItem } from './types';

/**
 * Converts a single Word to WordItem
 * Maps the 'text' field to 'word' field
 *
 * @param word - Word object from the API/Learn module
 * @returns WordItem object suitable for exam module
 */
export function wordToWordItem(word: Word): WordItem {
  return {
    id: word.id,
    word: word.text,
    meaning: word.meaning,
  };
}

/**
 * Converts an array of Words to WordItems
 * Maintains order and applies wordToWordItem transformation to each item
 *
 * @param words - Array of Word objects
 * @returns Array of WordItem objects
 */
export function wordsToWordItems(words: Word[]): WordItem[] {
  return words.map(wordToWordItem);
}
