"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/card"
import { Button } from "@/components/button"
import { useEffect, useState } from "react"
import { MapPin } from "lucide-react"
import Link from "next/link"

type RouteItem = {
  id: string
  title: string
  description: string | null
  distanceKm: number
  durationHrs: number | null
  imageUrl: string | null
  creator: { name: string | null; email: string }
  createdAt: string
}

export default function DatabasePage() {
  const [routes, setRoutes] = useState<RouteItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/routes", { cache: "no-store" })
        const data = await res.json()
        setRoutes(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-secondary py-12 border-b border-border">
          <div className="max-w-7xl mx-auto px-8">
            <h1 className="text-4xl font-semibold mb-2">База треков</h1>
            <p className="text-foreground/70">
              Здесь появляются маршруты, которые создают участники Ventus.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-8 space-y-6">
            {loading && (
              <p className="text-sm text-foreground/70">
                Загружаем маршруты...
              </p>
            )}

            {!loading && routes.length === 0 && (
              <p className="text-sm text-foreground/70">
                Пока ещё нет ни одного маршрута. Создайте свой на странице{" "}
                <Link href="/builder" className="text-primary underline">
                  «Построить маршрут»
                </Link>
                .
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {routes.map((route) => (
                <Card key={route.id} className="p-5 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      {route.title}
                    </h2>
                    <p className="text-sm text-foreground/70 mb-4 line-clamp-3">
                      {route.description || "Без описания"}
                    </p>

                    <div className="space-y-1 text-sm text-foreground/80 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-primary" />
                        <span>
                          Дистанция: {route.distanceKm.toFixed(1)} км
                        </span>
                      </div>
                      <div>
                        Время:{" "}
                        {route.durationHrs
                          ? `${route.durationHrs.toFixed(1)} ч`
                          : "—"}
                      </div>
                      <div className="text-xs text-foreground/60">
                        Автор: {route.creator.name || route.creator.email}
                      </div>
                    </div>
                  </div>

                  <Button
                    asChild
                    variant="secondary"
                    className="mt-2 w-full"
                  >
                    <Link href={`/route/${route.id}`}>
                      Открыть маршрут
                    </Link>
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
