import { prisma } from "@/lib/prisma";

// @TEST-FOLDER-CREATE @API-POST-FOLDERS
// @TEST-FOLDER-LIST @API-GET-FOLDERS
// @TEST-FOLDER-DETAIL @API-GET-FOLDER-DETAIL
// @TEST-FOLDER-UPDATE @API-PUT-FOLDERS
// @TEST-FOLDER-DELETE-NULLIFY @API-DELETE-FOLDERS

describe("Folder CRUD Operations (FR-1 to FR-5)", () => {
  beforeEach(async () => {
    // Clear database before each test
    await prisma.word.deleteMany({});
    await prisma.wordSet.deleteMany({});
    await prisma.folder.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("FR-1: 폴더 생성", () => {
    it("should create a new folder with name and description", async () => {
      const folder = await prisma.folder.create({
        data: {
          name: "TOEFL 단어",
          description: "TOEFL 시험 대비를 위한 폴더",
        },
        include: {
          _count: {
            select: { wordSets: true },
          },
        },
      });

      expect(folder).toHaveProperty("id");
      expect(folder.name).toBe("TOEFL 단어");
      expect(folder.description).toBe("TOEFL 시험 대비를 위한 폴더");
      expect(folder.parentId).toBeNull();
      expect(folder._count.wordSets).toBe(0);
    });

    it("should create folder with only name (description optional)", async () => {
      const folder = await prisma.folder.create({
        data: {
          name: "기본 폴더",
        },
        include: {
          _count: {
            select: { wordSets: true },
          },
        },
      });

      expect(folder.name).toBe("기본 폴더");
      expect(folder.description).toBeNull();
      expect(folder._count.wordSets).toBe(0);
    });

    it("should generate id and timestamps", async () => {
      const folder = await prisma.folder.create({
        data: {
          name: "타임스탐프 테스트",
        },
      });

      expect(folder.id).toBeDefined();
      expect(folder.createdAt).toBeInstanceOf(Date);
      expect(folder.updatedAt).toBeInstanceOf(Date);
      expect(folder.createdAt).toEqual(folder.updatedAt);
    });
  });

  describe("FR-2: 폴더 목록 조회", () => {
    it("should return empty array when no folders exist", async () => {
      const folders = await prisma.folder.findMany();
      expect(folders).toEqual([]);
    });

    it("should return folders ordered by createdAt descending", async () => {
      await prisma.folder.create({
        data: { name: "First Folder" },
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      await prisma.folder.create({
        data: { name: "Second Folder" },
      });

      const folders = await prisma.folder.findMany({
        orderBy: { createdAt: "desc" },
      });

      expect(folders).toHaveLength(2);
      expect(folders[0].name).toBe("Second Folder");
      expect(folders[1].name).toBe("First Folder");
    });

    it("should return folders with wordset count", async () => {
      const folder = await prisma.folder.create({
        data: {
          name: "폴더 통계 테스트",
          wordSets: {
            create: [
              { name: "세트 1" },
              { name: "세트 2" },
              { name: "세트 3" },
            ],
          },
        },
      });

      const folders = await prisma.folder.findMany({
        include: {
          _count: {
            select: { wordSets: true },
          },
        },
      });

      expect(folders).toHaveLength(1);
      expect(folders[0]._count.wordSets).toBe(3);
    });
  });

  describe("FR-3: 폴더 상세 조회", () => {
    it("should return a folder with its wordsets", async () => {
      const created = await prisma.folder.create({
        data: {
          name: "상세 조회 테스트",
          description: "Test Description",
          wordSets: {
            create: [{ name: "세트 1" }],
          },
        },
      });

      const folder = await prisma.folder.findUnique({
        where: { id: created.id },
        include: {
          wordSets: true,
          _count: {
            select: { wordSets: true },
          },
        },
      });

      expect(folder).not.toBeNull();
      expect(folder!.id).toBe(created.id);
      expect(folder!.name).toBe("상세 조회 테스트");
      expect(folder!.wordSets).toHaveLength(1);
      expect(folder!._count.wordSets).toBe(1);
    });

    it("should return null for non-existent folder", async () => {
      const folder = await prisma.folder.findUnique({
        where: { id: "nonexistent" },
      });
      expect(folder).toBeNull();
    });
  });

  describe("FR-4: 폴더 수정", () => {
    it("should update folder name and description", async () => {
      const original = await prisma.folder.create({
        data: {
          name: "원본 이름",
          description: "원본 설명",
        },
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      const updated = await prisma.folder.update({
        where: { id: original.id },
        data: {
          name: "수정된 이름",
          description: "수정된 설명",
        },
      });

      expect(updated.name).toBe("수정된 이름");
      expect(updated.description).toBe("수정된 설명");
      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(
        original.updatedAt.getTime()
      );
    });

    it("should update only the name field", async () => {
      const original = await prisma.folder.create({
        data: {
          name: "원본 이름",
          description: "원본 설명",
        },
      });

      const updated = await prisma.folder.update({
        where: { id: original.id },
        data: {
          name: "새 이름",
        },
      });

      expect(updated.name).toBe("새 이름");
      expect(updated.description).toBe("원본 설명");
    });
  });

  describe("FR-5: 폴더 삭제 (Nullify 정책)", () => {
    it("should delete folder and nullify wordsets", async () => {
      const folder = await prisma.folder.create({
        data: {
          name: "삭제 테스트 폴더",
          wordSets: {
            create: [
              { name: "세트 1" },
              { name: "세트 2" },
              { name: "세트 3" },
            ],
          },
        },
      });

      // Get wordset IDs before deletion
      const wordsetsBefore = await prisma.wordSet.findMany({
        where: { folderId: folder.id },
      });
      expect(wordsetsBefore).toHaveLength(3);

      // Delete the folder
      await prisma.folder.delete({
        where: { id: folder.id },
      });

      // Verify folder is deleted
      const deletedFolder = await prisma.folder.findUnique({
        where: { id: folder.id },
      });
      expect(deletedFolder).toBeNull();

      // Verify wordsets have folderId set to null
      const wordsetsAfter = await prisma.wordSet.findMany({
        where: { id: { in: wordsetsBefore.map((ws) => ws.id) } },
      });
      expect(wordsetsAfter).toHaveLength(3);
      wordsetsAfter.forEach((ws) => {
        expect(ws.folderId).toBeNull();
      });
    });

    it("should handle deleting folder with no wordsets", async () => {
      const folder = await prisma.folder.create({
        data: {
          name: "빈 폴더",
        },
      });

      const deleted = await prisma.folder.delete({
        where: { id: folder.id },
      });

      expect(deleted.id).toBe(folder.id);
    });

    it("should preserve words when nullifying wordsets", async () => {
      const folder = await prisma.folder.create({
        data: {
          name: "단어 보존 테스트",
          wordSets: {
            create: [
              {
                name: "세트 1",
                words: {
                  create: [
                    { text: "apple", meaning: "사과" },
                    { text: "banana", meaning: "바나나" },
                  ],
                },
              },
            ],
          },
        },
      });

      const wordsetId = await prisma.wordSet.findFirst({
        where: { folderId: folder.id },
        select: { id: true },
      });

      // Delete folder
      await prisma.folder.delete({
        where: { id: folder.id },
      });

      // Verify words are preserved
      const words = await prisma.word.findMany({
        where: { wordSetId: wordsetId!.id },
      });
      expect(words).toHaveLength(2);
      expect(words[0].text).toBe("apple");
      expect(words[1].text).toBe("banana");
    });
  });
});
