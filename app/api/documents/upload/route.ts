import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  console.log("Upload API called");

  try {
    const formData = await request.formData();
    console.log("FormData received");

    const file = formData.get("file") as File | null;

    // Validate file exists
    if (!file) {
      console.log("No file provided");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log("File received:", file.name, file.type, file.size);

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    // Read file content as base64 (for in-memory storage)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Content = buffer.toString("base64");

    // Generate unique filename
    const uniqueFilename = `${Date.now()}-${file.name}`;
    const filepath = `uploads/${uniqueFilename}`;

    // Store in database
    const document = db.documents.create(
      {
        filename: file.name,
        filepath,
        filesize: file.size,
      },
      base64Content
    );

    console.log("Document created:", document.id);

    return NextResponse.json({
      message: "File uploaded successfully",
      document,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
