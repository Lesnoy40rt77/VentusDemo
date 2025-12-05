import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, email: true } },
      route: { select: { id: true, title: true } },
      comments: true,
    },
  })

  return NextResponse.json(posts)
}

export async function POST(req: Request) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json(
      { error: "Требуется авторизация" },
      { status: 401 },
    )
  }

  const body = await req.json()
  const { title, content, routeId, imageUrl } = body

  if (!title || !content) {
    return NextResponse.json(
      { error: "Заполните заголовок и текст" },
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
      author: { select: { id: true, name: true, email: true } },
      route: { select: { id: true, title: true } },
      comments: true,
    },
  })

  return NextResponse.json(post)
}
