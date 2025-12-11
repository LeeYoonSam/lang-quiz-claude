/**
 * E2E Test Data Generation
 *
 * Provides utilities to create test data via API calls
 */

import { Page } from '@playwright/test';

export interface TestWord {
  text: string;
  meaning: string;
}

export interface TestWordSet {
  id: string;
  name: string;
  description: string;
  words: TestWord[];
}

/**
 * Create a test word set via API
 */
export async function createTestWordSet(
  page: Page,
  data: {
    name: string;
    description?: string;
    words: TestWord[];
  }
): Promise<TestWordSet> {
  // First, create the wordset
  const wordsetResponse = await page.request.post('/api/wordsets', {
    data: {
      name: data.name,
      description: data.description || `Test set - ${data.name}`,
    },
  });

  const wordsetData = await wordsetResponse.json();
  const wordSetId = wordsetData.id;

  // Then add words to the wordset
  for (const word of data.words) {
    await page.request.post(`/api/wordsets/${wordSetId}/words`, {
      data: {
        text: word.text,
        meaning: word.meaning,
      },
    });
  }

  return {
    id: wordSetId,
    name: data.name,
    description: data.description || `Test set - ${data.name}`,
    words: data.words,
  };
}

/**
 * Delete a test word set via API
 */
export async function deleteTestWordSet(page: Page, wordSetId: string): Promise<void> {
  await page.request.delete(`/api/wordsets/${wordSetId}`);
}

/**
 * Create a multiple-choice exam word set (10 words)
 */
export function createMultipleChoiceTestData(): TestWord[] {
  return [
    { text: 'apple', meaning: '사과' },
    { text: 'banana', meaning: '바나나' },
    { text: 'cherry', meaning: '체리' },
    { text: 'date', meaning: '대추' },
    { text: 'elderberry', meaning: '엘더베리' },
    { text: 'fig', meaning: '무화과' },
    { text: 'grape', meaning: '포도' },
    { text: 'honeydew', meaning: '허니듀' },
    { text: 'iceberg', meaning: '빙산 양상추' },
    { text: 'jackfruit', meaning: '잭프루트' },
  ];
}

/**
 * Create a short-answer exam word set (10 words)
 */
export function createShortAnswerTestData(): TestWord[] {
  return [
    { text: 'cat', meaning: '고양이' },
    { text: 'dog', meaning: '개' },
    { text: 'elephant', meaning: '코끼리' },
    { text: 'fish', meaning: '물고기' },
    { text: 'giraffe', meaning: '기린' },
    { text: 'horse', meaning: '말' },
    { text: 'iguana', meaning: '이구아나' },
    { text: 'jellyfish', meaning: '해파리' },
    { text: 'kangaroo', meaning: '캥거루' },
    { text: 'lion', meaning: '사자' },
  ];
}

/**
 * Create a mixed-mode exam word set (10 words)
 */
export function createMixedModeTestData(): TestWord[] {
  return [
    { text: 'red', meaning: '빨강색' },
    { text: 'blue', meaning: '파랑색' },
    { text: 'green', meaning: '초록색' },
    { text: 'yellow', meaning: '노랑색' },
    { text: 'purple', meaning: '보라색' },
    { text: 'orange', meaning: '주황색' },
    { text: 'pink', meaning: '분홍색' },
    { text: 'black', meaning: '검은색' },
    { text: 'white', meaning: '흰색' },
    { text: 'gray', meaning: '회색' },
  ];
}

/**
 * Create a mobile viewport test word set
 */
export function createMobileTestData(): TestWord[] {
  return [
    { text: 'run', meaning: '뛰다' },
    { text: 'jump', meaning: '뛰어오르다' },
    { text: 'walk', meaning: '걷다' },
    { text: 'swim', meaning: '수영하다' },
    { text: 'dance', meaning: '춤을 추다' },
    { text: 'sing', meaning: '노래하다' },
    { text: 'read', meaning: '읽다' },
    { text: 'write', meaning: '쓰다' },
    { text: 'listen', meaning: '듣다' },
    { text: 'speak', meaning: '말하다' },
  ];
}
