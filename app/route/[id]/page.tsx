import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/card"
import { Button } from "@/components/button"
import Link from "next/link"
import { MapPin, Clock } from "lucide-react"
import { prisma } from "@/lib/db"
import RouteDiscussionClient from "./RouteDiscussionClient"
import RouteStaticMap from "@/components/route-static-map"

type LatLng = { lat: number; lng: number }

// аккуратно вытащим точки из JSON
function normalizePoints(points: unknown): LatLng[] {
  if (!Array.isArray(points)) return []
  return points
    .map((p: any) =>
      typeof p === "object" && p !== null
        ? { lat: Number(p.lat), lng: Number(p.lng) }
        : null,
    )
    .filter(
      (p): p is LatLng =>
        !!p && Number.isFinite(p.lat) && Number.isFinite(p.lng),
    )
}

async function fetchWeatherForRoute(points: LatLng[]) {
  if (points.length < 2) return null
  const mid = points[Math.floor(points.length / 2)]

  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast")
    url.searchParams.set("latitude", String(mid.lat))
    url.searchParams.set("longitude", String(mid.lng))
    url.searchParams.set(
      "daily",
      "temperature_2m_max,temperature_2m_min,precipitation_sum",
    )
    url.searchParams.set("timezone", "auto")

    const res = await fetch(url.toString(), {
      cache: "no-store",
    })

    if (!res.ok) {
      console.error("weather upstream status", res.status)
      return null
    }

    const data = await res.json()
    return data
  } catch (e) {
    console.error("weather fetch error", e)
    return null
  }
}

export default async function RoutePage({
  params,
}: {
  params: { id: string }
}) {
  // 🔹 максимально прямолинейно: просто берём params.id
  const id = params.id

  // если почему-то даже тут id нет — покажем страницу, а не упадём
  if (!id) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <Card className="p-6 w-full max-w-md text-center space-y-3">
            <p className="text-sm text-foreground/70">
              Не удалось определить ID маршрута из URL.
            </p>
            <p className="text-xs text-foreground/50">
              Попробуйте вернуться к базе треков и открыть маршрут ещё раз.
            </p>
            <Button asChild className="w-full" variant="secondary">
              <Link href="/database">Вернуться к базе треков</Link>
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  // пробуем достать маршрут из БД
  let route = null as Awaited<
    ReturnType<typeof prisma.route.findUnique>
  > | null

  try {
    route = await prisma.route.findUnique({
      where: { id }, // если id нормальный и такой маршрут есть — он сюда попадёт
      include: {
        creator: { select: { id: true, name: true, email: true } },
        posts: {
          orderBy: { createdAt: "desc" },
          include: {
            author: { select: { id: true, name: true, email: true } },
          },
        },
      },
    })
  } catch (e) {
    console.error("RoutePage prisma.findUnique error:", e)
  }

  // если ничего не нашли — аккуратная «не найдено», но БЕЗ notFound()
  if (!route) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <Card className="p-6 w-full max-w-md text-center space-y-3">
            <p className="text-sm text-foreground/70">
              Маршрут с таким ID не найден в базе.
            </p>
            <p className="text-xs text-foreground/50 break-all">
              ID: <code>{id}</code>
            </p>
            <Button asChild className="w-full" variant="secondary">
              <Link href="/database">Вернуться к базе треков</Link>
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  const points = normalizePoints(route.points)
  const center: LatLng =
    points.length > 0
      ? points[Math.floor(points.length / 2)]
      : { lat: 61.78, lng: 34.35 }

  const weather = await fetchWeatherForRoute(points)

  const createdAtText = new Date(route.createdAt).toLocaleDateString(
    "ru-RU",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  )

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-secondary py-10 border-b border-border">
          <div className="max-w-7xl mx-auto px-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-foreground/60 mb-2">
                Маршрут
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold mb-2">
                {route.title}
              </h1>
              <p className="text-foreground/70 max-w-2xl">
                {route.description ||
                  "Автор ещё не добавил описание к этому маршруту."}
              </p>
            </div>

            <div className="text-sm text-foreground/70 space-y-1">
              <p>
                Автор:{" "}
                <span className="font-medium">
                  {route.creator.name || route.creator.email}
                </span>
              </p>
              <p>Создан: {createdAtText}</p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Левая часть: карта + инфа + погода */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-4">
                <RouteStaticMap points={points} center={center} />
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-foreground/80">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-primary" />
                    <span>
                      Дистанция: {route.distanceKm.toFixed(1)} км
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-primary" />
                    <span>
                      Время:{" "}
                      {route.durationHrs
                        ? `${route.durationHrs.toFixed(1)} ч`
                        : "—"}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h2 className="text-lg font-semibold mb-3">
                  Погода на маршруте
                </h2>
                {!weather && (
                  <p className="text-sm text-foreground/70">
                    Не удалось получить прогноз погоды. Попробуйте позже.
                  </p>
                )}
                {weather && (
                  <div className="text-sm text-foreground/80 space-y-2">
                    <p>
                      Сегодня:{" "}
                      <span className="font-medium">
                        {weather.daily?.temperature_2m_max?.[0]}° /{" "}
                        {weather.daily?.temperature_2m_min?.[0]}°C
                      </span>
                    </p>
                    <p>
                      Осадки за день:{" "}
                      <span className="font-medium">
                        {weather.daily?.precipitation_sum?.[0]} мм
                      </span>
                    </p>
                  </div>
                )}
              </Card>
            </div>

            {/* Правая часть: экипировка, безопасность, обсуждение */}
            <div className="space-y-6">
              <Card className="p-4">
                <h2 className="text-lg font-semibold mb-3">
                  Что взять с собой
                </h2>
                <ul className="text-sm text-foreground/80 list-disc pl-5 space-y-1">
                  <li>Запас воды и перекус.</li>
                  <li>Тёплая одежда и дождевик.</li>
                  <li>Заряженный телефон и пауэрбанк.</li>
                  <li>Аптечка и средства от насекомых.</li>
                </ul>
              </Card>

              <Card className="p-4">
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="text-amber-500">⚠</span> Безопасность
                </h2>
                <ul className="text-sm text-foreground/80 list-disc pl-5 space-y-1">
                  <li>Сообщите близким маршрут и время возвращения.</li>
                  <li>Проверьте связь и заряд перед выходом.</li>
                  <li>Не уходите с тропы и следите за прогнозом.</li>
                </ul>
              </Card>

              <RouteDiscussionClient
                routeId={route.id}
                initialPosts={route.posts}
              />
            </div>
          </div>
        </section>

        {/* Кнопка назад */}
        <section className="pb-10">
          <div className="max-w-7xl mx-auto px-8">
            <Button asChild variant="secondary">
              <Link href="/database">Вернуться к базе треков</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
