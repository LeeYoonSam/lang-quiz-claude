import { prisma } from "@/lib/prisma";

describe("WordSet Prisma Operations (FR-1 to FR-5)", () => {
  beforeEach(async () => {
    // Clear database before each test
    await prisma.word.deleteMany({});
    await prisma.wordSet.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("FR-1: 단어 세트 생성", () => {
    it("should create a new word set with name and description", async () => {
      const wordset = await prisma.wordSet.create({
        data: {
          name: "TOEFL 필수 단어",
          description: "TOEFL 시험 대비 필수 단어 모음",
        },
        include: { words: true },
      });

      expect(wordset).toHaveProperty("id");
      expect(wordset.name).toBe("TOEFL 필수 단어");
      expect(wordset.description).toBe("TOEFL 시험 대비 필수 단어 모음");
      expect(wordset.words).toEqual([]);
      expect(wordset.folderId).toBeNull();
    });

    it("should create wordset with only name (description optional)", async () => {
      const wordset = await prisma.wordSet.create({
        data: {
          name: "기본 단어",
        },
        include: { words: true },
      });

      expect(wordset.name).toBe("기본 단어");
      expect(wordset.description).toBeNull();
      expect(wordset.words).toEqual([]);
    });
  });

  describe("FR-2: 단어 세트 목록 조회", () => {
    it("should return empty array when no wordsets exist", async () => {
      const wordsets = await prisma.wordSet.findMany();
      expect(wordsets).toEqual([]);
    });

    it("should return wordsets ordered by createdAt descending", async () => {
      await prisma.wordSet.create({
        data: { name: "First Set" },
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      await prisma.wordSet.create({
        data: { name: "Second Set" },
      });

      const wordsets = await prisma.wordSet.findMany({
        orderBy: { createdAt: "desc" },
      });

      expect(wordsets).toHaveLength(2);
      expect(wordsets[0].name).toBe("Second Set");
      expect(wordsets[1].name).toBe("First Set");
    });

    it("should return wordsets with word count", async () => {
      await prisma.wordSet.create({
        data: {
          name: "Test Set",
          words: {
            create: [
              { text: "apple", meaning: "사과" },
              { text: "banana", meaning: "바나나" },
            ],
          },
        },
      });

      const wordsets = await prisma.wordSet.findMany({
        include: {
          _count: {
            select: { words: true },
          },
        },
      });

      expect(wordsets).toHaveLength(1);
      expect(wordsets[0]._count.words).toBe(2);
    });
  });

  describe("FR-3: 단어 세트 상세 조회", () => {
    it("should return a wordset with its words", async () => {
      const created = await prisma.wordSet.create({
        data: {
          name: "Test Set",
          description: "Test Description",
          words: {
            create: [{ text: "apple", meaning: "사과" }],
          },
        },
      });

      const wordset = await prisma.wordSet.findUnique({
        where: { id: created.id },
        include: { words: true },
      });

      expect(wordset).not.toBeNull();
      expect(wordset!.id).toBe(created.id);
      expect(wordset!.name).toBe("Test Set");
      expect(wordset!.words).toHaveLength(1);
      expect(wordset!.words[0].text).toBe("apple");
    });

    it("should return null for non-existent wordset", async () => {
      const wordset = await prisma.wordSet.findUnique({
        where: { id: "nonexistent" },
      });
      expect(wordset).toBeNull();
    });
  });

  describe("FR-4: 단어 세트 수정", () => {
    it("should update wordset name and description", async () => {
      const original = await prisma.wordSet.create({
        data: {
          name: "Original Name",
          description: "Original Description",
        },
      });

      // Wait a bit to ensure timestamp changes
      await new Promise((resolve) => setTimeout(resolve, 10));

      const updated = await prisma.wordSet.update({
        where: { id: original.id },
        data: {
          name: "Updated Name",
          description: "Updated Description",
        },
      });

      expect(updated.name).toBe("Updated Name");
      expect(updated.description).toBe("Updated Description");
      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(
        original.updatedAt.getTime()
      );
    });

    it("should update only the name field", async () => {
      const original = await prisma.wordSet.create({
        data: {
          name: "Original Name",
          description: "Description",
        },
      });

      const updated = await prisma.wordSet.update({
        where: { id: original.id },
        data: {
          name: "New Name",
        },
      });

      expect(updated.name).toBe("New Name");
      expect(updated.description).toBe("Description");
    });
  });

  describe("FR-5: 단어 세트 삭제 (Cascade)", () => {
    it("should delete wordset and cascade delete words", async () => {
      const wordset = await prisma.wordSet.create({
        data: {
          name: "Test Set",
          words: {
            create: [
              { text: "apple", meaning: "사과" },
              { text: "banana", meaning: "바나나" },
            ],
          },
        },
      });

      // Delete the wordset
      await prisma.wordSet.delete({
        where: { id: wordset.id },
      });

      // Verify wordset is deleted
      const deletedSet = await prisma.wordSet.findUnique({
        where: { id: wordset.id },
      });
      expect(deletedSet).toBeNull();

      // Verify words are cascade deleted
      const words = await prisma.word.findMany({
        where: { wordSetId: wordset.id },
      });
      expect(words).toHaveLength(0);
    });

    it("should handle deleting wordset with no words", async () => {
      const wordset = await prisma.wordSet.create({
        data: {
          name: "Empty Set",
        },
      });

      // Should not throw error
      const deleted = await prisma.wordSet.delete({
        where: { id: wordset.id },
      });

      expect(deleted.id).toBe(wordset.id);
    });
  });
});
