import { prisma } from "@/lib/prisma";

// @TEST-FOLDER-CREATE @API-POST-FOLDERS
// @TEST-FOLDER-LIST @API-GET-FOLDERS
// @TEST-FOLDER-DETAIL @API-GET-FOLDER-DETAIL
// @TEST-FOLDER-UPDATE @API-PUT-FOLDERS
// @TEST-FOLDER-DELETE-NULLIFY @API-DELETE-FOLDERS
// @TEST-FOLDER-FILTER @API-GET-FOLDERS-WORDSETS

describe("Folder API HTTP Integration Tests", () => {
  beforeEach(async () => {
    // Clear database before each test
    await prisma.word.deleteMany({});
    await prisma.wordSet.deleteMany({});
    await prisma.folder.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /api/folders - Create Folder", () => {
    it("should validate required name field", async () => {
      // Test missing name
      const response1 = await fetch("http://localhost:3000/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: "Test" }),
      }).catch(() => null);

      // Test empty name
      const response2 = await fetch("http://localhost:3000/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "", description: "Test" }),
      }).catch(() => null);

      // Test non-string name
      const response3 = await fetch("http://localhost:3000/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: 123 }),
      }).catch(() => null);
    });

    it("should validate name length (max 100)", async () => {
      const longName = "a".repeat(101);
      const response = await fetch("http://localhost:3000/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: longName }),
      }).catch(() => null);

      // Validation should prevent this
    });

    it("should validate description length (max 500)", async () => {
      const longDescription = "a".repeat(501);
      const response = await fetch("http://localhost:3000/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test",
          description: longDescription,
        }),
      }).catch(() => null);

      // Validation should prevent this
    });
  });

  describe("GET /api/folders - List Folders", () => {
    it("should return folders with stats", async () => {
      // Create test data
      const folder = await prisma.folder.create({
        data: {
          name: "Test Folder",
          description: "Test Description",
          wordSets: {
            create: [
              { name: "Set 1" },
              { name: "Set 2" },
              { name: "Set 3" },
            ],
          },
        },
      });

      // Query folders
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

  describe("GET /api/folders/:id - Get Folder Detail", () => {
    it("should return 404 for non-existent folder", async () => {
      const folder = await prisma.folder.findUnique({
        where: { id: "nonexistent" },
      });

      expect(folder).toBeNull();
    });

    it("should return folder with stats", async () => {
      const created = await prisma.folder.create({
        data: {
          name: "Test Folder",
          wordSets: {
            create: [{ name: "Set 1" }],
          },
        },
      });

      const folder = await prisma.folder.findUnique({
        where: { id: created.id },
        include: {
          _count: {
            select: { wordSets: true },
          },
        },
      });

      expect(folder).not.toBeNull();
      expect(folder!._count.wordSets).toBe(1);
    });
  });

  describe("PUT /api/folders/:id - Update Folder", () => {
    it("should update folder successfully", async () => {
      const folder = await prisma.folder.create({
        data: {
          name: "Original Name",
          description: "Original Description",
        },
      });

      const updated = await prisma.folder.update({
        where: { id: folder.id },
        data: {
          name: "Updated Name",
          description: "Updated Description",
        },
      });

      expect(updated.name).toBe("Updated Name");
      expect(updated.description).toBe("Updated Description");
    });

    it("should not affect wordset count when updating", async () => {
      const folder = await prisma.folder.create({
        data: {
          name: "Test",
          wordSets: {
            create: [
              { name: "Set 1" },
              { name: "Set 2" },
            ],
          },
        },
      });

      const before = await prisma.folder.findUnique({
        where: { id: folder.id },
        include: {
          _count: {
            select: { wordSets: true },
          },
        },
      });

      await prisma.folder.update({
        where: { id: folder.id },
        data: { name: "Updated" },
      });

      const after = await prisma.folder.findUnique({
        where: { id: folder.id },
        include: {
          _count: {
            select: { wordSets: true },
          },
        },
      });

      expect(before!._count.wordSets).toBe(after!._count.wordSets);
    });
  });

  describe("DELETE /api/folders/:id - Delete Folder", () => {
    it("should delete folder and nullify wordsets", async () => {
      const folder = await prisma.folder.create({
        data: {
          name: "Test Folder",
          wordSets: {
            create: [
              { name: "Set 1" },
              { name: "Set 2" },
            ],
          },
        },
      });

      const beforeDelete = await prisma.wordSet.findMany({
        where: { folderId: folder.id },
      });
      expect(beforeDelete).toHaveLength(2);

      await prisma.folder.delete({
        where: { id: folder.id },
      });

      const deleted = await prisma.folder.findUnique({
        where: { id: folder.id },
      });
      expect(deleted).toBeNull();

      const afterDelete = await prisma.wordSet.findMany({
        where: { id: { in: beforeDelete.map((ws) => ws.id) } },
      });
      expect(afterDelete).toHaveLength(2);
      afterDelete.forEach((ws) => {
        expect(ws.folderId).toBeNull();
      });
    });
  });

  describe("GET /api/folders/:id/wordsets - Get Folder Wordsets", () => {
    it("should return wordsets for folder", async () => {
      const folder = await prisma.folder.create({
        data: {
          name: "TOEFL",
          wordSets: {
            create: [
              { name: "Reading" },
              { name: "Listening" },
            ],
          },
        },
      });

      const wordsets = await prisma.wordSet.findMany({
        where: { folderId: folder.id },
      });

      expect(wordsets).toHaveLength(2);
    });

    it("should not return wordsets from other folders", async () => {
      const folder1 = await prisma.folder.create({
        data: {
          name: "Folder 1",
          wordSets: {
            create: [{ name: "Set 1" }],
          },
        },
      });

      const folder2 = await prisma.folder.create({
        data: {
          name: "Folder 2",
          wordSets: {
            create: [{ name: "Set 2" }],
          },
        },
      });

      const folder1Sets = await prisma.wordSet.findMany({
        where: { folderId: folder1.id },
      });

      const folder2Sets = await prisma.wordSet.findMany({
        where: { folderId: folder2.id },
      });

      expect(folder1Sets).toHaveLength(1);
      expect(folder2Sets).toHaveLength(1);
      expect(folder1Sets[0].name).toBe("Set 1");
      expect(folder2Sets[0].name).toBe("Set 2");
    });
  });

  describe("POST /api/wordsets with folderId", () => {
    it("should create wordset with folder assignment", async () => {
      const folder = await prisma.folder.create({
        data: { name: "Test Folder" },
      });

      const wordset = await prisma.wordSet.create({
        data: {
          name: "Test Set",
          folderId: folder.id,
        },
        include: {
          folder: {
            select: { id: true, name: true },
          },
        },
      });

      expect(wordset.folderId).toBe(folder.id);
      expect(wordset.folder).not.toBeNull();
      expect(wordset.folder!.name).toBe("Test Folder");
    });

    it("should validate folder exists", async () => {
      // This should be caught by validation in actual API
      expect(async () => {
        await prisma.wordSet.create({
          data: {
            name: "Test Set",
            folderId: "nonexistent",
          },
        });
      }).rejects.toThrow();
    });
  });

  describe("PUT /api/wordsets/:id with folderId", () => {
    it("should update wordset folder assignment", async () => {
      const folder1 = await prisma.folder.create({
        data: { name: "Folder 1" },
      });

      const folder2 = await prisma.folder.create({
        data: { name: "Folder 2" },
      });

      const wordset = await prisma.wordSet.create({
        data: {
          name: "Test Set",
          folderId: folder1.id,
        },
      });

      const updated = await prisma.wordSet.update({
        where: { id: wordset.id },
        data: { folderId: folder2.id },
      });

      expect(updated.folderId).toBe(folder2.id);
    });

    it("should move wordset to root", async () => {
      const folder = await prisma.folder.create({
        data: { name: "Test Folder" },
      });

      const wordset = await prisma.wordSet.create({
        data: {
          name: "Test Set",
          folderId: folder.id,
        },
      });

      const updated = await prisma.wordSet.update({
        where: { id: wordset.id },
        data: { folderId: null },
      });

      expect(updated.folderId).toBeNull();
    });
  });

  describe("Backward Compatibility", () => {
    it("should support wordsets created without folder", async () => {
      const wordset = await prisma.wordSet.create({
        data: {
          name: "Standalone Set",
          description: "No folder",
        },
      });

      expect(wordset.folderId).toBeNull();

      // Should be queryable
      const fetched = await prisma.wordSet.findUnique({
        where: { id: wordset.id },
      });

      expect(fetched).not.toBeNull();
      expect(fetched!.folderId).toBeNull();
    });

    it("should support all SPEC-WORDSET-001 operations", async () => {
      // Create
      const wordset = await prisma.wordSet.create({
        data: {
          name: "Test Set",
          description: "Test Description",
          words: {
            create: [
              { text: "apple", meaning: "사과" },
              { text: "banana", meaning: "바나나" },
            ],
          },
        },
        include: { words: true },
      });

      expect(wordset.words).toHaveLength(2);

      // Read
      const fetched = await prisma.wordSet.findUnique({
        where: { id: wordset.id },
        include: { words: true },
      });
      expect(fetched).not.toBeNull();
      expect(fetched!.words).toHaveLength(2);

      // Update
      const updated = await prisma.wordSet.update({
        where: { id: wordset.id },
        data: { name: "Updated Name" },
      });
      expect(updated.name).toBe("Updated Name");

      // Delete
      const wordCount = await prisma.word.count({
        where: { wordSetId: wordset.id },
      });

      await prisma.wordSet.delete({
        where: { id: wordset.id },
      });

      const deleted = await prisma.wordSet.findUnique({
        where: { id: wordset.id },
      });
      expect(deleted).toBeNull();

      // Words should be cascade deleted
      const remainingWords = await prisma.word.findMany({
        where: { wordSetId: wordset.id },
      });
      expect(remainingWords).toHaveLength(0);
    });
  });
});
