/**
 * Playwright Fixtures for Exam E2E Tests
 *
 * Provides shared test setup and teardown
 */

import { test as base, Page } from '@playwright/test';
import {
  createTestWordSet,
  deleteTestWordSet,
  createMultipleChoiceTestData,
  createShortAnswerTestData,
  createMixedModeTestData,
  createMobileTestData,
} from '../shared/test-data';

interface ExamFixtures {
  multipleChoiceWordSetId: string;
  shortAnswerWordSetId: string;
  mixedModeWordSetId: string;
  mobileTestWordSetId: string;
  page: Page;
}

/**
 * Extend base test with exam fixtures
 */
export const test = base.extend<ExamFixtures>({
  multipleChoiceWordSetId: async ({ page }, use) => {
    // Setup: Create word set for multiple-choice tests
    const wordSet = await createTestWordSet(page, {
      name: 'Test Set - Multiple Choice',
      words: createMultipleChoiceTestData(),
    });

    // Use in test
    await use(wordSet.id);

    // Teardown: Delete word set
    await deleteTestWordSet(page, wordSet.id);
  },

  shortAnswerWordSetId: async ({ page }, use) => {
    // Setup: Create word set for short-answer tests
    const wordSet = await createTestWordSet(page, {
      name: 'Test Set - Short Answer',
      words: createShortAnswerTestData(),
    });

    // Use in test
    await use(wordSet.id);

    // Teardown: Delete word set
    await deleteTestWordSet(page, wordSet.id);
  },

  mixedModeWordSetId: async ({ page }, use) => {
    // Setup: Create word set for mixed-mode tests
    const wordSet = await createTestWordSet(page, {
      name: 'Test Set - Mixed Mode',
      words: createMixedModeTestData(),
    });

    // Use in test
    await use(wordSet.id);

    // Teardown: Delete word set
    await deleteTestWordSet(page, wordSet.id);
  },

  mobileTestWordSetId: async ({ page }, use) => {
    // Setup: Create word set for mobile tests
    const wordSet = await createTestWordSet(page, {
      name: 'Test Set - Mobile',
      words: createMobileTestData(),
    });

    // Use in test
    await use(wordSet.id);

    // Teardown: Delete word set
    await deleteTestWordSet(page, wordSet.id);
  },
});

export const expect = base.expect;
export const describe = base.describe;
