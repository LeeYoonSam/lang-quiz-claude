/**
 * E2E Test Helpers
 *
 * Provides utility functions for exam testing
 */

import { Page, expect } from '@playwright/test';

/**
 * Navigate to exam configuration screen
 */
export async function gotoExamConfig(page: Page, wordSetId: string): Promise<void> {
  await page.goto(`/wordsets/${wordSetId}/exam`);
  await page.waitForLoadState('networkidle');
}

/**
 * Start exam with given configuration
 */
export async function startExam(
  page: Page,
  config: {
    mode: 'multiple-choice' | 'short-answer' | 'mixed';
    direction: 'forward' | 'reverse';
  }
): Promise<void> {
  // Select mode
  const modeRadio = page.locator(`input[type="radio"][value="${config.mode}"]`);
  await modeRadio.click();

  // Select direction
  const directionRadio = page.locator(`input[type="radio"][value="${config.direction}"]`);
  await directionRadio.click();

  // Click start button
  const startButton = page.locator('button:has-text("시험 시작")');
  await startButton.click();

  // Wait for navigation to progress page
  await page.waitForURL(/\/exam\/progress/);
  await page.waitForLoadState('networkidle');
}

/**
 * Select an answer for multiple-choice question
 */
export async function selectAnswer(page: Page, choiceIndex: number): Promise<void> {
  const choices = page.locator('button[data-testid^="choice-"]');
  await choices.nth(choiceIndex).click();
}

/**
 * Submit a short-answer response
 */
export async function submitShortAnswer(page: Page, text: string): Promise<void> {
  const input = page.locator('input[type="text"][placeholder*="답"]');
  await input.fill(text);

  const submitButton = page.locator('button:has-text("제출")');
  await submitButton.click();
}

/**
 * Click next question button
 */
export async function clickNextQuestion(page: Page): Promise<void> {
  const nextButton = page.locator('button:has-text("다음")');
  await nextButton.click();
  await page.waitForLoadState('networkidle');
}

/**
 * Click previous question button
 */
export async function clickPreviousQuestion(page: Page): Promise<void> {
  const prevButton = page.locator('button:has-text("이전")');
  await prevButton.click();
  await page.waitForLoadState('networkidle');
}

/**
 * Expect correct feedback (green highlight)
 */
export async function expectCorrectFeedback(page: Page): Promise<void> {
  const feedback = page.locator('text=정답입니다');
  await expect(feedback).toBeVisible();

  // Look for green styling
  const greenElement = page.locator('[class*="green"][class*="bg"]');
  await expect(greenElement).toBeVisible();
}

/**
 * Expect incorrect feedback (red highlight)
 */
export async function expectIncorrectFeedback(page: Page): Promise<void> {
  const feedback = page.locator('text=/오답입니다/');
  await expect(feedback).toBeVisible();

  // Look for red styling
  const redElement = page.locator('[class*="red"][class*="bg"]');
  await expect(redElement).toBeVisible();
}

/**
 * Expect to be on result page
 */
export async function expectResultPage(page: Page): Promise<void> {
  await page.waitForURL(/\/exam\/result/);
  await page.waitForLoadState('networkidle');

  // Verify result page elements
  await expect(page.locator('text=결과')).toBeVisible();
  await expect(page.locator('text=/정답률/')).toBeVisible();
}

/**
 * Verify progress bar shows expected values
 */
export async function expectProgressBar(
  page: Page,
  current: number,
  total: number
): Promise<void> {
  const progressText = page.locator(`text=${current} / ${total}`);
  await expect(progressText).toBeVisible();

  // Verify progress bar percentage
  const expectedPercentage = Math.round((current / total) * 100);
  const progressBar = page.locator('[data-testid="progress-bar"]');
  const style = await progressBar.getAttribute('style');
  expect(style).toContain(`${expectedPercentage}%`);
}

/**
 * Wait for question to load with timeout
 */
export async function waitForQuestionLoad(page: Page, timeout: number = 1000): Promise<void> {
  await page.waitForSelector('[data-testid="question-prompt"]', { timeout });
}

/**
 * Wait for feedback to appear with timeout
 */
export async function waitForFeedback(page: Page, timeout: number = 500): Promise<void> {
  await page.waitForSelector('[data-testid="feedback-message"]', { timeout });
}

/**
 * Navigate to learn page with incorrect_review mode
 */
export async function expectIncorrectReviewNavigation(page: Page, wordSetId: string): Promise<void> {
  // Wait for "오답 다시 보기" button and click it
  const reviewButton = page.locator('button:has-text("오답 다시 보기")');
  await expect(reviewButton).toBeVisible();
  await reviewButton.click();

  // Expect navigation to learn page with mode parameter
  await page.waitForURL(/\/wordsets\/.*\/learn.*mode=incorrect_review/);
}

/**
 * Verify exit confirmation dialog appears and handle it
 */
export async function handleExitConfirmation(page: Page, accept: boolean): Promise<void> {
  // Wait for dialog
  page.once('dialog', (dialog) => {
    expect(dialog.message()).toContain('시험을 중단하시겠습니까');
    if (accept) {
      dialog.accept();
    } else {
      dialog.dismiss();
    }
  });

  // Click exit/back button
  const exitButton = page.locator('button:has-text("뒤로")');
  await exitButton.click();
}

/**
 * Measure page load time
 */
export async function measureLoadTime(page: Page, url: string): Promise<number> {
  const startTime = Date.now();
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  return Date.now() - startTime;
}

/**
 * Verify score on result page
 */
export async function expectScore(page: Page, correctCount: number, totalCount: number): Promise<void> {
  const scoreText = `${correctCount} / ${totalCount}`;
  const scoreElement = page.locator(`text=${scoreText}`);
  await expect(scoreElement).toBeVisible();

  // Verify accuracy percentage
  const percentage = Math.round((correctCount / totalCount) * 100 * 10) / 10;
  const percentageText = `${percentage}%`;
  const percentElement = page.locator(`text=/${percentage}/`);
  await expect(percentElement).toBeVisible();
}

/**
 * Retry exam by clicking retry button
 */
export async function retryExam(page: Page): Promise<void> {
  const retryButton = page.locator('button:has-text("다시 시험하기")');
  await expect(retryButton).toBeVisible();
  await retryButton.click();

  // Should go back to exam config
  await page.waitForURL(/\/exam$/);
}

/**
 * Return to wordset detail from result
 */
export async function returnToWordsetDetail(page: Page): Promise<void> {
  const returnButton = page.locator('button:has-text("세트로 돌아가기")');
  await expect(returnButton).toBeVisible();
  await returnButton.click();

  // Should go back to wordset detail
  await page.waitForURL(/\/wordsets\/[a-z0-9]+$/);
}
