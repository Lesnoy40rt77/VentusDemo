// app/api/routes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

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
    const idx = parts.indexOf("routes")
    if (idx !== -1 && parts[idx + 1]) {
      return parts[idx + 1]
    }
  } catch {
  }

  return null
}

export async function GET(req: NextRequest, context: RouteParams) {
  try {
    const id = resolveRouteId(req, context?.params)

    if (!id) {
      return NextResponse.json(
        { error: "Route id is required" },
        { status: 400 },
      )
    }

    console.log("[GET /api/routes/[id]] id =", id)

    const route = await prisma.route.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, name: true },
        },
        posts: {
          orderBy: { createdAt: "desc" },
          include: {
            author: { select: { id: true, name: true } },
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
  } catch (e) {
    console.error("[GET /api/routes/[id]] error:", e)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 },
    )
  }
}
