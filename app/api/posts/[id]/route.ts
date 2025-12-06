import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

type RouteParams = {
  params: { id?: string }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const id = params.id

  if (!id) {
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
    where: { id },
    select: {
      id: true,
      authorId: true,
    },
  })

  if (!post) {
    return NextResponse.json(
      { error: "Пост не найден" },
      { status: 404 },
    )
  }

  if (post.authorId !== user.id) {
    return NextResponse.json(
      { error: "Удалять можно только свои посты" },
      { status: 403 },
    )
  }

  await prisma.post.delete({
    where: { id },
  })

  return NextResponse.json({ ok: true })
}
