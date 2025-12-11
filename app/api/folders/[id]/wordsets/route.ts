import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// @API-GET-FOLDERS-WORDSETS
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Check if folder exists
    const folder = await prisma.folder.findUnique({
      where: { id },
    });

    if (!folder) {
      return NextResponse.json(
        { error: "Folder not found" },
        { status: 404 }
      );
    }

    // Get wordsets for the folder
    const wordsets = await prisma.wordSet.findMany({
      where: { folderId: id },
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
    console.error("Error fetching wordsets for folder:", error);
    return NextResponse.json(
      { error: "Failed to fetch wordsets" },
      { status: 500 }
    );
  }
}
