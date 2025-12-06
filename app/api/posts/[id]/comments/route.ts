import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { z } from "zod"

const createCommentSchema = z.object({
  content: z.string().min(1).max(2000),
})

const deleteCommentSchema = z.object({
  commentId: z.string().min(1),
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
  const user = await getCurrentUser()

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
      post: { select: { authorId: true } },
    },
  })

  const result = comments.map(({ post, ...comment }) => ({
    ...comment,
    canDelete: user
      ? comment.authorId === user.id || post.authorId === user.id
      : false,
  }))

  return NextResponse.json(result)
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
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

  let parsed: z.infer<typeof deleteCommentSchema>
  try {
    const body = await req.json()
    parsed = deleteCommentSchema.parse(body)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Неверный запрос на удаление комментария",
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

  const comment = await prisma.comment.findUnique({
    where: { id: parsed.commentId },
    include: {
      post: { select: { id: true, authorId: true } },
    },
  })

  if (!comment || comment.postId !== postId) {
    return NextResponse.json(
      { error: "Комментарий не найден" },
      { status: 404 },
    )
  }

  if (comment.authorId !== user.id && comment.post.authorId !== user.id) {
    return NextResponse.json(
      { error: "Недостаточно прав для удаления комментария" },
      { status: 403 },
    )
  }

  await prisma.comment.delete({
    where: { id: parsed.commentId },
  })

  return NextResponse.json({ success: true })
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

  const result = {
    ...comment,
    canDelete: true,
  }

  return NextResponse.json(result)
}
