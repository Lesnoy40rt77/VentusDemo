import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

interface PostParams {
  params: { id?: string }
}

function resolvePostId(req: NextRequest, params?: { id?: string }): string | null {
  if (params?.id) return params.id

  try {
    const url = new URL(req.url)
    const parts = url.pathname.split("/").filter(Boolean) // ["api","posts","<id>"]
    const idx = parts.indexOf("posts")
    if (idx !== -1 && parts[idx + 1]) {
      return parts[idx + 1]
    }
  } catch {
  }

  return null
}

export async function DELETE(req: NextRequest, { params }: PostParams) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json(
      { error: "Требуется авторизация" },
      { status: 401 },
    )
  }

  const postId = resolvePostId(req, params)

  if (!postId) {
    return NextResponse.json(
      { error: "ID поста не указан" },
      { status: 400 },
    )
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
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
        { error: "У вас нет прав на удаление этого поста" },
        { status: 403 },
      )
    }

    await prisma.comment.deleteMany({
      where: { postId },
    })

    await prisma.post.delete({
      where: { id: postId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[DELETE /api/posts/[id]] error:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    )
  }
}
