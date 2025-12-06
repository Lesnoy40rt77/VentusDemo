import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

type RouteParams = {
  params: { id?: string }
}

export async function POST(_req: NextRequest, { params }: RouteParams) {
  const postId = params.id

  if (!postId) {
    return NextResponse.json(
      { error: "ID поста не указан" },
      { status: 400 },
    )
  }

  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json(
      { error: "Требуется авторизация" },
      { status: 401 },
    )
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true },
  })

  if (!post) {
    return NextResponse.json(
      { error: "Пост не найден" },
      { status: 404 },
    )
  }

  const existing = await prisma.postLike.findUnique({
    where: {
      userId_postId: {
        userId: user.id,
        postId,
      },
    },
  })

  if (existing) {
    await prisma.postLike.delete({
      where: { id: existing.id },
    })
  } else {
    await prisma.postLike.create({
      data: {
        userId: user.id,
        postId,
      },
    })
  }

  const likesCount = await prisma.postLike.count({
    where: { postId },
  })

  return NextResponse.json({
    liked: !existing,
    likesCount,
  })
}
