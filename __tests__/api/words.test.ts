import { prisma } from "@/lib/prisma";

let testWordsetId: string;

describe("Word Prisma Operations (FR-6 to FR-8)", () => {
  beforeEach(async () => {
    // Clear database
    await prisma.word.deleteMany({});
    await prisma.wordSet.deleteMany({});

    // Create test wordset
    const wordset = await prisma.wordSet.create({
      data: { name: "Test Set" },
    });
    testWordsetId = wordset.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("FR-6: 단어 추가", () => {
    it("should create a new word in a wordset", async () => {
      const word = await prisma.word.create({
        data: {
          text: "apple",
          meaning: "사과",
          wordSetId: testWordsetId,
        },
      });

      expect(word).toHaveProperty("id");
      expect(word.text).toBe("apple");
      expect(word.meaning).toBe("사과");
      expect(word.wordSetId).toBe(testWordsetId);
    });

    it("should create multiple words in the same wordset", async () => {
      const word1 = await prisma.word.create({
        data: {
          text: "apple",
          meaning: "사과",
          wordSetId: testWordsetId,
        },
      });

      const word2 = await prisma.word.create({
        data: {
          text: "banana",
          meaning: "바나나",
          wordSetId: testWordsetId,
        },
      });

      const words = await prisma.word.findMany({
        where: { wordSetId: testWordsetId },
      });

      expect(words).toHaveLength(2);
      expect(words.map((w) => w.text)).toEqual(["apple", "banana"]);
    });

    it("should maintain timestamps for word creation", async () => {
      const word = await prisma.word.create({
        data: {
          text: "apple",
          meaning: "사과",
          wordSetId: testWordsetId,
        },
      });

      expect(word.createdAt).toBeInstanceOf(Date);
      expect(word.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe("FR-7: 단어 수정", () => {
    it("should update word text and meaning", async () => {
      const created = await prisma.word.create({
        data: {
          text: "apple",
          meaning: "사과",
          wordSetId: testWordsetId,
        },
      });

      // Wait a bit to ensure timestamp changes
      await new Promise((resolve) => setTimeout(resolve, 10));

      const updated = await prisma.word.update({
        where: { id: created.id },
        data: {
          text: "apple",
          meaning: "사과 (빨간색 과일)",
        },
      });

      expect(updated.text).toBe("apple");
      expect(updated.meaning).toBe("사과 (빨간색 과일)");
      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(
        created.updatedAt.getTime()
      );
    });

    it("should update only the meaning field", async () => {
      const created = await prisma.word.create({
        data: {
          text: "banana",
          meaning: "바나나",
          wordSetId: testWordsetId,
        },
      });

      const updated = await prisma.word.update({
        where: { id: created.id },
        data: {
          meaning: "황색 과일",
        },
      });

      expect(updated.text).toBe("banana");
      expect(updated.meaning).toBe("황색 과일");
    });

    it("should return null for non-existent word", async () => {
      const word = await prisma.word.findUnique({
        where: { id: "nonexistent" },
      });
      expect(word).toBeNull();
    });
  });

  describe("FR-8: 단어 삭제", () => {
    it("should delete a word from wordset", async () => {
      const word = await prisma.word.create({
        data: {
          text: "apple",
          meaning: "사과",
          wordSetId: testWordsetId,
        },
      });

      // Delete the word
      await prisma.word.delete({
        where: { id: word.id },
      });

      // Verify word is deleted
      const deleted = await prisma.word.findUnique({
        where: { id: word.id },
      });
      expect(deleted).toBeNull();
    });

    it("should delete only the specified word", async () => {
      const word1 = await prisma.word.create({
        data: {
          text: "apple",
          meaning: "사과",
          wordSetId: testWordsetId,
        },
      });

      const word2 = await prisma.word.create({
        data: {
          text: "banana",
          meaning: "바나나",
          wordSetId: testWordsetId,
        },
      });

      // Delete first word
      await prisma.word.delete({
        where: { id: word1.id },
      });

      // Verify only first word is deleted
      const remaining = await prisma.word.findMany({
        where: { wordSetId: testWordsetId },
      });

      expect(remaining).toHaveLength(1);
      expect(remaining[0].text).toBe("banana");
    });

    it("should not affect other wordsets when deleting a word", async () => {
      // Create another wordset
      const wordset2 = await prisma.wordSet.create({
        data: { name: "Set 2" },
      });

      const word1 = await prisma.word.create({
        data: {
          text: "apple",
          meaning: "사과",
          wordSetId: testWordsetId,
        },
      });

      await prisma.word.create({
        data: {
          text: "orange",
          meaning: "오렌지",
          wordSetId: wordset2.id,
        },
      });

      // Delete word from first set
      await prisma.word.delete({
        where: { id: word1.id },
      });

      // Verify second wordset's word still exists
      const words2 = await prisma.word.findMany({
        where: { wordSetId: wordset2.id },
      });

      expect(words2).toHaveLength(1);
      expect(words2[0].text).toBe("orange");
    });
  });

  describe("Wordset and Word Relationship", () => {
    it("should retrieve all words for a wordset", async () => {
      await prisma.word.create({
        data: {
          text: "apple",
          meaning: "사과",
          wordSetId: testWordsetId,
        },
      });

      await prisma.word.create({
        data: {
          text: "banana",
          meaning: "바나나",
          wordSetId: testWordsetId,
        },
      });

      const wordset = await prisma.wordSet.findUnique({
        where: { id: testWordsetId },
        include: { words: true },
      });

      expect(wordset?.words).toHaveLength(2);
    });
  });
});
