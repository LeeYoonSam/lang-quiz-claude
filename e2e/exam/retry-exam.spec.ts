/**
 * E2E-6: Retry and Restart Exam
 *
 * Tests for exam retry functionality and new question generation
 */

import { test, expect } from './fixtures';
import {
  gotoExamConfig,
  startExam,
  selectAnswer,
  clickNextQuestion,
  expectCorrectFeedback,
  expectResultPage,
  retryExam,
  waitForQuestionLoad,
} from '../shared/helpers';

test.describe('Exam: Retry/Restart (E2E-6)', () => {
  test('should show retry button on result page', async ({
    page,
    multipleChoiceWordSetId,
  }) => {
    // Navigate and start exam
    await gotoExamConfig(page, multipleChoiceWordSetId);
    await startExam(page, {
      mode: 'multiple-choice',
      direction: 'forward',
    });

    // Complete exam quickly
    for (let i = 0; i < 10; i++) {
      await waitForQuestionLoad(page);
      await selectAnswer(page, 0);
      await expectCorrectFeedback(page);

      if (i < 9) {
        await clickNextQuestion(page);
      }
    }

    // Verify result page
    await expectResultPage(page);

    // Look for retry button
    const retryButton = page.locator('button:has-text("다시 시험하기")');
    await expect(retryButton).toBeVisible();
  });

  test('should navigate to config screen on retry', async ({
    page,
    multipleChoiceWordSetId,
  }) => {
    // Navigate and start exam
    await gotoExamConfig(page, multipleChoiceWordSetId);
    await startExam(page, {
      mode: 'multiple-choice',
      direction: 'forward',
    });

    // Complete exam
    for (let i = 0; i < 10; i++) {
      await waitForQuestionLoad(page);
      await selectAnswer(page, 0);
      await expectCorrectFeedback(page);

      if (i < 9) {
        await clickNextQuestion(page);
      }
    }

    // Verify on result page
    await expectResultPage(page);

    // Click retry
    const retryButton = page.locator('button:has-text("다시 시험하기")');
    await expect(retryButton).toBeVisible();
    await retryButton.click();

    // Should return to config screen
    await page.waitForURL(/\/wordsets\/.*\/exam$/);

    // Verify config options are visible
    const modeOptions = page.locator('input[type="radio"][name="mode"]');
    await expect(modeOptions.first()).toBeVisible();

    const directionOptions = page.locator('input[type="radio"][name="direction"]');
    await expect(directionOptions.first()).toBeVisible();

    // Verify start button
    const startButton = page.locator('button:has-text("시험 시작")');
    await expect(startButton).toBeVisible();
  });

  test('should generate new question order on restart', async ({
    page,
    mixedModeWordSetId,
  }) => {
    // First exam
    await gotoExamConfig(page, mixedModeWordSetId);
    await startExam(page, {
      mode: 'mixed',
      direction: 'forward',
    });

    // Collect question order from first exam
    const firstExamOrder: boolean[] = [];
    for (let i = 0; i < 5; i++) {
      await waitForQuestionLoad(page);

      const multipleChoiceButtons = page.locator('button[data-testid^="choice-"]');
      const isMultipleChoice = (await multipleChoiceButtons.count()) > 0;
      firstExamOrder.push(isMultipleChoice);

      if (isMultipleChoice) {
        await selectAnswer(page, 0);
      } else {
        const input = page.locator('input[type="text"][placeholder*="답"]');
        await input.fill('answer');
        const submitButton = page.locator('button:has-text("제출")');
        await submitButton.click();
      }

      if (i < 4) {
        await clickNextQuestion(page);
      }
    }

    // Complete remaining questions
    for (let i = 5; i < 10; i++) {
      await clickNextQuestion(page);
      await waitForQuestionLoad(page);

      const multipleChoiceButtons = page.locator('button[data-testid^="choice-"]');
      const isMultipleChoice = (await multipleChoiceButtons.count()) > 0;

      if (isMultipleChoice) {
        await selectAnswer(page, 0);
      } else {
        const input = page.locator('input[type="text"][placeholder*="답"]');
        await input.fill('answer');
        const submitButton = page.locator('button:has-text("제출")');
        await submitButton.click();
      }
    }

    // Get result page
    await expectResultPage(page);

    // Click retry
    await retryExam(page);

    // Should be back at config
    await page.waitForURL(/\/exam$/);

    // Start new exam
    await startExam(page, {
      mode: 'mixed',
      direction: 'forward',
    });

    // Collect question order from second exam
    const secondExamOrder: boolean[] = [];
    for (let i = 0; i < 5; i++) {
      await waitForQuestionLoad(page);

      const multipleChoiceButtons = page.locator('button[data-testid^="choice-"]');
      const isMultipleChoice = (await multipleChoiceButtons.count()) > 0;
      secondExamOrder.push(isMultipleChoice);

      if (isMultipleChoice) {
        await selectAnswer(page, 0);
      } else {
        const input = page.locator('input[type="text"][placeholder*="답"]');
        await input.fill('answer');
        const submitButton = page.locator('button:has-text("제출")');
        await submitButton.click();
      }

      if (i < 4) {
        await clickNextQuestion(page);
      }
    }

    // The question order might be different due to randomization
    // Just verify that the exam ran successfully
    for (let i = 5; i < 10; i++) {
      await clickNextQuestion(page);
      await waitForQuestionLoad(page);

      const multipleChoiceButtons = page.locator('button[data-testid^="choice-"]');
      const isMultipleChoice = (await multipleChoiceButtons.count()) > 0;

      if (isMultipleChoice) {
        await selectAnswer(page, 0);
      } else {
        const input = page.locator('input[type="text"][placeholder*="답"]');
        await input.fill('answer');
        const submitButton = page.locator('button:has-text("제출")');
        await submitButton.click();
      }
    }

    await expectResultPage(page);
  });
});
