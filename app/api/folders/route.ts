import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// @API-POST-FOLDERS
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

    // Create folder
    const folder = await prisma.folder.create({
      data: {
        name: body.name,
        description: body.description || null,
      },
      include: {
        _count: {
          select: { wordSets: true },
        },
      },
    });

    return NextResponse.json(folder, { status: 201 });
  } catch (error) {
    console.error("Error creating folder:", error);
    return NextResponse.json(
      { error: "Failed to create folder" },
      { status: 500 }
    );
  }
}

// @API-GET-FOLDERS
export async function GET() {
  try {
    const folders = await prisma.folder.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { wordSets: true },
        },
      },
    });

    return NextResponse.json(folders);
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json(
      { error: "Failed to fetch folders" },
      { status: 500 }
    );
  }
}
