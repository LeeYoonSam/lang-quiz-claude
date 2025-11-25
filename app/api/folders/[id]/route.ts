import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// @API-GET-FOLDER-DETAIL
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const folder = await prisma.folder.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { wordSets: true },
        },
      },
    });

    if (!folder) {
      return NextResponse.json(
        { error: "Folder not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(folder);
  } catch (error) {
    console.error("Error fetching folder:", error);
    return NextResponse.json(
      { error: "Failed to fetch folder" },
      { status: 500 }
    );
  }
}

// @API-PUT-FOLDERS
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Input validation
    if (body.name !== undefined) {
      if (typeof body.name !== "string") {
        return NextResponse.json(
          { error: "Name must be a string" },
          { status: 400 }
        );
      }
      if (body.name.length > 100) {
        return NextResponse.json(
          { error: "Name must be less than 100 characters" },
          { status: 400 }
        );
      }
    }

    if (body.description !== undefined && body.description !== null) {
      if (typeof body.description !== "string") {
        return NextResponse.json(
          { error: "Description must be a string" },
          { status: 400 }
        );
      }
      if (body.description.length > 500) {
        return NextResponse.json(
          { error: "Description must be less than 500 characters" },
          { status: 400 }
        );
      }
    }

    // Check if folder exists
    const existingFolder = await prisma.folder.findUnique({
      where: { id: params.id },
    });

    if (!existingFolder) {
      return NextResponse.json(
        { error: "Folder not found" },
        { status: 404 }
      );
    }

    // Update folder
    const updatedFolder = await prisma.folder.update({
      where: { id: params.id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
      },
      include: {
        _count: {
          select: { wordSets: true },
        },
      },
    });

    return NextResponse.json(updatedFolder);
  } catch (error) {
    console.error("Error updating folder:", error);
    return NextResponse.json(
      { error: "Failed to update folder" },
      { status: 500 }
    );
  }
}

// @API-DELETE-FOLDERS @TEST-FOLDER-DELETE-NULLIFY
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if folder exists and get wordset count
    const folder = await prisma.folder.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { wordSets: true },
        },
      },
    });

    if (!folder) {
      return NextResponse.json(
        { error: "Folder not found" },
        { status: 404 }
      );
    }

    // Delete the folder (onDelete: SetNull will nullify wordsets)
    await prisma.folder.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "폴더가 삭제되었습니다.",
      movedWordSets: folder._count.wordSets,
    });
  } catch (error) {
    console.error("Error deleting folder:", error);
    return NextResponse.json(
      { error: "Failed to delete folder" },
      { status: 500 }
    );
  }
}
