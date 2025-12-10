import type { WordItem } from './types';

/**
 * Generate N wrong answers from available words, excluding the correct answer.
 * Removes duplicates and ensures randomized selection.
 *
 * @param correctAnswer - The correct answer to exclude
 * @param words - Array of word items to select from
 * @param count - Number of wrong answers to generate (default: 3)
 * @returns Array of wrong answers with no duplicates
 */
export function generateWrongAnswers(
  correctAnswer: string,
  words: WordItem[],
  count: number = 3
): string[] {
  // Filter out the correct answer and remove duplicates
  const uniqueWords = Array.from(
    new Set(
      words
        .map(w => w.word)
        .filter(word => word !== correctAnswer)
    )
  );

  // Return all available words if count exceeds what we have
  if (uniqueWords.length <= count) {
    return uniqueWords;
  }

  // Shuffle using Fisher-Yates algorithm for better randomization
  const shuffled = [...uniqueWords];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
}
