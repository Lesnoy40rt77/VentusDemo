// app/api/routes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

interface RouteParams {
  params: { id: string }
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    console.log("[GET /api/routes/[id]] id =", id)

    const route = await prisma.route.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        posts: {
          orderBy: { createdAt: "desc" },
          include: {
            author: { select: { id: true, name: true, email: true } },
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
