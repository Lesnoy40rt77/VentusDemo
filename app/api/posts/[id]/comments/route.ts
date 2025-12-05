import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

interface Params {
  params: { id: string }
}

export async function GET(req: NextRequest, { params }: Params) {
  const comments = await prisma.comment.findMany({
    where: { postId: params.id },
    orderBy: { createdAt: "asc" },
    include: {
      author: { select: { id: true, name: true } },
    },
  })

  return NextResponse.json(comments)
}

export async function POST(req: NextRequest, { params }: Params) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json(
      { error: "Необходима авторизация" },
      { status: 401 },
    )
  }

  try {
    const { content } = await req.json()
    if (!content) {
      return NextResponse.json(
        { error: "Пустой комментарий" },
        { status: 400 },
      )
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: params.id,
        authorId: user.id,
      },
    })

    return NextResponse.json(comment)
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 },
    )
  }
}
