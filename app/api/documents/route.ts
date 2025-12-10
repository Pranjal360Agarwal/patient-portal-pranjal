import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const documents = db.documents.findAll()
    return NextResponse.json({ documents })
  } catch (error) {
    console.error("List documents error:", error)
    return NextResponse.json({ error: "Failed to retrieve documents" }, { status: 500 })
  }
}
