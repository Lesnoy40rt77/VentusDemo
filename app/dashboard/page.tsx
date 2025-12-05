"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/card"
import { Button } from "@/components/button"
import { Map, MapPin, MessageCircle, Route as RouteIcon, User } from "lucide-react"

type MeUser = {
  id: string
  email: string
  name: string | null
}

type RouteItem = {
  id: string
  title: string
  description: string | null
  distanceKm: number
  durationHrs: number | null
  createdAt: string
  imageUrl: string | null
  creator: {
    id: string
    name: string | null
  }
}

type PostItem = {
  id: string
  title: string
  content: string
  createdAt: string
  author: {
    id: string
    name: string | null
  }
  route?: {
    id: string
    title: string
  } | null
  _count: { comments: number }
}

export default function DashboardPage() {
  const router = useRouter()

  const [user, setUser] = useState<MeUser | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)

  const [routes, setRoutes] = useState<RouteItem[]>([])
  const [posts, setPosts] = useState<PostItem[]>([])
  const [loadingData, setLoadingData] = useState(true)

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" })

        if (!res.ok) {
          console.error("Dashboard /api/auth/me status", res.status)
          setUser(null)
          setLoadingUser(false)
          router.push("/auth?next=/dashboard")
          return
        }

        const data = (await res.json()) as { user: MeUser | null }
        if (!data.user) {
          setUser(null)
          setLoadingUser(false)
          router.push("/auth?next=/dashboard")
          return
        }

        setUser(data.user)
        setLoadingUser(false)
      } catch (e) {
        console.error("Dashboard me error", e)
        setUser(null)
        setLoadingUser(false)
        router.push("/auth?next=/dashboard")
      }
    }

    run()
  }, [router])

  useEffect(() => {
    if (!user?.id) return

    const load = async () => {
      try {
        setLoadingData(true)
        setError(null)

        const [routesRes, postsRes] = await Promise.all([
          fetch("/api/routes", { cache: "no-store" }),
          fetch("/api/posts", { cache: "no-store" }),
        ])

        if (!routesRes.ok || !postsRes.ok) {
          console.error(
            "Dashboard data status",
            routesRes.status,
            postsRes.status,
          )
          setError("Не удалось загрузить данные")
          setLoadingData(false)
          return
        }

        const routesData = (await routesRes.json()) as RouteItem[]
        const postsData = (await postsRes.json()) as PostItem[]

        setRoutes(routesData)
        setPosts(postsData)
        setLoadingData(false)
      } catch (e) {
        console.error("Dashboard data error", e)
        setError("Не удалось загрузить данные")
        setLoadingData(false)
      }
    }

    load()
  }, [user?.id])

  const myRoutes = useMemo(
    () =>
      user
        ? routes.filter((r) => r.creator.id === user.id)
        : ([] as RouteItem[]),
    [routes, user],
  )

  const myPosts = useMemo(
    () =>
      user
        ? posts.filter((p) => p.author.id === user.id)
        : ([] as PostItem[]),
    [posts, user],
  )

  const stats = useMemo(() => {
    const totalDistance = myRoutes.reduce(
      (sum, r) => sum + (r.distanceKm || 0),
      0,
    )

    return {
      routesCount: myRoutes.length,
      postsCount: myPosts.length,
      totalDistance,
    }
  }, [myRoutes, myPosts])

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-sm text-foreground/70">Загружаем профиль...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <Card className="p-6 w-full max-w-md text-center">
            <p className="mb-4 text-sm text-foreground/70">
              Чтобы открыть личный кабинет, войдите в аккаунт.
            </p>
            <Button asChild className="w-full">
              <Link href="/auth?next=/dashboard">Войти</Link>
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
          <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-foreground/60 mb-2">
                Личный кабинет
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold mb-2">
                Привет, {user.name || user.email}
              </h1>
              <p className="text-foreground/70 max-w-xl">
                Здесь собраны ваши маршруты и активности. Продолжайте строить
                треки, делиться впечатлениями и следить за прогрессом.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button asChild className="w-full md:w-auto">
                <Link href="/builder" className="flex items-center gap-2">
                  <RouteIcon size={18} />
                  Построить новый маршрут
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="w-full md:w-auto"
              >
                <Link
                  href="/community"
                  className="flex items-center gap-2 text-sm"
                >
                  <MessageCircle size={18} />
                  Перейти в сообщество
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-8 space-y-8">
            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Map size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-foreground/60">
                    Маршрутов создано
                  </p>
                  <p className="text-xl font-semibold">
                    {stats.routesCount}
                  </p>
                </div>
              </Card>

              <Card className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-foreground/60">
                    Общая дистанция
                  </p>
                  <p className="text-xl font-semibold">
                    {stats.totalDistance > 0
                      ? `${stats.totalDistance.toFixed(1)} км`
                      : "—"}
                  </p>
                </div>
              </Card>

              <Card className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-foreground/60">
                    Постов в сообществе
                  </p>
                  <p className="text-xl font-semibold">
                    {stats.postsCount}
                  </p>
                </div>
              </Card>
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            {loadingData && (
              <p className="text-sm text-foreground/70">
                Загружаем ваши маршруты и активности...
              </p>
            )}

            {!loadingData && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Мои маршруты */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Мои маршруты</h2>
                    <Link
                      href="/database"
                      className="text-xs text-foreground/60 hover:text-foreground underline underline-offset-4"
                    >
                      Открыть базу треков
                    </Link>
                  </div>

                  {myRoutes.length === 0 ? (
                    <Card className="p-4 text-sm text-foreground/70">
                      У вас пока нет сохранённых маршрутов.{" "}
                      <Link
                        href="/builder"
                        className="text-primary underline"
                      >
                        Постройте первый маршрут
                      </Link>
                      .
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {myRoutes
                        .slice()
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime(),
                        )
                        .slice(0, 5)
                        .map((route) => (
                          <Card
                            key={route.id}
                            className="p-4 flex items-start justify-between gap-4"
                          >
                            {route.imageUrl && (
                              <div className="mb-3 overflow-hidden rounded-lg border border-border bg-black/5 flex items-center justify-center">
                                <img
                                  src={route.imageUrl}
                                  alt={route.title}
                                  className="max-h-32 w-auto object-contain"
                                />
                              </div>
                            )}
                            <div>
                              <h3 className="font-semibold text-base mb-1">
                                {route.title}
                              </h3>
                              <p className="text-sm text-foreground/70 line-clamp-2 mb-2">
                                {route.description || "Без описания"}
                              </p>
                              <div className="flex flex-wrap gap-3 text-xs text-foreground/60">
                                <span>
                                  {route.distanceKm.toFixed(1)} км
                                </span>
                                <span>
                                  {route.durationHrs
                                    ? `${route.durationHrs.toFixed(1)} ч`
                                    : "Время не указано"}
                                </span>
                                <span>
                                  {new Date(
                                    route.createdAt,
                                  ).toLocaleDateString("ru-RU")}
                                </span>
                              </div>
                            </div>
                            <Button
                              asChild
                              variant="secondary"
                              className="text-xs px-3 py-1"
                            >
                              <Link href={`/route/${route.id}`}>
                                Открыть
                              </Link>
                            </Button>
                          </Card>
                        ))}
                    </div>
                  )}
                </div>

                {/* Моя активность в сообществе */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">
                    Моя активность
                  </h2>

                  {myPosts.length === 0 ? (
                    <Card className="p-4 text-sm text-foreground/70">
                      Вы ещё не писали постов в сообществе.{" "}
                      <Link
                        href="/community"
                        className="text-primary underline"
                      >
                        Поделитесь первым опытом
                      </Link>
                      .
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {myPosts
                        .slice()
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime(),
                        )
                        .slice(0, 5)
                        .map((post) => (
                          <Card key={post.id} className="p-4">
                            <h3 className="font-semibold text-sm mb-1">
                              {post.title}
                            </h3>
                            <p className="text-xs text-foreground/70 mb-2 line-clamp-3">
                              {post.content}
                            </p>
                            <div className="flex items-center justify-between text-[11px] text-foreground/60">
                              <span>
                                {new Date(
                                  post.createdAt,
                                ).toLocaleDateString("ru-RU", {
                                  day: "2-digit",
                                  month: "short",
                                })}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle size={12} />
                                {post._count.comments} коммент.
                              </span>
                            </div>
                          </Card>
                        ))}
                    </div>
                  )}

                  <Button
                    asChild
                    variant="secondary"
                    className="w-full"
                  >
                    <Link href="/community">
                      Открыть все посты сообщества
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
