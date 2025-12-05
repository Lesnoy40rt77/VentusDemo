import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  const routes = await prisma.route.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      creator: {
        select: { id: true, name: true, email: true },
      },
    },
  })

  return NextResponse.json(routes)
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
    const { title, description, points, distanceKm, durationHrs, imageUrl } =
      await req.json()

    if (!title || !points || !Array.isArray(points) || points.length < 2) {
      return NextResponse.json(
        { error: "Неверные данные маршрута" },
        { status: 400 },
      )
    }

    const route = await prisma.route.create({
      data: {
        title,
        description,
        points,
        distanceKm,
        durationHrs,
        imageUrl: imageUrl ?? null,
        creatorId: user.id,
      },
    })

    return NextResponse.json(route)
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 },
    )
  }
}
