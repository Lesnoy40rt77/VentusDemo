import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { z } from "zod"

const createCommentSchema = z.object({
  content: z.string().min(1).max(2000),
})

type RouteParams = {
  params: { id?: string }
}

function resolvePostId(req: NextRequest, params?: { id?: string }): string | null {
  if (params?.id) {
    return params.id
  }

  try {
    const url = new URL(req.url)
    const segments = url.pathname.split("/")
    const postsIndex = segments.indexOf("posts")
    if (postsIndex !== -1 && segments.length > postsIndex + 1) {
      return segments[postsIndex + 1]
    }
  } catch {
  }

  return null
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const postId = resolvePostId(req, params)

  if (!postId) {
    return NextResponse.json(
      { error: "Не удалось определить ID поста" },
      { status: 400 },
    )
  }

  const comments = await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "asc" },
    include: {
      author: { select: { id: true, name: true } },
    },
  })

  return NextResponse.json(comments)
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json(
      { error: "Необходима авторизация" },
      { status: 401 },
    )
  }

  const postId = resolvePostId(req, params)

  if (!postId) {
    return NextResponse.json(
      { error: "Не удалось определить ID поста" },
      { status: 400 },
    )
  }

  let parsed: z.infer<typeof createCommentSchema>
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
      postId,
      authorId: user.id,
    },
    include: {
      author: { select: { id: true, name: true } },
    },
  })

  return NextResponse.json(comment)
}
