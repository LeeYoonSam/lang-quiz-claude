import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const wordset = await prisma.wordSet.findUnique({
      where: { id },
      include: { words: true },
    });

    if (!wordset) {
      return NextResponse.json(
        { error: "Word set not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(wordset);
  } catch (error) {
    console.error("Error fetching wordset:", error);
    return NextResponse.json(
      { error: "Failed to fetch wordset" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    // Check if wordset exists
    const exists = await prisma.wordSet.findUnique({
      where: { id },
    });

    if (!exists) {
      return NextResponse.json(
        { error: "Word set not found" },
        { status: 404 }
      );
    }

    // Input validation
    if (body.name && body.name.length > 100) {
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

    // Update wordset
    const updated = await prisma.wordSet.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
      },
      include: { words: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating wordset:", error);
    return NextResponse.json(
      { error: "Failed to update wordset" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Check if wordset exists
    const exists = await prisma.wordSet.findUnique({
      where: { id },
    });

    if (!exists) {
      return NextResponse.json(
        { error: "Word set not found" },
        { status: 404 }
      );
    }

    // Delete wordset (words will cascade delete due to Prisma schema)
    await prisma.wordSet.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting wordset:", error);
    return NextResponse.json(
      { error: "Failed to delete wordset" },
      { status: 500 }
    );
  }
}
