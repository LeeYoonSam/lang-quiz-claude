/**
 * Fisher-Yates shuffle algorithm for randomizing array order
 * Creates a copy of the array and shuffles it without modifying the original
 */
export function fisherYatesShuffle<T>(array: T[]): T[] {
  // Create a copy to avoid modifying the original array
  const shuffled = [...array];

  // Fisher-Yates algorithm
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Get a random index from 0 to i (inclusive)
    const randomIndex = Math.floor(Math.random() * (i + 1));

    // Swap elements at i and randomIndex
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }

  return shuffled;
}
