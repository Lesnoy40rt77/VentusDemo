"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/card"
import { Button } from "@/components/button"
import { MapPin, Clock } from "lucide-react"
import RouteStaticMap from "@/components/route-static-map"
import RouteDiscussionClient from "./RouteDiscussionClient"

type LatLng = { lat: number; lng: number }

type Creator = {
  id: string
  name: string | null
  email: string
}

type Post = {
  id: string
  title: string
  content: string
  createdAt: string
  imageUrl: string | null
  author: Creator
  route?: {
    id: string
    title: string
  } | null
}

type RouteItem = {
  id: string
  title: string
  description: string | null
  distanceKm: number
  durationHrs: number | null
  points: unknown
  createdAt: string
  imageUrl: string | null
  creator: Creator
  posts?: Post[]
}

type WeatherDaily = {
  temperature_2m_max?: number[]
  temperature_2m_min?: number[]
  precipitation_sum?: number[]
}

type WeatherResponse = {
  daily?: WeatherDaily
}


function normalizePoints(points: unknown): LatLng[] {
  if (!Array.isArray(points)) return []

  return points
    .map((p) => {
      if (!p || typeof p !== "object") return null

      const maybe = p as { lat?: unknown; lng?: unknown }

      const lat =
        typeof maybe.lat === "number" ? maybe.lat : Number(maybe.lat)
      const lng =
        typeof maybe.lng === "number" ? maybe.lng : Number(maybe.lng)

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null

      return { lat, lng }
    })
    .filter((p): p is LatLng => !!p)
}

export default function RoutePage() {
  const params = useParams<{ id: string }>()
  const id = params?.id

  const [route, setRoute] = useState<RouteItem | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [weather, setWeather] = useState<WeatherResponse | null>(null)

  const [loadingWeather, setLoadingWeather] = useState(false)

  useEffect(() => {
  if (!id) {
    setError("Не удалось определить ID маршрута из URL")
    setLoading(false)
    return
  }

  const run = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`/api/routes/${id}`, {
        cache: "no-store",
      })

      if (!res.ok) {
        console.error("RoutePage /api/routes/[id] status", res.status)

        if (res.status === 404) {
          setError("Маршрут с таким ID не найден")
        } else {
          setError("Не удалось загрузить данные маршрута")
        }

        setRoute(null)
        setPosts([])
        setLoading(false)
        return
      }

      const routeData = (await res.json()) as RouteItem & {
        posts?: Post[]
      }

      setRoute(routeData)
      setPosts(routeData.posts ?? [])
      setLoading(false)
    } catch (e) {
      console.error("RoutePage error:", e)
      setError("Ошибка загрузки данных маршрута")
      setLoading(false)
    }
  }

  run()
}, [id])

  const points = useMemo(
    () => normalizePoints(route?.points ?? []),
    [route?.points],
  )

  const center: LatLng | null = useMemo(() => {
    if (!points.length) return null
    return points[Math.floor(points.length / 2)]
  }, [points])

  useEffect(() => {
    if (!center) return

    const fetchWeather = async () => {
      try {
        setLoadingWeather(true)
        setWeather(null)

        const res = await fetch(
          `/api/weather?lat=${center.lat}&lng=${center.lng}`,
        )
        const data = (await res.json()) as WeatherResponse

        if (!res.ok) {
          console.error("RoutePage weather status", res.status, data)
          return
        }

        setWeather(data)
      } catch (e) {
        console.error("RoutePage weather error", e)
      } finally {
        setLoadingWeather(false)
      }
    }

    fetchWeather()
  }, [center])

  const createdAtText = useMemo(() => {
    if (!route) return ""
    return new Date(route.createdAt).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }, [route])


  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-sm text-foreground/70">Загружаем маршрут...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !route || !center) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <Card className="p-6 w-full max-w-md text-center space-y-3">
            <p className="text-sm text-foreground/70">
              {error || "Маршрут не найден"}
            </p>
            {id && (
              <p className="text-xs text-foreground/50 break-all">
                ID: <code>{id}</code>
              </p>
            )}
            <Button asChild className="w-full" variant="secondary">
              <Link href="/database">Вернуться к базе треков</Link>
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

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
                {route.imageUrl && (
                  <div className="mb-6 overflow-hidden rounded-xl">
                    <img
                      src={route.imageUrl}
                      alt={route.title}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}
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
                {loadingWeather && (
                  <p className="text-sm text-foreground/70">
                    Загружаем прогноз...
                  </p>
                )}
                {!loadingWeather && !weather && (
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

              <RouteDiscussionClient routeId={route.id} initialPosts={posts} />
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
