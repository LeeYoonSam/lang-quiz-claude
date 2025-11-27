import { fisherYatesShuffle } from '../shuffle';

describe('Fisher-Yates Shuffle', () => {
  const mockWords = [
    { id: '1', text: 'apple', meaning: '사과' },
    { id: '2', text: 'banana', meaning: '바나나' },
    { id: '3', text: 'cherry', meaning: '체리' },
    { id: '4', text: 'date', meaning: '대추' },
    { id: '5', text: 'elderberry', meaning: '엘더베리' },
  ];

  it('should return an array of the same length', () => {
    const shuffled = fisherYatesShuffle(mockWords);
    expect(shuffled).toHaveLength(mockWords.length);
  });

  it('should contain all elements from original array', () => {
    const shuffled = fisherYatesShuffle(mockWords);

    mockWords.forEach((word) => {
      expect(shuffled).toContainEqual(word);
    });
  });

  it('should not modify original array', () => {
    const original = [...mockWords];
    fisherYatesShuffle(mockWords);

    expect(mockWords).toEqual(original);
  });

  it('should work with empty array', () => {
    const shuffled = fisherYatesShuffle([]);
    expect(shuffled).toEqual([]);
  });

  it('should work with single element', () => {
    const single = [{ id: '1', text: 'apple', meaning: '사과' }];
    const shuffled = fisherYatesShuffle(single);

    expect(shuffled).toHaveLength(1);
    expect(shuffled[0]).toEqual(single[0]);
  });

  it('should return different permutations on multiple runs (probabilistic)', () => {
    const runs: string[][] = [];

    // Run multiple times to check for variation
    for (let i = 0; i < 10; i++) {
      const shuffled = fisherYatesShuffle(mockWords);
      runs.push(shuffled.map((w) => w.id));
    }

    // Check if we got at least 2 different orderings (very high probability)
    const uniqueOrders = new Set(runs.map((r) => r.join(',')));
    expect(uniqueOrders.size).toBeGreaterThan(1);
  });

  it('should properly shuffle larger arrays', () => {
    const largeArray = Array.from({ length: 100 }, (_, i) => ({
      id: String(i),
      text: `word${i}`,
      meaning: `meaning${i}`,
    }));

    const shuffled = fisherYatesShuffle(largeArray);

    // Check all elements are present
    expect(shuffled).toHaveLength(100);

    largeArray.forEach((item) => {
      expect(shuffled.some((s) => s.id === item.id)).toBe(true);
    });
  });
});
