/**
 * E2E-1: Multiple Choice Question Flow
 *
 * Tests for multiple-choice exam questions including answer selection,
 * feedback, and progression through questions
 */

import { test, expect } from './fixtures';
import {
  gotoExamConfig,
  startExam,
  selectAnswer,
  clickNextQuestion,
  expectCorrectFeedback,
  expectIncorrectFeedback,
  expectResultPage,
  expectProgressBar,
  waitForQuestionLoad,
  expectScore,
} from '../shared/helpers';

test.describe('Exam: Multiple Choice Question Flow (E2E-1)', () => {
  test('should complete 10-question exam with all correct answers', async ({
    page,
    multipleChoiceWordSetId,
  }) => {
    // Navigate to exam config
    await gotoExamConfig(page, multipleChoiceWordSetId);

    // Start exam with multiple-choice mode
    await startExam(page, {
      mode: 'multiple-choice',
      direction: 'forward',
    });

    // Answer all 10 questions correctly
    for (let i = 1; i <= 10; i++) {
      // Wait for question to load
      await waitForQuestionLoad(page);

      // Verify progress bar
      await expectProgressBar(page, i, 10);

      // Select first choice (assuming it's correct)
      await selectAnswer(page, 0);

      // Expect correct feedback
      await expectCorrectFeedback(page);

      // Move to next question
      if (i < 10) {
        await clickNextQuestion(page);
      }
    }

    // Verify on result page
    await expectResultPage(page);

    // Verify perfect score
    await expectScore(page, 10, 10);
  });

  test('should achieve perfect score (10/10)', async ({
    page,
    multipleChoiceWordSetId,
  }) => {
    // Navigate and start exam
    await gotoExamConfig(page, multipleChoiceWordSetId);
    await startExam(page, {
      mode: 'multiple-choice',
      direction: 'forward',
    });

    // Answer all 10 correctly
    for (let i = 0; i < 10; i++) {
      await waitForQuestionLoad(page);
      await selectAnswer(page, 0);
      await expectCorrectFeedback(page);

      if (i < 9) {
        await clickNextQuestion(page);
      }
    }

    // Verify perfect score
    await expectResultPage(page);
    await expectScore(page, 10, 10);

    // Verify 100% accuracy message
    const accuracyText = page.locator('text=100');
    await expect(accuracyText).toBeVisible();
  });

  test('should get zero score (0/10)', async ({
    page,
    multipleChoiceWordSetId,
  }) => {
    // Navigate and start exam
    await gotoExamConfig(page, multipleChoiceWordSetId);
    await startExam(page, {
      mode: 'multiple-choice',
      direction: 'forward',
    });

    // Answer all 10 incorrectly (select wrong choices)
    for (let i = 0; i < 10; i++) {
      await waitForQuestionLoad(page);
      // Select last choice (likely wrong)
      await selectAnswer(page, 3);
      await expectIncorrectFeedback(page);

      if (i < 9) {
        await clickNextQuestion(page);
      }
    }

    // Verify zero score
    await expectResultPage(page);
    await expectScore(page, 0, 10);

    // Verify 0% accuracy
    const accuracyText = page.locator('text=/0\\.0%/');
    await expect(accuracyText).toBeVisible();
  });

  test('should handle mixed correct/incorrect answers (5 correct, 5 incorrect)', async ({
    page,
    multipleChoiceWordSetId,
  }) => {
    // Navigate and start exam
    await gotoExamConfig(page, multipleChoiceWordSetId);
    await startExam(page, {
      mode: 'multiple-choice',
      direction: 'forward',
    });

    // Answer with mixed pattern: correct, incorrect, correct, incorrect...
    for (let i = 0; i < 10; i++) {
      await waitForQuestionLoad(page);

      const isCorrect = i % 2 === 0;
      if (isCorrect) {
        await selectAnswer(page, 0); // Correct
        await expectCorrectFeedback(page);
      } else {
        await selectAnswer(page, 3); // Incorrect
        await expectIncorrectFeedback(page);
      }

      if (i < 9) {
        await clickNextQuestion(page);
      }
    }

    // Verify 50% score
    await expectResultPage(page);
    await expectScore(page, 5, 10);
  });

  test('should navigate between questions using buttons', async ({
    page,
    multipleChoiceWordSetId,
  }) => {
    // Navigate and start exam
    await gotoExamConfig(page, multipleChoiceWordSetId);
    await startExam(page, {
      mode: 'multiple-choice',
      direction: 'forward',
    });

    // Start at question 1
    await waitForQuestionLoad(page);
    await expectProgressBar(page, 1, 10);

    // Move forward 3 questions
    for (let i = 0; i < 3; i++) {
      await selectAnswer(page, 0);
      await expectCorrectFeedback(page);
      if (i < 2) {
        await clickNextQuestion(page);
      }
    }

    // Verify at question 4
    await expectProgressBar(page, 4, 10);

    // Complete remaining questions
    for (let i = 4; i < 10; i++) {
      await selectAnswer(page, 0);
      await expectCorrectFeedback(page);

      if (i < 9) {
        await clickNextQuestion(page);
      }
    }

    // Verify result page reached
    await expectResultPage(page);
  });

  test('should show answer feedback (correct/incorrect highlight)', async ({
    page,
    multipleChoiceWordSetId,
  }) => {
    // Navigate and start exam
    await gotoExamConfig(page, multipleChoiceWordSetId);
    await startExam(page, {
      mode: 'multiple-choice',
      direction: 'forward',
    });

    // Question 1: Select correct answer
    await waitForQuestionLoad(page);
    await selectAnswer(page, 0);
    await expectCorrectFeedback(page);

    // Verify green highlight on correct choice
    const greenChoice = page.locator('[data-testid="choice-0"][class*="green"]');
    await expect(greenChoice).toBeVisible();

    // Move to next question
    await clickNextQuestion(page);

    // Question 2: Select incorrect answer
    await waitForQuestionLoad(page);
    await selectAnswer(page, 3);
    await expectIncorrectFeedback(page);

    // Verify red highlight on incorrect choice
    const redChoice = page.locator('[data-testid="choice-3"][class*="red"]');
    await expect(redChoice).toBeVisible();

    // Verify correct choice is highlighted in green
    const correctGreen = page.locator('[data-testid="choice-0"][class*="green"]');
    await expect(correctGreen).toBeVisible();

    // Complete exam
    for (let i = 2; i < 10; i++) {
      await clickNextQuestion(page);
      await waitForQuestionLoad(page);
      await selectAnswer(page, 0);
      await expectCorrectFeedback(page);
    }

    await expectResultPage(page);
  });

  test('should display progress bar correctly', async ({
    page,
    multipleChoiceWordSetId,
  }) => {
    // Navigate and start exam
    await gotoExamConfig(page, multipleChoiceWordSetId);
    await startExam(page, {
      mode: 'multiple-choice',
      direction: 'forward',
    });

    // Verify progress through questions
    const progressVerifications = [1, 3, 5, 7, 10];

    for (const questionNumber of progressVerifications) {
      await waitForQuestionLoad(page);

      if (questionNumber > 1) {
        await expectProgressBar(page, questionNumber, 10);
      } else {
        await expectProgressBar(page, 1, 10);
      }

      await selectAnswer(page, 0);
      await expectCorrectFeedback(page);

      if (questionNumber < 10) {
        await clickNextQuestion(page);
      }
    }

    // Complete remaining questions
    for (let i = 11; i <= 10; i++) {
      if (i <= 10) {
        await clickNextQuestion(page);
        await waitForQuestionLoad(page);
        await selectAnswer(page, 0);
        await expectCorrectFeedback(page);
      }
    }

    // Final verification: 10/10
    await expectProgressBar(page, 10, 10);
    await expectResultPage(page);
  });

  test('should show result page with accurate score calculation', async ({
    page,
    multipleChoiceWordSetId,
  }) => {
    // Navigate and start exam
    await gotoExamConfig(page, multipleChoiceWordSetId);
    await startExam(page, {
      mode: 'multiple-choice',
      direction: 'forward',
    });

    // Answer 7 correct, 3 incorrect
    let correctCount = 0;
    for (let i = 0; i < 10; i++) {
      await waitForQuestionLoad(page);

      // Pattern: correct for first 7, incorrect for last 3
      const isCorrect = i < 7;
      if (isCorrect) {
        await selectAnswer(page, 0);
        correctCount++;
        await expectCorrectFeedback(page);
      } else {
        await selectAnswer(page, 3);
        await expectIncorrectFeedback(page);
      }

      if (i < 9) {
        await clickNextQuestion(page);
      }
    }

    // Verify result page
    await expectResultPage(page);

    // Verify score calculation
    await expectScore(page, correctCount, 10);

    // Verify percentage calculation (70%)
    const percentageText = page.locator('text=/70\\.0?%/');
    await expect(percentageText).toBeVisible();

    // Verify score display
    const scoreText = `${correctCount} / 10`;
    const scoreElement = page.locator(`text=${scoreText}`);
    await expect(scoreElement).toBeVisible();
  });
});
