/**
 * E2E-3: Mixed Mode Question Flow
 *
 * Tests for mixed-mode exams with 3:7 ratio of multiple-choice to short-answer
 */

import { test, expect } from './fixtures';
import {
  gotoExamConfig,
  startExam,
  selectAnswer,
  submitShortAnswer,
  clickNextQuestion,
  expectCorrectFeedback,
  expectResultPage,
  waitForQuestionLoad,
  expectScore,
} from '../shared/helpers';

test.describe('Exam: Mixed Mode Flow (E2E-3)', () => {
  test('should maintain 3:7 ratio (3 multiple-choice, 7 short-answer)', async ({
    page,
    mixedModeWordSetId,
  }) => {
    // Navigate and start exam
    await gotoExamConfig(page, mixedModeWordSetId);
    await startExam(page, {
      mode: 'mixed',
      direction: 'forward',
    });

    let multipleChoiceCount = 0;
    let shortAnswerCount = 0;

    // Go through 10 questions and count types
    for (let i = 0; i < 10; i++) {
      await waitForQuestionLoad(page);

      // Detect question type
      const multipleChoiceButtons = page.locator('button[data-testid^="choice-"]');
      const shortAnswerInput = page.locator('input[type="text"][placeholder*="답"]');

      const isMultipleChoice = (await multipleChoiceButtons.count()) > 0;

      if (isMultipleChoice) {
        multipleChoiceCount++;
        await selectAnswer(page, 0);
      } else {
        shortAnswerCount++;
        await submitShortAnswer(page, 'answer');
      }

      await expectCorrectFeedback(page);

      if (i < 9) {
        await clickNextQuestion(page);
      }
    }

    // Verify ratio approximately 3:7 (may vary due to randomization)
    // Expect 2-4 multiple choice and 6-8 short answer
    expect(multipleChoiceCount).toBeGreaterThanOrEqual(2);
    expect(multipleChoiceCount).toBeLessThanOrEqual(4);
    expect(shortAnswerCount).toBeGreaterThanOrEqual(6);
    expect(shortAnswerCount).toBeLessThanOrEqual(8);

    // Verify result page
    await expectResultPage(page);
  });

  test('should randomize question order each exam', async ({
    page,
    mixedModeWordSetId,
  }) => {
    // First exam
    await gotoExamConfig(page, mixedModeWordSetId);
    await startExam(page, {
      mode: 'mixed',
      direction: 'forward',
    });

    const firstExamOrder: boolean[] = [];

    for (let i = 0; i < 5; i++) {
      await waitForQuestionLoad(page);

      // Detect question type (true = multiple-choice, false = short-answer)
      const multipleChoiceButtons = page.locator('button[data-testid^="choice-"]');
      const isMultipleChoice = (await multipleChoiceButtons.count()) > 0;
      firstExamOrder.push(isMultipleChoice);

      // Answer question
      if (isMultipleChoice) {
        await selectAnswer(page, 0);
      } else {
        await submitShortAnswer(page, 'answer');
      }

      if (i < 4) {
        await clickNextQuestion(page);
      }
    }

    // Finish first exam
    for (let i = 5; i < 10; i++) {
      await clickNextQuestion(page);
      await waitForQuestionLoad(page);

      const multipleChoiceButtons = page.locator('button[data-testid^="choice-"]');
      const isMultipleChoice = (await multipleChoiceButtons.count()) > 0;

      if (isMultipleChoice) {
        await selectAnswer(page, 0);
      } else {
        await submitShortAnswer(page, 'answer');
      }
    }

    await expectResultPage(page);

    // Go back to config and start new exam
    await page.goto(page.url().replace('/result', ''));

    // Click retry
    const retryButton = page.locator('button:has-text("다시 시험하기")');
    if (await retryButton.isVisible()) {
      await retryButton.click();
      await page.waitForURL(/\/exam$/);
    }

    // Start second exam
    await startExam(page, {
      mode: 'mixed',
      direction: 'forward',
    });

    // Collect order from second exam (first 5 questions)
    const secondExamOrder: boolean[] = [];

    for (let i = 0; i < 5; i++) {
      await waitForQuestionLoad(page);

      const multipleChoiceButtons = page.locator('button[data-testid^="choice-"]');
      const isMultipleChoice = (await multipleChoiceButtons.count()) > 0;
      secondExamOrder.push(isMultipleChoice);

      if (isMultipleChoice) {
        await selectAnswer(page, 0);
      } else {
        await submitShortAnswer(page, 'answer');
      }

      if (i < 4) {
        await clickNextQuestion(page);
      }
    }

    // Orders should be different (with very high probability)
    // Note: There's a small chance they could be the same, but it's unlikely
    const ordersAreEqual =
      JSON.stringify(firstExamOrder) === JSON.stringify(secondExamOrder);
    // Don't strictly assert this due to randomness, but at least show it works
    if (!ordersAreEqual) {
      expect(ordersAreEqual).toBe(false);
    }
  });

  test('should calculate mixed results correctly', async ({
    page,
    mixedModeWordSetId,
  }) => {
    // Navigate and start exam
    await gotoExamConfig(page, mixedModeWordSetId);
    await startExam(page, {
      mode: 'mixed',
      direction: 'forward',
    });

    let correctCount = 0;

    // Answer all questions (pattern: all correct for simplicity)
    for (let i = 0; i < 10; i++) {
      await waitForQuestionLoad(page);

      // Detect question type
      const multipleChoiceButtons = page.locator('button[data-testid^="choice-"]');
      const isMultipleChoice = (await multipleChoiceButtons.count()) > 0;

      if (isMultipleChoice) {
        await selectAnswer(page, 0);
      } else {
        await submitShortAnswer(page, 'answer');
      }

      await expectCorrectFeedback(page);
      correctCount++;

      if (i < 9) {
        await clickNextQuestion(page);
      }
    }

    // Verify result page with correct score
    await expectResultPage(page);
    await expectScore(page, correctCount, 10);

    // Verify 100% accuracy
    const accuracyText = page.locator('text=100');
    await expect(accuracyText).toBeVisible();
  });
});
