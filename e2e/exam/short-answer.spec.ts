/**
 * E2E-2: Short Answer Question Flow
 *
 * Tests for short-answer exam questions including text input,
 * case/whitespace insensitivity, and validation
 */

import { test, expect } from './fixtures';
import {
  gotoExamConfig,
  startExam,
  submitShortAnswer,
  clickNextQuestion,
  expectCorrectFeedback,
  expectIncorrectFeedback,
  expectResultPage,
  waitForQuestionLoad,
  expectScore,
} from '../shared/helpers';

test.describe('Exam: Short Answer Question Flow (E2E-2)', () => {
  test('should submit and validate correct answer', async ({
    page,
    shortAnswerWordSetId,
  }) => {
    // Navigate and start exam
    await gotoExamConfig(page, shortAnswerWordSetId);
    await startExam(page, {
      mode: 'short-answer',
      direction: 'forward',
    });

    // First question - submit correct answer
    await waitForQuestionLoad(page);
    await submitShortAnswer(page, 'cat');
    await expectCorrectFeedback(page);

    // Complete remaining questions
    for (let i = 1; i < 10; i++) {
      await clickNextQuestion(page);
      await waitForQuestionLoad(page);
      await submitShortAnswer(page, 'correct-answer');
      await expectCorrectFeedback(page);
    }

    // Verify result page
    await expectResultPage(page);
  });

  test('should validate incorrect answer', async ({
    page,
    shortAnswerWordSetId,
  }) => {
    // Navigate and start exam
    await gotoExamConfig(page, shortAnswerWordSetId);
    await startExam(page, {
      mode: 'short-answer',
      direction: 'forward',
    });

    // First question - submit incorrect answer
    await waitForQuestionLoad(page);
    await submitShortAnswer(page, 'wrong-answer');
    await expectIncorrectFeedback(page);

    // Verify "next" button appears to continue
    const nextButton = page.locator('button:has-text("다음")');
    await expect(nextButton).toBeVisible();

    // Complete remaining questions
    for (let i = 1; i < 10; i++) {
      await clickNextQuestion(page);
      await waitForQuestionLoad(page);
      await submitShortAnswer(page, 'some-answer');
      // Some will be correct, some incorrect
      const feedbackElement = page.locator('[data-testid="feedback-message"]');
      await expect(feedbackElement).toBeVisible();
    }

    await expectResultPage(page);
  });

  test('should ignore case (uppercase/lowercase)', async ({
    page,
    shortAnswerWordSetId,
  }) => {
    // Navigate and start exam
    await gotoExamConfig(page, shortAnswerWordSetId);
    await startExam(page, {
      mode: 'short-answer',
      direction: 'forward',
    });

    // Question 1: submit with uppercase
    await waitForQuestionLoad(page);
    await submitShortAnswer(page, 'CAT');
    await expectCorrectFeedback(page);

    // Question 2: submit with mixed case
    await clickNextQuestion(page);
    await waitForQuestionLoad(page);
    await submitShortAnswer(page, 'DoG');
    await expectCorrectFeedback(page);

    // Complete remaining questions
    for (let i = 2; i < 10; i++) {
      await clickNextQuestion(page);
      await waitForQuestionLoad(page);
      await submitShortAnswer(page, 'correct-answer');
      await expectCorrectFeedback(page);
    }

    await expectResultPage(page);
  });

  test('should ignore whitespace (leading/trailing)', async ({
    page,
    shortAnswerWordSetId,
  }) => {
    // Navigate and start exam
    await gotoExamConfig(page, shortAnswerWordSetId);
    await startExam(page, {
      mode: 'short-answer',
      direction: 'forward',
    });

    // Question 1: submit with leading space
    await waitForQuestionLoad(page);
    await submitShortAnswer(page, '  cat');
    await expectCorrectFeedback(page);

    // Question 2: submit with trailing space
    await clickNextQuestion(page);
    await waitForQuestionLoad(page);
    await submitShortAnswer(page, 'dog  ');
    await expectCorrectFeedback(page);

    // Question 3: submit with both
    await clickNextQuestion(page);
    await waitForQuestionLoad(page);
    await submitShortAnswer(page, '  elephant  ');
    await expectCorrectFeedback(page);

    // Complete remaining questions
    for (let i = 3; i < 10; i++) {
      await clickNextQuestion(page);
      await waitForQuestionLoad(page);
      await submitShortAnswer(page, 'correct-answer');
      await expectCorrectFeedback(page);
    }

    await expectResultPage(page);
  });

  test('should handle empty input', async ({
    page,
    shortAnswerWordSetId,
  }) => {
    // Navigate and start exam
    await gotoExamConfig(page, shortAnswerWordSetId);
    await startExam(page, {
      mode: 'short-answer',
      direction: 'forward',
    });

    // Question 1: submit empty
    await waitForQuestionLoad(page);
    const input = page.locator('input[type="text"][placeholder*="답"]');
    const submitButton = page.locator('button:has-text("제출")');

    // Try to submit without input
    await submitButton.click();

    // Should either show error or treat as incorrect
    const feedbackElement = page.locator('[data-testid="feedback-message"]');
    await expect(feedbackElement).toBeVisible();

    // Complete remaining questions
    for (let i = 1; i < 10; i++) {
      if (i > 1) {
        await clickNextQuestion(page);
      }
      await waitForQuestionLoad(page);
      await submitShortAnswer(page, 'correct-answer');
    }

    await expectResultPage(page);
  });

  test('should navigate through short-answer questions', async ({
    page,
    shortAnswerWordSetId,
  }) => {
    // Navigate and start exam
    await gotoExamConfig(page, shortAnswerWordSetId);
    await startExam(page, {
      mode: 'short-answer',
      direction: 'forward',
    });

    // Navigate through all questions
    for (let i = 0; i < 10; i++) {
      await waitForQuestionLoad(page);

      // Verify input field exists
      const input = page.locator('input[type="text"][placeholder*="답"]');
      await expect(input).toBeVisible();

      // Submit answer
      await submitShortAnswer(page, `answer-${i}`);

      // Verify feedback
      const feedbackElement = page.locator('[data-testid="feedback-message"]');
      await expect(feedbackElement).toBeVisible();

      // Move to next if not last
      if (i < 9) {
        await clickNextQuestion(page);
      }
    }

    // Verify result page
    await expectResultPage(page);
  });

  test('should calculate result correctly for short answers', async ({
    page,
    shortAnswerWordSetId,
  }) => {
    // Navigate and start exam
    await gotoExamConfig(page, shortAnswerWordSetId);
    await startExam(page, {
      mode: 'short-answer',
      direction: 'forward',
    });

    // Answer pattern: 6 correct, 4 incorrect
    let correctCount = 0;
    const correctAnswers = ['cat', 'dog', 'elephant', 'fish', 'giraffe', 'horse'];

    for (let i = 0; i < 10; i++) {
      await waitForQuestionLoad(page);

      let answer: string;
      if (i < 6) {
        answer = correctAnswers[i];
        correctCount++;
      } else {
        answer = `wrong-${i}`;
      }

      await submitShortAnswer(page, answer);

      // Verify feedback
      const feedbackElement = page.locator('[data-testid="feedback-message"]');
      await expect(feedbackElement).toBeVisible();

      if (i < 9) {
        await clickNextQuestion(page);
      }
    }

    // Verify result
    await expectResultPage(page);
    await expectScore(page, correctCount, 10);

    // Verify 60% accuracy
    const percentageText = page.locator('text=/60\\.0?%/');
    await expect(percentageText).toBeVisible();
  });
});
