import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { z } from "zod"

const createRouteSchema = z.object({
  title: z.string().min(3, "Название слишком короткое").max(200),
  description: z.string().max(2000).nullish(),
  points: z
    .array(
      z.object({
        lat: z.number().gte(-90).lte(90),
        lng: z.number().gte(-180).lte(180),
      }),
    )
    .min(2, "Маршрут должен содержать минимум две точки"),
  distanceKm: z.number().positive("Дистанция должна быть положительной"),
  durationHrs: z.number().positive().nullish(),
  imageUrl: z.string().min(1).optional().nullable(),
})


export async function GET() {
  const routes = await prisma.route.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      creator: {
        select: { id: true, name: true},
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

  let parsed
  try {
    const body = await req.json()
    parsed = createRouteSchema.parse(body)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Неверные данные маршрута",
          details: err.flatten(),
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      { error: "Ошибка разбора тела запроса" },
      { status: 400 },
    )
  }

  const route = await prisma.route.create({
    data: {
      title: parsed.title,
      description: parsed.description ?? null,
      points: parsed.points,
      distanceKm: parsed.distanceKm,
      durationHrs: parsed.durationHrs ?? null,
      imageUrl: parsed.imageUrl ?? null,
      creatorId: user.id,
    } as any,
  })

  return NextResponse.json(route)
}
