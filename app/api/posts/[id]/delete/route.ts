import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

type RouteParams = {
  params: { id?: string }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json(
      { error: "Требуется авторизация" },
      { status: 401 },
    )
  }

  let postId = params.id

  if (!postId) {
    const url = new URL(req.url)
    const segments = url.pathname.split("/")
    const postsIndex = segments.indexOf("posts")
    postId =
      postsIndex !== -1 && segments.length > postsIndex + 1
        ? segments[postsIndex + 1]
        : undefined
  }

  if (!postId) {
    return NextResponse.json(
      { error: "Не удалось определить ID поста" },
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

  if (post.authorId !== user.id) {
    return NextResponse.json(
      { error: "Недостаточно прав для удаления" },
      { status: 403 },
    )
  }

  await prisma.comment.deleteMany({
    where: { postId },
  })

  await prisma.postLike.deleteMany({
    where: { postId },
  })

  await prisma.post.delete({
    where: { id: postId },
  })

  return NextResponse.json({ success: true })
}
