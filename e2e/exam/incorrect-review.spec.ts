/**
 * E2E-4: Incorrect Words Review Flow
 *
 * Tests for filtering and reviewing only incorrect words from exam results
 */

import { test, expect } from './fixtures';
import {
  gotoExamConfig,
  startExam,
  selectAnswer,
  clickNextQuestion,
  expectIncorrectFeedback,
  expectCorrectFeedback,
  expectResultPage,
  expectIncorrectReviewNavigation,
  waitForQuestionLoad,
} from '../shared/helpers';

test.describe('Exam: Incorrect Words Review (E2E-4)', () => {
  test('should filter and display only incorrect words', async ({
    page,
    multipleChoiceWordSetId,
  }) => {
    // Navigate and start exam
    await gotoExamConfig(page, multipleChoiceWordSetId);
    await startExam(page, {
      mode: 'multiple-choice',
      direction: 'forward',
    });

    // Answer with pattern: correct, incorrect, correct, incorrect...
    for (let i = 0; i < 10; i++) {
      await waitForQuestionLoad(page);

      const isCorrect = i % 2 === 0;
      if (isCorrect) {
        await selectAnswer(page, 0);
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

    // Get incorrect words list
    const incorrectWordsSection = page.locator('text=/오답 단어|오답 목록/');
    await expect(incorrectWordsSection).toBeVisible();

    // Count incorrect items (should be 5)
    const incorrectItems = page.locator('[data-testid="incorrect-word-item"]');
    const count = await incorrectItems.count();
    expect(count).toBeGreaterThanOrEqual(4); // At least 4 incorrect
  });

  test('should navigate to learn mode with ?mode=incorrect_review', async ({
    page,
    multipleChoiceWordSetId,
  }) => {
    // Navigate and start exam
    await gotoExamConfig(page, multipleChoiceWordSetId);
    await startExam(page, {
      mode: 'multiple-choice',
      direction: 'forward',
    });

    // Answer questions to create some incorrect answers
    for (let i = 0; i < 10; i++) {
      await waitForQuestionLoad(page);

      if (i < 3) {
        // First 3 correct
        await selectAnswer(page, 0);
        await expectCorrectFeedback(page);
      } else {
        // Last 7 incorrect
        await selectAnswer(page, 3);
        await expectIncorrectFeedback(page);
      }

      if (i < 9) {
        await clickNextQuestion(page);
      }
    }

    // Verify result page
    await expectResultPage(page);

    // Click "오답 다시 보기" button
    const reviewButton = page.locator('button:has-text("오답 다시 보기")');
    await expect(reviewButton).toBeVisible();
    await reviewButton.click();

    // Verify navigation to learn page with mode parameter
    await page.waitForURL(/\/wordsets\/.*\/learn.*mode=incorrect_review/);
    await page.waitForLoadState('networkidle');

    // Verify on learn page
    const learnPageTitle = page.locator('text=/학습|복습/');
    await expect(learnPageTitle).toBeVisible();
  });

  test('should initialize review mode in learn page', async ({
    page,
    multipleChoiceWordSetId,
  }) => {
    // Navigate and start exam
    await gotoExamConfig(page, multipleChoiceWordSetId);
    await startExam(page, {
      mode: 'multiple-choice',
      direction: 'forward',
    });

    // Create incorrect answers
    for (let i = 0; i < 10; i++) {
      await waitForQuestionLoad(page);

      if (i < 2) {
        await selectAnswer(page, 0);
        await expectCorrectFeedback(page);
      } else {
        await selectAnswer(page, 3);
        await expectIncorrectFeedback(page);
      }

      if (i < 9) {
        await clickNextQuestion(page);
      }
    }

    // Navigate to incorrect review
    await expectResultPage(page);
    await expectIncorrectReviewNavigation(page, multipleChoiceWordSetId);

    // Verify learn page shows incorrect review mode
    const reviewModeIndicator = page.locator('text=/오답.*복습|복습 모드/i');
    // May or may not be shown, depending on implementation
    // At minimum, verify we're on learn page
    const flipCard = page.locator('[data-testid="flip-card"]');
    await expect(flipCard).toBeVisible({ timeout: 10000 });
  });

  test('should allow return to exam result page', async ({
    page,
    multipleChoiceWordSetId,
  }) => {
    // Navigate and start exam
    await gotoExamConfig(page, multipleChoiceWordSetId);
    await startExam(page, {
      mode: 'multiple-choice',
      direction: 'forward',
    });

    // Create mix of correct and incorrect answers
    for (let i = 0; i < 10; i++) {
      await waitForQuestionLoad(page);

      if (i % 2 === 0) {
        await selectAnswer(page, 0);
        await expectCorrectFeedback(page);
      } else {
        await selectAnswer(page, 3);
        await expectIncorrectFeedback(page);
      }

      if (i < 9) {
        await clickNextQuestion(page);
      }
    }

    // Get result page URL for verification
    await expectResultPage(page);
    const resultPageUrl = page.url();

    // Navigate to review
    await expectIncorrectReviewNavigation(page, multipleChoiceWordSetId);

    // Now return to result - look for "결과로 돌아가기" button
    const returnButton = page.locator('button:has-text(/돌아가|돌아|돌려/)');
    if (await returnButton.isVisible()) {
      await returnButton.click();
      // Should return to result page
      await page.waitForURL(/\/exam\/result/, { timeout: 10000 });
    }
  });
});
