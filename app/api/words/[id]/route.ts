import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    // Check if word exists
    const exists = await prisma.word.findUnique({
      where: { id },
    });

    if (!exists) {
      return NextResponse.json(
        { error: "Word not found" },
        { status: 404 }
      );
    }

    // Input validation
    if (body.text && body.text.length > 100) {
      return NextResponse.json(
        { error: "Word must be less than 100 characters" },
        { status: 400 }
      );
    }

    if (body.meaning && body.meaning.length > 500) {
      return NextResponse.json(
        { error: "Meaning must be less than 500 characters" },
        { status: 400 }
      );
    }

    // Update word
    const updated = await prisma.word.update({
      where: { id },
      data: {
        text: body.text,
        meaning: body.meaning,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating word:", error);
    return NextResponse.json(
      { error: "Failed to update word" },
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

    // Check if word exists
    const exists = await prisma.word.findUnique({
      where: { id },
    });

    if (!exists) {
      return NextResponse.json(
        { error: "Word not found" },
        { status: 404 }
      );
    }

    // Delete word
    await prisma.word.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting word:", error);
    return NextResponse.json(
      { error: "Failed to delete word" },
      { status: 500 }
    );
  }
}
