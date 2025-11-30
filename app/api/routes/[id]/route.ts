import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

interface Params {
  params: { id: string }
}

export async function GET(req: NextRequest, { params }: Params) {
  const route = await prisma.route.findUnique({
    where: { id: params.id },
    include: {
      creator: {
        select: { id: true, name: true, email: true },
      },
      posts: {
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
}
