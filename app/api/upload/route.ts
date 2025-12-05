import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import crypto from "crypto"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get("file") as File | null

  if (!file) {
    return NextResponse.json(
      { error: "Файл не найден" },
      { status: 400 },
    )
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const safeName = file.name.toLowerCase()
  const ext = path.extname(safeName) || ".jpg"
  const base = crypto.randomBytes(16).toString("hex")
  const fileName = `${base}${ext}`

  const uploadDir = path.join(process.cwd(), "public", "uploads")
  await fs.mkdir(uploadDir, { recursive: true })

  const filePath = path.join(uploadDir, fileName)
  await fs.writeFile(filePath, buffer)

  const url = `/uploads/${fileName}`

  return NextResponse.json({ url })
}
