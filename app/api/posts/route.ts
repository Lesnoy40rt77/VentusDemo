import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { TRACE_OUTPUT_VERSION } from "next/dist/shared/lib/constants"
import { z } from "zod"

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true } },
      route: { select: { id: true, title: true } },
      _count: { select: { comments: true } },
    },
  })

  return NextResponse.json(posts)
}

const createPostSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(1).max(5000),
  routeId: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
})

export async function POST(req: Request) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json(
      { error: "Требуется авторизация" },
      { status: 401 },
    )
  }

  let parsed
  try {
    const body = await req.json()
    parsed = createPostSchema.parse(body)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Неверные данные поста",
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

    const post = await prisma.post.create({
    data: {
      title,
      content,
      imageUrl: imageUrl ?? null,
      authorId: user.id,
      routeId: routeId ?? null,
    },
    include: {
      author: { select: { id: true, name: true } },
      route: { select: { id: true, title: true } },
      _count: { select: { comments: true } },
    },
  })


  return NextResponse.json(post)
}
