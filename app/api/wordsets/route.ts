import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// @API-POST-WORDSETS (extended with folderId support)
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

    // Validate folderId if provided
    if (body.folderId) {
      const folder = await prisma.folder.findUnique({
        where: { id: body.folderId },
      });
      if (!folder) {
        return NextResponse.json(
          { error: "Folder not found" },
          { status: 400 }
        );
      }
    }

    // Create wordset
    const wordset = await prisma.wordSet.create({
      data: {
        name: body.name,
        description: body.description || null,
        folderId: body.folderId || null,
      },
      include: {
        words: true,
        folder: {
          select: {
            id: true,
            name: true,
          },
        },
      },
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

// @API-GET-WORDSETS (extended with folder info)
export async function GET() {
  try {
    const wordsets = await prisma.wordSet.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { words: true },
        },
        folder: {
          select: {
            id: true,
            name: true,
          },
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
