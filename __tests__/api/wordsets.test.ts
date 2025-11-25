import { prisma } from "@/lib/prisma";

describe("WordSet API Endpoints", () => {
  beforeEach(async () => {
    // Clear database before each test
    await prisma.word.deleteMany({});
    await prisma.wordSet.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /api/wordsets", () => {
    it("should create a new word set with valid input", async () => {
      const response = await fetch("http://localhost:3000/api/wordsets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "TOEFL Words",
          description: "Essential TOEFL vocabulary",
        }),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data).toHaveProperty("id");
      expect(data.name).toBe("TOEFL Words");
      expect(data.description).toBe("Essential TOEFL vocabulary");
      expect(data.words).toEqual([]);
    });

    it("should return 400 when name is missing", async () => {
      const response = await fetch("http://localhost:3000/api/wordsets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: "No name" }),
      });

      expect(response.status).toBe(400);
    });

    it("should return 400 when name exceeds 100 characters", async () => {
      const longName = "a".repeat(101);
      const response = await fetch("http://localhost:3000/api/wordsets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: longName }),
      });

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/wordsets", () => {
    it("should return empty array when no wordsets exist", async () => {
      const response = await fetch("http://localhost:3000/api/wordsets");

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual([]);
    });

    it("should return wordsets with wordCount", async () => {
      // Create a wordset with words
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
      });

      const response = await fetch("http://localhost:3000/api/wordsets");
      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data).toHaveLength(1);
      expect(data[0]).toHaveProperty("wordCount");
      expect(data[0].wordCount).toBe(2);
      expect(data[0].name).toBe("Test Set");
    });

    it("should return wordsets sorted by createdAt descending", async () => {
      await prisma.wordSet.create({
        data: { name: "First Set" },
      });
      await new Promise((resolve) => setTimeout(resolve, 100));
      await prisma.wordSet.create({
        data: { name: "Second Set" },
      });

      const response = await fetch("http://localhost:3000/api/wordsets");
      const data = await response.json();

      expect(data[0].name).toBe("Second Set");
      expect(data[1].name).toBe("First Set");
    });
  });

  describe("GET /api/wordsets/[id]", () => {
    it("should return a wordset with its words", async () => {
      const wordset = await prisma.wordSet.create({
        data: {
          name: "Test Set",
          description: "Test Description",
          words: {
            create: [{ text: "apple", meaning: "사과" }],
          },
        },
      });

      const response = await fetch(
        `http://localhost:3000/api/wordsets/${wordset.id}`
      );
      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data.id).toBe(wordset.id);
      expect(data.name).toBe("Test Set");
      expect(data.words).toHaveLength(1);
      expect(data.words[0].text).toBe("apple");
    });

    it("should return 404 for non-existent wordset", async () => {
      const response = await fetch(
        "http://localhost:3000/api/wordsets/nonexistent"
      );
      expect(response.status).toBe(404);
    });
  });

  describe("PUT /api/wordsets/[id]", () => {
    it("should update wordset name and description", async () => {
      const wordset = await prisma.wordSet.create({
        data: { name: "Original Name", description: "Original Description" },
      });

      const response = await fetch(
        `http://localhost:3000/api/wordsets/${wordset.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Updated Name",
            description: "Updated Description",
          }),
        }
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.name).toBe("Updated Name");
      expect(data.description).toBe("Updated Description");
    });

    it("should return 404 for non-existent wordset", async () => {
      const response = await fetch(
        "http://localhost:3000/api/wordsets/nonexistent",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "Updated" }),
        }
      );
      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /api/wordsets/[id]", () => {
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

      const response = await fetch(
        `http://localhost:3000/api/wordsets/${wordset.id}`,
        { method: "DELETE" }
      );

      expect(response.status).toBe(204);

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

    it("should return 404 for non-existent wordset", async () => {
      const response = await fetch(
        "http://localhost:3000/api/wordsets/nonexistent",
        { method: "DELETE" }
      );
      expect(response.status).toBe(404);
    });
  });
});
