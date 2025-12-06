// app/api/routes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

interface RouteParams {
  params: { id?: string }
}

function resolveRouteId(req: NextRequest, params?: { id?: string }): string | null {
  if (params?.id) {
    return params.id
  }

  try {
    const url = new URL(req.url)
    const parts = url.pathname.split("/").filter(Boolean) // ["api","routes","<id>"]
    const routesIndex = parts.indexOf("routes")
    if (routesIndex !== -1 && parts[routesIndex + 1]) {
      return parts[routesIndex + 1]
    }
  } catch {
  }

  return null
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const id = resolveRouteId(req, params)

  if (!id) {
    return NextResponse.json(
      { error: "Route id is required" },
      { status: 400 },
    )
  }

  try {
    const route = await prisma.route.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, name: true },
        },
        posts: {
          orderBy: { createdAt: "desc" },
          include: {
            author: {
              select: { id: true, name: true },
            },
          },
        },
      },
    })

    if (!route) {
      return NextResponse.json(
        { error: "Маршрут не найден" },
        { status: 404 },
      )
    }

    return NextResponse.json(route)
  } catch (error) {
    console.error("[GET /api/routes/[id]] error:", error)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 },
    )
  }
}

// DELETE /api/routes/:id
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json(
      { error: "Требуется авторизация" },
      { status: 401 },
    )
  }

  const id = resolveRouteId(req, params)

  if (!id) {
    return NextResponse.json(
      { error: "Route id is required" },
      { status: 400 },
    )
  }

  try {
    const route = await prisma.route.findUnique({
      where: { id },
      select: {
        id: true,
        creatorId: true,
      },
    })

    if (!route) {
      return NextResponse.json(
        { error: "Маршрут не найден" },
        { status: 404 },
      )
    }

    if (route.creatorId !== user.id) {
      return NextResponse.json(
        { error: "У вас нет прав на удаление этого маршрута" },
        { status: 403 },
      )
    }

    const routePosts = await prisma.post.findMany({
      where: { routeId: id },
      select: { id: true },
    })

    const postIds = routePosts.map((p) => p.id)

    if (postIds.length > 0) {
      await prisma.comment.deleteMany({
        where: { postId: { in: postIds } },
      })

      await prisma.post.deleteMany({
        where: { id: { in: postIds } },
      })
    }

    await prisma.route.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[DELETE /api/routes/[id]] error:", error)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 },
    )
  }
}
