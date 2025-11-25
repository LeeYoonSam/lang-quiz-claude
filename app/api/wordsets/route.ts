import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Input validation
    if (!body.name || typeof body.name !== "string") {
      return NextResponse.json(
        { error: "Name is required and must be a string" },
        { status: 400 }
      );
    }

    if (body.name.length > 100) {
      return NextResponse.json(
        { error: "Name must be less than 100 characters" },
        { status: 400 }
      );
    }

    if (body.description && body.description.length > 500) {
      return NextResponse.json(
        { error: "Description must be less than 500 characters" },
        { status: 400 }
      );
    }

    // Create wordset
    const wordset = await prisma.wordSet.create({
      data: {
        name: body.name,
        description: body.description || null,
      },
      include: { words: true },
    });

    return NextResponse.json(wordset, { status: 201 });
  } catch (error) {
    console.error("Error creating wordset:", error);
    return NextResponse.json(
      { error: "Failed to create wordset" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const wordsets = await prisma.wordSet.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { words: true },
        },
      },
    });

    // Transform to include wordCount
    const result = wordsets.map((set) => ({
      ...set,
      wordCount: set._count.words,
      _count: undefined,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching wordsets:", error);
    return NextResponse.json(
      { error: "Failed to fetch wordsets" },
      { status: 500 }
    );
  }
}
