import { NextRequest, NextResponse } from "next/server"
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

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json(
      { error: "Необходима авторизация" },
      { status: 401 },
    )
  }

  try {
    const { title, content, routeId } = await req.json()

    if (!title || !content) {
      return NextResponse.json(
        { error: "Требуются заголовок и текст" },
        { status: 400 },
      )
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: user.id,
        routeId,
      },
    })

    return NextResponse.json(post)
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 },
    )
  }
}
