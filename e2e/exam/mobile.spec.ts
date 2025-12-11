/**
 * E2E-7: Mobile Responsive (375px)
 *
 * Tests for mobile viewport responsiveness and touch interactions
 */

import { test as base, expect as baseExpect } from '@playwright/test';
import { createTestWordSet, deleteTestWordSet, createMobileTestData } from '../shared/test-data';
import {
  gotoExamConfig,
  startExam,
  selectAnswer,
  submitShortAnswer,
  clickNextQuestion,
  expectCorrectFeedback,
  expectProgressBar,
  waitForQuestionLoad,
} from '../shared/helpers';

// Mobile-specific test context
const test = base.extend({
  mobileWordSetId: async ({ page, context }, use) => {
    const wordSet = await createTestWordSet(page, {
      name: 'Test Set - Mobile',
      words: createMobileTestData(),
    });

    // Create a mobile-specific page
    const mobileContext = await context.browser()?.newContext({
      viewport: { width: 375, height: 667 },
    });
    const mobilePage = await mobileContext?.newPage();

    // Copy over any setup needed
    await use(wordSet.id);

    // Cleanup
    await mobileContext?.close();
    await deleteTestWordSet(page, wordSet.id);
  },
});

test.describe('Exam: Mobile Responsive (375px) (E2E-7)', () => {
  test('should display buttons with proper sizing', async ({
    page,
  }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Create word set
    const wordSet = await createTestWordSet(page, {
      name: 'Test - Mobile Buttons',
      words: createMobileTestData(),
    });

    // Navigate and start exam
    await gotoExamConfig(page, wordSet.id);
    await startExam(page, {
      mode: 'multiple-choice',
      direction: 'forward',
    });

    // Verify buttons are appropriately sized for mobile
    const choiceButtons = page.locator('button[data-testid^="choice-"]');
    const boundingBox = await choiceButtons.first().boundingBox();

    // Buttons should be full or near-full width on mobile
    expect(boundingBox?.width).toBeGreaterThan(300);

    // Verify padding/height for touch
    expect(boundingBox?.height).toBeGreaterThanOrEqual(40);

    // Cleanup
    await deleteTestWordSet(page, wordSet.id);
  });

  test('should render text at readable size', async ({
    page,
  }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Create word set
    const wordSet = await createTestWordSet(page, {
      name: 'Test - Mobile Text',
      words: createMobileTestData(),
    });

    // Navigate and start exam
    await gotoExamConfig(page, wordSet.id);
    await startExam(page, {
      mode: 'multiple-choice',
      direction: 'forward',
    });

    // Get question prompt
    await waitForQuestionLoad(page);
    const questionPrompt = page.locator('[data-testid="question-prompt"]');

    // Get computed font size
    const fontSize = await questionPrompt.evaluate((el) => {
      return window.getComputedStyle(el).fontSize;
    });

    // Should be at least 16px for readability
    const parsedSize = parseInt(fontSize, 10);
    expect(parsedSize).toBeGreaterThanOrEqual(16);

    // Cleanup
    await deleteTestWordSet(page, wordSet.id);
  });

  test('should provide accessible input fields', async ({
    page,
  }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Create word set
    const wordSet = await createTestWordSet(page, {
      name: 'Test - Mobile Input',
      words: createMobileTestData(),
    });

    // Navigate and start exam with short-answer
    await gotoExamConfig(page, wordSet.id);
    await startExam(page, {
      mode: 'short-answer',
      direction: 'forward',
    });

    // Verify input field
    await waitForQuestionLoad(page);
    const input = page.locator('input[type="text"][placeholder*="답"]');
    await baseExpect(input).toBeVisible();

    const inputBounds = await input.boundingBox();

    // Input should be appropriately sized for touch
    expect(inputBounds?.height).toBeGreaterThanOrEqual(40);
    expect(inputBounds?.width).toBeGreaterThan(300);

    // Should be able to type and see text
    await input.fill('test');
    await baseExpect(input).toHaveValue('test');

    // Cleanup
    await deleteTestWordSet(page, wordSet.id);
  });

  test('should support touch interactions', async ({
    page,
    context,
  }) => {
    // Set mobile viewport with touch support
    const mobileContext = await context.browser()?.newContext({
      viewport: { width: 375, height: 667 },
      hasTouch: true,
    });
    const mobilePage = await mobileContext?.newPage();

    // Create word set
    const wordSet = await createTestWordSet(mobilePage!, {
      name: 'Test - Mobile Touch',
      words: createMobileTestData(),
    });

    // Navigate and start exam
    await gotoExamConfig(mobilePage!, wordSet.id);
    await startExam(mobilePage!, {
      mode: 'multiple-choice',
      direction: 'forward',
    });

    // Perform touch interaction
    await waitForQuestionLoad(mobilePage!);
    const choiceButton = mobilePage!.locator('button[data-testid="choice-0"]');

    // Simulate tap
    const boundingBox = await choiceButton.boundingBox();
    if (boundingBox) {
      await mobilePage!.touchscreen.tap(
        boundingBox.x + boundingBox.width / 2,
        boundingBox.y + boundingBox.height / 2
      );
    }

    // Verify button was activated
    await baseExpect(choiceButton).toHaveClass(/selected|active/);

    // Cleanup
    await mobileContext?.close();
    await deleteTestWordSet(page, wordSet.id);
  });

  test('should display progress bar correctly', async ({
    page,
  }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Create word set
    const wordSet = await createTestWordSet(page, {
      name: 'Test - Mobile Progress',
      words: createMobileTestData(),
    });

    // Navigate and start exam
    await gotoExamConfig(page, wordSet.id);
    await startExam(page, {
      mode: 'multiple-choice',
      direction: 'forward',
    });

    // Verify progress bar on mobile
    for (let i = 1; i <= 5; i++) {
      await waitForQuestionLoad(page);
      await expectProgressBar(page, i, 10);

      const progressBar = page.locator('[data-testid="progress-bar"]');
      const boundingBox = await progressBar.boundingBox();

      // Progress bar should be visible and sized appropriately
      expect(boundingBox?.width).toBeGreaterThan(300);
      expect(boundingBox?.height).toBeGreaterThanOrEqual(4);

      // Select answer and move to next
      await selectAnswer(page, 0);
      await expectCorrectFeedback(page);

      if (i < 5) {
        await clickNextQuestion(page);
      }
    }

    // Complete remaining questions
    for (let i = 5; i < 10; i++) {
      await clickNextQuestion(page);
      await waitForQuestionLoad(page);
      await selectAnswer(page, 0);
      await expectCorrectFeedback(page);
    }

    // Cleanup
    await deleteTestWordSet(page, wordSet.id);
  });

  test('should show results with proper mobile layout', async ({
    page,
  }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Create word set
    const wordSet = await createTestWordSet(page, {
      name: 'Test - Mobile Results',
      words: createMobileTestData(),
    });

    // Navigate and start exam
    await gotoExamConfig(page, wordSet.id);
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

    // Verify result page layout
    await page.waitForURL(/\/exam\/result/);

    // Check result elements are visible and properly spaced
    const resultElements = page.locator('[data-testid="result-score"]');
    await baseExpect(resultElements).toBeVisible();

    const accuracyText = page.locator('text=/정답률|정확도/');
    await baseExpect(accuracyText).toBeVisible();

    // Buttons should be stacked vertically on mobile
    const buttons = page.locator('button:has-text(/다시|돌아가/)');
    const firstButton = buttons.first();
    const firstBounds = await firstButton.boundingBox();

    if (firstBounds) {
      expect(firstBounds.width).toBeGreaterThan(300);
    }

    // Cleanup
    await deleteTestWordSet(page, wordSet.id);
  });
});
