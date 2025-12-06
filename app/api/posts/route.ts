import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { z } from "zod"

export async function GET() {
  const user = await getCurrentUser()

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true } },
      route: { select: { id: true, title: true } },
      _count: { select: { comments: true, likes: true } },
    },
  })

  let likedPostIds = new Set<string>()

  if (user) {
    const likes = await prisma.postLike.findMany({
      where: { userId: user.id },
      select: { postId: true },
    })

    likedPostIds = new Set(likes.map((l) => l.postId))
  }

  const result = posts.map((post) => ({
    ...post,
    canDelete: user ? post.authorId === user.id : false,
    likedByMe: likedPostIds.has(post.id),
  }))

  return NextResponse.json(result)
}

const createPostSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(1).max(5000),
  routeId: z.string().optional().nullable(),
  imageUrl: z.string().min(1).optional().nullable(),
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
      title: parsed.title,
      content: parsed.content,
      routeId: parsed.routeId ?? null,
      imageUrl: parsed.imageUrl ?? null,
      authorId: user.id,
    },
  })

  return NextResponse.json(post)
}
