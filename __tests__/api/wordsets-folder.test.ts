import { prisma } from "@/lib/prisma";

// @TEST-WORDSET-FOLDER-ASSIGN
// @TEST-WORDSET-FOLDER-REMOVE

describe("WordSet-Folder Operations (FR-6, FR-7, FR-8, FR-9)", () => {
  beforeEach(async () => {
    // Clear database before each test
    await prisma.word.deleteMany({});
    await prisma.wordSet.deleteMany({});
    await prisma.folder.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("FR-6: 단어 세트에 폴더 할당", () => {
    it("should assign wordset to folder", async () => {
      const folder = await prisma.folder.create({
        data: { name: "TOEFL 단어" },
      });

      const wordset = await prisma.wordSet.create({
        data: {
          name: "Reading 단어",
          folderId: folder.id,
        },
        include: {
          folder: {
            select: { id: true, name: true },
          },
          _count: {
            select: { words: true },
          },
        },
      });

      expect(wordset.folderId).toBe(folder.id);
      expect(wordset.folder).not.toBeNull();
      expect(wordset.folder!.name).toBe("TOEFL 단어");

      // Verify folder wordset count increased
      const updatedFolder = await prisma.folder.findUnique({
        where: { id: folder.id },
        include: {
          _count: {
            select: { wordSets: true },
          },
        },
      });

      expect(updatedFolder!._count.wordSets).toBe(1);
    });

    it("should create wordset in root when folderId is null", async () => {
      const wordset = await prisma.wordSet.create({
        data: {
          name: "Root Wordset",
          folderId: null,
        },
      });

      expect(wordset.folderId).toBeNull();
    });
  });

  describe("FR-7: 단어 세트에서 폴더 제거", () => {
    it("should move wordset from folder to root", async () => {
      const folder = await prisma.folder.create({
        data: { name: "TOEFL 단어" },
      });

      const wordset = await prisma.wordSet.create({
        data: {
          name: "Reading 단어",
          folderId: folder.id,
        },
      });

      // Verify initial state
      const beforeUpdate = await prisma.wordSet.findUnique({
        where: { id: wordset.id },
      });
      expect(beforeUpdate!.folderId).toBe(folder.id);

      // Move to root
      const updated = await prisma.wordSet.update({
        where: { id: wordset.id },
        data: { folderId: null },
        include: {
          folder: {
            select: { id: true, name: true },
          },
        },
      });

      expect(updated.folderId).toBeNull();
      expect(updated.folder).toBeNull();

      // Verify folder wordset count decreased
      const updatedFolder = await prisma.folder.findUnique({
        where: { id: folder.id },
        include: {
          _count: {
            select: { wordSets: true },
          },
        },
      });

      expect(updatedFolder!._count.wordSets).toBe(0);
    });
  });

  describe("FR-8: 폴더별 단어 세트 필터링", () => {
    it("should filter wordsets by folder", async () => {
      const toeflFolder = await prisma.folder.create({
        data: { name: "TOEFL 단어" },
      });
      const businessFolder = await prisma.folder.create({
        data: { name: "비즈니스 영어" },
      });

      // Create TOEFL wordsets
      await prisma.wordSet.create({
        data: { name: "TOEFL Set 1", folderId: toeflFolder.id },
      });
      await prisma.wordSet.create({
        data: { name: "TOEFL Set 2", folderId: toeflFolder.id },
      });
      await prisma.wordSet.create({
        data: { name: "TOEFL Set 3", folderId: toeflFolder.id },
      });

      // Create business wordsets
      await prisma.wordSet.create({
        data: { name: "Business Set 1", folderId: businessFolder.id },
      });
      await prisma.wordSet.create({
        data: { name: "Business Set 2", folderId: businessFolder.id },
      });

      // Create root wordsets
      await prisma.wordSet.create({
        data: { name: "Root Set 1", folderId: null },
      });
      await prisma.wordSet.create({
        data: { name: "Root Set 2", folderId: null },
      });

      // Test TOEFL folder filter
      const toeflSets = await prisma.wordSet.findMany({
        where: { folderId: toeflFolder.id },
      });

      expect(toeflSets).toHaveLength(3);
      toeflSets.forEach((set) => {
        expect(set.folderId).toBe(toeflFolder.id);
      });

      // Test business folder filter
      const businessSets = await prisma.wordSet.findMany({
        where: { folderId: businessFolder.id },
      });

      expect(businessSets).toHaveLength(2);
      businessSets.forEach((set) => {
        expect(set.folderId).toBe(businessFolder.id);
      });

      // Test root filter
      const rootSets = await prisma.wordSet.findMany({
        where: { folderId: null },
      });

      expect(rootSets).toHaveLength(2);
      rootSets.forEach((set) => {
        expect(set.folderId).toBeNull();
      });
    });
  });

  describe("FR-9: 폴더 통계 표시", () => {
    it("should calculate correct wordset count per folder", async () => {
      const folder1 = await prisma.folder.create({
        data: { name: "Folder 1" },
      });
      const folder2 = await prisma.folder.create({
        data: { name: "Folder 2" },
      });

      // Create wordsets
      await Promise.all([
        prisma.wordSet.create({
          data: { name: "Set 1", folderId: folder1.id },
        }),
        prisma.wordSet.create({
          data: { name: "Set 2", folderId: folder1.id },
        }),
        prisma.wordSet.create({
          data: { name: "Set 3", folderId: folder2.id },
        }),
        prisma.wordSet.create({
          data: { name: "Set 4", folderId: folder2.id },
        }),
        prisma.wordSet.create({
          data: { name: "Set 5", folderId: folder2.id },
        }),
      ]);

      // Fetch folders with counts
      const folders = await prisma.folder.findMany({
        include: {
          _count: {
            select: { wordSets: true },
          },
        },
        orderBy: { createdAt: "asc" },
      });

      expect(folders).toHaveLength(2);
      expect(folders[0]._count.wordSets).toBe(2);
      expect(folders[1]._count.wordSets).toBe(3);
    });

    it("should update count when adding wordset to folder", async () => {
      const folder = await prisma.folder.create({
        data: { name: "Test Folder" },
      });

      const beforeAdd = await prisma.folder.findUnique({
        where: { id: folder.id },
        include: {
          _count: {
            select: { wordSets: true },
          },
        },
      });
      expect(beforeAdd!._count.wordSets).toBe(0);

      // Add wordsets
      await prisma.wordSet.create({
        data: { name: "Set 1", folderId: folder.id },
      });
      await prisma.wordSet.create({
        data: { name: "Set 2", folderId: folder.id },
      });

      const afterAdd = await prisma.folder.findUnique({
        where: { id: folder.id },
        include: {
          _count: {
            select: { wordSets: true },
          },
        },
      });
      expect(afterAdd!._count.wordSets).toBe(2);
    });

    it("should update count when removing wordset from folder", async () => {
      const folder = await prisma.folder.create({
        data: {
          name: "Test Folder",
          wordSets: {
            create: [
              { name: "Set 1" },
              { name: "Set 2" },
              { name: "Set 3" },
            ],
          },
        },
      });

      const beforeRemove = await prisma.folder.findUnique({
        where: { id: folder.id },
        include: {
          _count: {
            select: { wordSets: true },
          },
        },
      });
      expect(beforeRemove!._count.wordSets).toBe(3);

      // Remove one wordset
      const wordsetToMove = await prisma.wordSet.findFirst({
        where: { folderId: folder.id },
      });

      await prisma.wordSet.update({
        where: { id: wordsetToMove!.id },
        data: { folderId: null },
      });

      const afterRemove = await prisma.folder.findUnique({
        where: { id: folder.id },
        include: {
          _count: {
            select: { wordSets: true },
          },
        },
      });
      expect(afterRemove!._count.wordSets).toBe(2);
    });
  });

  describe("Backward Compatibility with SPEC-WORDSET-001", () => {
    it("should support wordsets without folder assignment", async () => {
      const wordset = await prisma.wordSet.create({
        data: {
          name: "Standalone Set",
          description: "No folder assigned",
          words: {
            create: [
              { text: "apple", meaning: "사과" },
              { text: "banana", meaning: "바나나" },
            ],
          },
        },
        include: {
          words: true,
        },
      });

      expect(wordset.folderId).toBeNull();
      expect(wordset.words).toHaveLength(2);
    });

    it("should allow updating wordsets without folder", async () => {
      const wordset = await prisma.wordSet.create({
        data: {
          name: "Original Name",
          description: "Original Description",
        },
      });

      const updated = await prisma.wordSet.update({
        where: { id: wordset.id },
        data: {
          name: "Updated Name",
          description: "Updated Description",
        },
      });

      expect(updated.folderId).toBeNull();
      expect(updated.name).toBe("Updated Name");
    });
  });
});
