type ValidateMode = 'exact' | 'fuzzy';

/**
 * Validate a user's answer against the correct answer.
 * Supports exact matching (case/whitespace-insensitive) and fuzzy matching (partial).
 *
 * @param userAnswer - The answer provided by the user
 * @param correctAnswer - The correct answer
 * @param mode - 'exact' for exact match (default), 'fuzzy' for partial matching
 * @returns true if the answer is correct, false otherwise
 */
export function validateAnswer(
  userAnswer: string,
  correctAnswer: string,
  mode: ValidateMode = 'exact'
): boolean {
  // Normalize: trim whitespace and convert to lowercase
  const normalizedUser = userAnswer.trim().toLowerCase();
  const normalizedCorrect = correctAnswer.trim().toLowerCase();

  // Exact mode: case and whitespace-insensitive comparison
  if (mode === 'exact') {
    return normalizedUser === normalizedCorrect;
  }

  // Fuzzy mode: check if user answer is contained within correct answer
  if (mode === 'fuzzy') {
    return normalizedCorrect.includes(normalizedUser) && normalizedUser.length > 0;
  }

  return false;
}
