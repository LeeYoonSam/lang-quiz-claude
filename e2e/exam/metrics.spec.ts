/**
 * E2E-8: Performance Metrics
 *
 * Tests for performance requirements including load times and frame rates
 */

import { test, expect } from './fixtures';
import {
  gotoExamConfig,
  startExam,
  selectAnswer,
  clickNextQuestion,
  measureLoadTime,
  waitForQuestionLoad,
} from '../shared/helpers';

test.describe('Exam: Performance Metrics (E2E-8)', () => {
  test('should load exam page in < 3 seconds', async ({
    page,
    multipleChoiceWordSetId,
  }) => {
    const startTime = Date.now();

    // Navigate to exam config
    await page.goto(`/wordsets/${multipleChoiceWordSetId}/exam`);
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);

    // Log for reference
    console.log(`Exam page load time: ${loadTime}ms`);
  });

  test('should load question in < 1 second', async ({
    page,
    multipleChoiceWordSetId,
  }) => {
    // Navigate and start exam
    await gotoExamConfig(page, multipleChoiceWordSetId);
    await startExam(page, {
      mode: 'multiple-choice',
      direction: 'forward',
    });

    // Measure question load time
    for (let i = 0; i < 5; i++) {
      const startTime = Date.now();

      // Wait for question to be fully loaded
      await waitForQuestionLoad(page, 1000);

      const loadTime = Date.now() - startTime;

      // Each question should load within 1 second
      expect(loadTime).toBeLessThan(1000);

      // Answer and move to next
      await selectAnswer(page, 0);
      if (i < 4) {
        await clickNextQuestion(page);
      }
    }
  });

  test('should provide answer feedback in < 500ms', async ({
    page,
    multipleChoiceWordSetId,
  }) => {
    // Navigate and start exam
    await gotoExamConfig(page, multipleChoiceWordSetId);
    await startExam(page, {
      mode: 'multiple-choice',
      direction: 'forward',
    });

    // Measure feedback time for multiple questions
    for (let i = 0; i < 5; i++) {
      await waitForQuestionLoad(page);

      const startTime = Date.now();

      // Select answer
      const choiceButton = page.locator('button[data-testid="choice-0"]');
      await choiceButton.click();

      // Wait for feedback to appear
      const feedbackElement = page.locator('[data-testid="feedback-message"]');
      await feedbackElement.waitFor({ state: 'visible' });

      const feedbackTime = Date.now() - startTime;

      // Feedback should appear within 500ms
      expect(feedbackTime).toBeLessThan(500);

      // Move to next question
      if (i < 4) {
        await clickNextQuestion(page);
      }
    }
  });

  test('should maintain 60fps during animations', async ({
    page,
    multipleChoiceWordSetId,
  }) => {
    // Navigate and start exam
    await gotoExamConfig(page, multipleChoiceWordSetId);
    await startExam(page, {
      mode: 'multiple-choice',
      direction: 'forward',
    });

    // Measure performance during animation-heavy operations
    await waitForQuestionLoad(page);

    // Use performance API to check frame rate
    const frameMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const frames: number[] = [];
        let lastTime = performance.now();
        let frameCount = 0;

        const measureFrames = () => {
          const currentTime = performance.now();
          const frameDuration = currentTime - lastTime;

          if (frameDuration < 16.67) {
            // 60fps = ~16.67ms per frame
            frameCount++;
          }

          frames.push(frameDuration);
          lastTime = currentTime;

          if (frameCount < 100) {
            requestAnimationFrame(measureFrames);
          } else {
            resolve({
              averageFrameTime: frames.reduce((a, b) => a + b, 0) / frames.length,
              fps60Count: frameCount,
              totalFrames: frames.length,
            });
          }
        };

        requestAnimationFrame(measureFrames);
      });
    });

    // Verify frame metrics
    console.log('Frame metrics:', frameMetrics);

    // At least 80% of frames should maintain 60fps
    const metrics = frameMetrics as any;
    const fps60Percentage = (metrics.fps60Count / metrics.totalFrames) * 100;
    expect(fps60Percentage).toBeGreaterThanOrEqual(80);
  });

  test('should handle rapid answer submissions', async ({
    page,
    multipleChoiceWordSetId,
  }) => {
    // Navigate and start exam
    await gotoExamConfig(page, multipleChoiceWordSetId);
    await startExam(page, {
      mode: 'multiple-choice',
      direction: 'forward',
    });

    // Test rapid submissions
    const startTime = Date.now();

    for (let i = 0; i < 5; i++) {
      await waitForQuestionLoad(page);

      // Rapid click
      const choiceButton = page.locator('button[data-testid="choice-0"]');
      await choiceButton.click({ force: true });

      // Don't wait for feedback, move to next immediately
      if (i < 4) {
        const nextButton = page.locator('button:has-text("다음")');
        await nextButton.click();
      }
    }

    const totalTime = Date.now() - startTime;

    // 5 questions should be navigatable in < 10 seconds
    expect(totalTime).toBeLessThan(10000);

    console.log(`Rapid navigation time: ${totalTime}ms`);
  });

  test('should maintain performance with 10-question exam', async ({
    page,
    multipleChoiceWordSetId,
  }) => {
    const startTime = Date.now();

    // Navigate and start exam
    await gotoExamConfig(page, multipleChoiceWordSetId);
    await startExam(page, {
      mode: 'multiple-choice',
      direction: 'forward',
    });

    // Complete full exam
    for (let i = 0; i < 10; i++) {
      await waitForQuestionLoad(page);
      await selectAnswer(page, 0);

      if (i < 9) {
        await clickNextQuestion(page);
      }
    }

    const totalTime = Date.now() - startTime;

    // Full exam should complete within 30 seconds
    expect(totalTime).toBeLessThan(30000);

    console.log(`Full exam completion time: ${totalTime}ms`);
  });

  test('should measure result page generation time', async ({
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

      if (i < 9) {
        await clickNextQuestion(page);
      }
    }

    // Measure result page render time
    const startTime = Date.now();

    await page.waitForURL(/\/exam\/result/);
    await page.waitForLoadState('networkidle');

    const resultPageTime = Date.now() - startTime;

    // Result page should render quickly
    expect(resultPageTime).toBeLessThan(2000);

    console.log(`Result page generation time: ${resultPageTime}ms`);
  });

  test('should not have memory leaks during exam', async ({
    page,
    multipleChoiceWordSetId,
  }) => {
    // Navigate and start exam
    await gotoExamConfig(page, multipleChoiceWordSetId);
    await startExam(page, {
      mode: 'multiple-choice',
      direction: 'forward',
    });

    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      if ((performance as any).memory) {
        return (performance as any).memory.usedJSHeapSize;
      }
      return 0;
    });

    // Complete full exam
    for (let i = 0; i < 10; i++) {
      await waitForQuestionLoad(page);
      await selectAnswer(page, 0);

      if (i < 9) {
        await clickNextQuestion(page);
      }
    }

    // Get final memory usage
    const finalMemory = await page.evaluate(() => {
      if ((performance as any).memory) {
        return (performance as any).memory.usedJSHeapSize;
      }
      return 0;
    });

    // Memory increase should be reasonable (less than 10MB)
    const memoryIncrease = finalMemory - initialMemory;
    const increaseInMB = memoryIncrease / (1024 * 1024);

    console.log(`Memory increase: ${increaseInMB.toFixed(2)}MB`);

    // If memory API is available, verify reasonable growth
    if (initialMemory > 0 && finalMemory > 0) {
      expect(increaseInMB).toBeLessThan(10);
    }
  });
});
