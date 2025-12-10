import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET - Download a specific document
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const document = db.documents.findById(id)
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    const fileContent = db.documents.getFileContent(id)
    if (!fileContent) {
      return NextResponse.json({ error: "File content not found" }, { status: 404 })
    }

    // Convert base64 back to buffer
    const buffer = Buffer.from(fileContent, "base64")

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${document.filename}"`,
        "Content-Length": buffer.length.toString(),
      },
    })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Failed to download file" }, { status: 500 })
  }
}

// DELETE - Delete a specific document
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const document = db.documents.findById(id)
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    const deleted = db.documents.delete(id)
    if (!deleted) {
      return NextResponse.json({ error: "Failed to delete document" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Document deleted successfully",
    })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
