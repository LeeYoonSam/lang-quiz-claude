import { generateWrongAnswers } from './generateWrongAnswers';

interface WordItem {
  id: string;
  word: string;
  meaning: string;
  pronunciation?: string;
  example?: string;
}

interface ExamQuestion {
  wordId: string;
  type: 'multiple-choice' | 'short-answer';
  prompt: string;
  correctAnswer: string;
  choices?: string[];
}

/**
 * Generate exam questions from a word set
 * @param wordSet - Array of word items to create questions from
 * @param mode - 'multiple-choice', 'short-answer', or 'mixed'
 * @param direction - 'forward' (meaning→word) or 'reverse' (word→meaning)
 * @param count - Number of questions to generate
 * @returns Array of exam questions
 */
export function generateQuestions(
  wordSet: WordItem[],
  mode: 'multiple-choice' | 'short-answer' | 'mixed',
  direction: 'forward' | 'reverse',
  count: number
): ExamQuestion[] {
  // Handle edge case of zero questions
  if (count === 0) {
    return [];
  }

  // Limit to available words
  const availableWords = wordSet.slice(0, Math.min(count, wordSet.length));
  const actualCount = Math.min(count, wordSet.length);

  // Shuffle words for randomization
  const shuffledWords = [...availableWords].sort(() => Math.random() - 0.5);

  // Generate question types based on mode
  let questionTypes: ('multiple-choice' | 'short-answer')[] = [];

  if (mode === 'multiple-choice') {
    questionTypes = Array(actualCount).fill('multiple-choice');
  } else if (mode === 'short-answer') {
    questionTypes = Array(actualCount).fill('short-answer');
  } else if (mode === 'mixed') {
    // 30% multiple-choice, 70% short-answer
    const mcCount = Math.ceil(actualCount * 0.3);
    const saCount = actualCount - mcCount;
    questionTypes = [
      ...Array(mcCount).fill('multiple-choice'),
      ...Array(saCount).fill('short-answer'),
    ];
    // Shuffle question types
    questionTypes = questionTypes.sort(() => Math.random() - 0.5);
  }

  // Generate questions
  const questions: ExamQuestion[] = shuffledWords.map((word, index) => {
    const type = questionTypes[index];

    // Set prompt and correctAnswer based on direction
    const prompt = direction === 'forward' ? word.meaning : word.word;
    const correctAnswer = direction === 'forward' ? word.word : word.meaning;

    const question: ExamQuestion = {
      wordId: word.id,
      type,
      prompt,
      correctAnswer,
    };

    // Add choices for multiple-choice questions
    if (type === 'multiple-choice') {
      const wrongAnswers = generateWrongAnswers(correctAnswer, wordSet, 3);
      const allChoices = [correctAnswer, ...wrongAnswers];
      // Shuffle choices to randomize correct answer position
      const shuffledChoices = allChoices.sort(() => Math.random() - 0.5);
      question.choices = shuffledChoices;
    }

    return question;
  });

  return questions;
}
