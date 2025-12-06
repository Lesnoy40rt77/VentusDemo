import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json(
      { error: "Необходима авторизация" },
      { status: 401 },
    )
  }

  const postId = params.id

  if (!postId) {
    return NextResponse.json(
      { error: "Не указан ID поста" },
      { status: 400 },
    )
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
  })

  if (!post) {
    return NextResponse.json(
      { error: "Пост не найден" },
      { status: 404 },
    )
  }

  const existingLike = await prisma.postLike.findFirst({
    where: {
      userId: user.id,
      postId,
    },
  })

  if (existingLike) {
    await prisma.postLike.delete({
      where: { id: existingLike.id },
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
    liked: !existingLike,
    likesCount,
  })
}
