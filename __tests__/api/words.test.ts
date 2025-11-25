import { prisma } from "@/lib/prisma";

describe("Word API Endpoints", () => {
  let wordsetId: string;

  beforeEach(async () => {
    // Clear database
    await prisma.word.deleteMany({});
    await prisma.wordSet.deleteMany({});

    // Create test wordset
    const wordset = await prisma.wordSet.create({
      data: { name: "Test Set" },
    });
    wordsetId = wordset.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /api/wordsets/[id]/words", () => {
    it("should create a new word", async () => {
      const response = await fetch(
        `http://localhost:3000/api/wordsets/${wordsetId}/words`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: "apple",
            meaning: "사과",
          }),
        }
      );

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data).toHaveProperty("id");
      expect(data.text).toBe("apple");
      expect(data.meaning).toBe("사과");
      expect(data.wordSetId).toBe(wordsetId);
    });

    it("should return 400 when word text is missing", async () => {
      const response = await fetch(
        `http://localhost:3000/api/wordsets/${wordsetId}/words`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ meaning: "사과" }),
        }
      );

      expect(response.status).toBe(400);
    });

    it("should return 400 when meaning is missing", async () => {
      const response = await fetch(
        `http://localhost:3000/api/wordsets/${wordsetId}/words`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: "apple" }),
        }
      );

      expect(response.status).toBe(400);
    });

    it("should return 400 when text exceeds 100 characters", async () => {
      const longText = "a".repeat(101);
      const response = await fetch(
        `http://localhost:3000/api/wordsets/${wordsetId}/words`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: longText,
            meaning: "사과",
          }),
        }
      );

      expect(response.status).toBe(400);
    });

    it("should return 404 when wordset doesn't exist", async () => {
      const response = await fetch(
        "http://localhost:3000/api/wordsets/nonexistent/words",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: "apple",
            meaning: "사과",
          }),
        }
      );

      expect(response.status).toBe(404);
    });
  });

  describe("PUT /api/words/[id]", () => {
    it("should update a word", async () => {
      const word = await prisma.word.create({
        data: {
          text: "apple",
          meaning: "사과",
          wordSetId: wordsetId,
        },
      });

      const response = await fetch(
        `http://localhost:3000/api/words/${word.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: "apple",
            meaning: "사과 (빨간색 과일)",
          }),
        }
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.text).toBe("apple");
      expect(data.meaning).toBe("사과 (빨간색 과일)");
    });

    it("should return 404 for non-existent word", async () => {
      const response = await fetch(
        "http://localhost:3000/api/words/nonexistent",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: "apple",
            meaning: "사과",
          }),
        }
      );

      expect(response.status).toBe(404);
    });

    it("should return 400 when text exceeds 100 characters", async () => {
      const word = await prisma.word.create({
        data: {
          text: "apple",
          meaning: "사과",
          wordSetId: wordsetId,
        },
      });

      const longText = "a".repeat(101);
      const response = await fetch(
        `http://localhost:3000/api/words/${word.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: longText,
            meaning: "사과",
          }),
        }
      );

      expect(response.status).toBe(400);
    });
  });

  describe("DELETE /api/words/[id]", () => {
    it("should delete a word", async () => {
      const word = await prisma.word.create({
        data: {
          text: "apple",
          meaning: "사과",
          wordSetId: wordsetId,
        },
      });

      const response = await fetch(
        `http://localhost:3000/api/words/${word.id}`,
        { method: "DELETE" }
      );

      expect(response.status).toBe(204);

      // Verify word is deleted
      const deleted = await prisma.word.findUnique({
        where: { id: word.id },
      });
      expect(deleted).toBeNull();
    });

    it("should return 404 for non-existent word", async () => {
      const response = await fetch(
        "http://localhost:3000/api/words/nonexistent",
        { method: "DELETE" }
      );

      expect(response.status).toBe(404);
    });
  });
});
