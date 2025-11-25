import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    // Check if wordset exists
    const wordset = await prisma.wordSet.findUnique({
      where: { id },
    });

    if (!wordset) {
      return NextResponse.json(
        { error: "Word set not found" },
        { status: 404 }
      );
    }

    // Input validation
    if (!body.text || typeof body.text !== "string") {
      return NextResponse.json(
        { error: "Word text is required" },
        { status: 400 }
      );
    }

    if (!body.meaning || typeof body.meaning !== "string") {
      return NextResponse.json(
        { error: "Meaning is required" },
        { status: 400 }
      );
    }

    if (body.text.length > 100) {
      return NextResponse.json(
        { error: "Word must be less than 100 characters" },
        { status: 400 }
      );
    }

    if (body.meaning.length > 500) {
      return NextResponse.json(
        { error: "Meaning must be less than 500 characters" },
        { status: 400 }
      );
    }

    // Create word
    const word = await prisma.word.create({
      data: {
        text: body.text,
        meaning: body.meaning,
        wordSetId: id,
      },
    });

    return NextResponse.json(word, { status: 201 });
  } catch (error) {
    console.error("Error creating word:", error);
    return NextResponse.json(
      { error: "Failed to create word" },
      { status: 500 }
    );
  }
}
