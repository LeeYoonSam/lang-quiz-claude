/**
 * E2E-5: Exit and Abandon Exam
 *
 * Tests for exam exit functionality and confirmation dialogs
 */

import { test, expect } from './fixtures';
import {
  gotoExamConfig,
  startExam,
  selectAnswer,
  clickNextQuestion,
  expectCorrectFeedback,
  waitForQuestionLoad,
  handleExitConfirmation,
} from '../shared/helpers';

test.describe('Exam: Exit and Abandon (E2E-5)', () => {
  test('should show confirmation dialog when clicking exit', async ({
    page,
    multipleChoiceWordSetId,
  }) => {
    // Navigate and start exam
    await gotoExamConfig(page, multipleChoiceWordSetId);
    await startExam(page, {
      mode: 'multiple-choice',
      direction: 'forward',
    });

    // Answer a couple questions
    for (let i = 0; i < 2; i++) {
      await waitForQuestionLoad(page);
      await selectAnswer(page, 0);
      await expectCorrectFeedback(page);

      if (i < 1) {
        await clickNextQuestion(page);
      }
    }

    // Click exit/back button and expect confirmation dialog
    const exitButton = page.locator('button:has-text("뒤로")');
    await expect(exitButton).toBeVisible();

    // Set up dialog handler
    const dialogPromise = page.waitForEvent('dialog');
    await exitButton.click();
    const dialog = await dialogPromise;

    // Verify dialog message
    expect(dialog.message()).toContain('시험을 중단');
  });

  test('should cancel exit and stay in exam', async ({
    page,
    multipleChoiceWordSetId,
  }) => {
    // Navigate and start exam
    await gotoExamConfig(page, multipleChoiceWordSetId);
    await startExam(page, {
      mode: 'multiple-choice',
      direction: 'forward',
    });

    // Answer a question
    await waitForQuestionLoad(page);
    const questionPrompt = await page.locator('[data-testid="question-prompt"]').textContent();
    await selectAnswer(page, 0);
    await expectCorrectFeedback(page);

    // Try to exit
    const exitButton = page.locator('button:has-text("뒤로")');

    // Set up dialog handler to dismiss
    page.on('dialog', (dialog) => {
      dialog.dismiss();
    });

    await exitButton.click();

    // Wait a moment for dialog to be processed
    await page.waitForTimeout(500);

    // Should still be on exam page
    const currentUrl = page.url();
    expect(currentUrl).toContain('/exam/progress');

    // Should still see exam content
    const progressBar = page.locator('[data-testid="progress-bar"]');
    await expect(progressBar).toBeVisible();
  });

  test('should confirm exit and return to wordset detail', async ({
    page,
    multipleChoiceWordSetId,
  }) => {
    // Navigate and start exam
    await gotoExamConfig(page, multipleChoiceWordSetId);
    await startExam(page, {
      mode: 'multiple-choice',
      direction: 'forward',
    });

    // Answer a question
    await waitForQuestionLoad(page);
    await selectAnswer(page, 0);
    await expectCorrectFeedback(page);

    // Click exit
    const exitButton = page.locator('button:has-text("뒤로")');

    // Set up dialog handler to accept
    page.on('dialog', (dialog) => {
      dialog.accept();
    });

    await exitButton.click();

    // Should navigate back to wordset detail
    await page.waitForURL(
      /\/wordsets\/[a-z0-9-]+$/,
      { timeout: 10000 }
    );

    // Verify on wordset detail page
    const wordsetTitle = page.locator('h1');
    await expect(wordsetTitle).toBeVisible();
  });

  test('should cleanup session storage on exit', async ({
    page,
    multipleChoiceWordSetId,
  }) => {
    // Navigate and start exam
    await gotoExamConfig(page, multipleChoiceWordSetId);
    await startExam(page, {
      mode: 'multiple-choice',
      direction: 'forward',
    });

    // Verify session storage exists
    const sessionKey = `exam_session_${multipleChoiceWordSetId}`;
    const sessionDataBefore = await page.evaluate((key) => {
      return sessionStorage.getItem(key);
    }, sessionKey);
    expect(sessionDataBefore).toBeTruthy();

    // Answer a question
    await waitForQuestionLoad(page);
    await selectAnswer(page, 0);
    await expectCorrectFeedback(page);

    // Exit exam
    const exitButton = page.locator('button:has-text("뒤로")');

    // Set up dialog handler to accept
    page.on('dialog', (dialog) => {
      dialog.accept();
    });

    await exitButton.click();

    // Wait for navigation
    await page.waitForURL(/\/wordsets\/[a-z0-9-]+$/);

    // Verify session storage is cleaned
    const sessionDataAfter = await page.evaluate((key) => {
      return sessionStorage.getItem(key);
    }, sessionKey);

    // Session should be cleared or null
    expect(sessionDataAfter).toBeNull();
  });
});
