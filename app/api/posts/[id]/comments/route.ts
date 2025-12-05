import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { z } from "zod"

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

const createCommentSchema = z.object({
  content: z.string().min(1).max(2000),
})


export async function POST(req: NextRequest, { params }: Params) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json(
      { error: "Необходима авторизация" },
      { status: 401 },
    )
  }

  let parsed
  try {
    const body = await req.json()
    parsed = createCommentSchema.parse(body)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Неверный комментарий",
          details: err.flatten(),
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      { error: "Ошибка разбора тела запроса" },
      { status: 400 },
    )
  }

  const comment = await prisma.comment.create({
    data: {
      content: parsed.content,
      postId: params.id,
      authorId: user.id,
    },
  })
}
