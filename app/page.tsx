import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { IconCircle } from "@/components/icon-circle"
import { Mountain, Users, MapPin, Shield, TreePine } from "lucide-react"
import Link from "next/link"
import RouteStaticMap from "@/components/route-static-map"
import { RouteCardWeatherChip } from "@/components/route-card-weather-chip"
import { prisma } from "@/lib/db"
import { HeroRouteCarousel } from "@/components/hero-route-carousel"

type RoutePoint = {
  lat: number
  lng: number
}

type RouteItem = {
  id: string
  title: string
  distanceKm: number
  durationHrs: number | null
  imageUrl: string | null
  points: RoutePoint[] | null
}

function getRouteCenter(points: RoutePoint[]): RoutePoint {
  const { lat, lng } = points.reduce(
    (acc, p) => {
      acc.lat += p.lat
      acc.lng += p.lng
      return acc
    },
    { lat: 0, lng: 0 },
  )

  return {
    lat: lat / points.length,
    lng: lng / points.length,
  }
}

async function getPopularRoutes(): Promise<RouteItem[]> {
  const routes = await prisma.route.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
  })

  return routes.map((r) => ({
    id: r.id,
    title: r.title,
    distanceKm: r.distanceKm,
    durationHrs: r.durationHrs,
    imageUrl: (r as any).imageUrl ?? null,
    points: (r as any).points ?? null,
  }))
}

export default async function LandingPage() {
  const popularRoutes = await getPopularRoutes()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-secondary min-h-screen flex items-center overflow-hidden relative">
        {/* Blurred tree silhouettes background */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
          <TreePine size={400} className="text-primary" />
        </div>
        <div className="absolute right-0 top-1/3 opacity-5 pointer-events-none">
          <TreePine size={350} className="text-primary" />
        </div>

        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-semibold text-foreground leading-tight">
              Откройте идеальный маршрут
            </h1>
            <p className="text-lg text-foreground/70 leading-relaxed">
              Ventus помогает вам спланировать, обнаружить и поделиться горными маршрутами. От лесных троп до горных
              вершин — все в одном месте.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/builder">
                <Button variant="primary">Начать путешествие</Button>
              </Link>

              <Link href="#how-it-works">
                <Button variant="outline">Узнать больше</Button>
              </Link>
            </div>
          </div>

          {/* Right Preview Card */}
          <div>
            <Card className="lg:col-span-1 p-4">
              <HeroRouteCarousel routes={popularRoutes} />
            </Card>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-semibold text-center mb-16">Почему Ventus?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <MapPin size={32} />,
                title: "Лучшие маршруты",
                description: "Откройте проверенные маршруты от опытных путешественников",
              },
              {
                icon: <Users size={32} />,
                title: "Сообщество",
                description: "Делитесь опытом и учитесь у других туристов",
              },
              {
                icon: <Shield size={32} />,
                title: "Безопасность",
                description: "Погода, предупреждения и советы для безопасного путешествия",
              },
            ].map((item, idx) => (
              <Card key={idx}>
                <IconCircle icon={item.icon} color="primary" />
                <h3 className="text-2xl font-semibold mt-4 mb-2">{item.title}</h3>
                <p className="text-foreground/70">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30" id="how-it-works">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-semibold text-center mb-16">Как это работает</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "01", title: "Выберите маршрут", description: "Просмотрите нашу базу данных маршрутов" },
              { number: "02", title: "Планируйте", description: "Проверьте погоду и получите рекомендации" },
              { number: "03", title: "Подготовьтесь", description: "Используйте чек-лист снаряжения" },
              { number: "04", title: "Начните", description: "Отправьтесь в приключение с Ventus" },
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-block mb-4 px-4 py-2 bg-primary text-white rounded-full font-semibold">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-foreground/70 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Routes Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-semibold text-center mb-16">
            Популярные маршруты
          </h2>

          {popularRoutes.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground">
              <p>Пока нет ни одного маршрута.</p>
              <Button asChild variant="outline">
                <Link href="/builder">Создать первый маршрут</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {popularRoutes.map((route) => {
                const hasPoints =
                  Array.isArray(route.points) && route.points.length > 0
                let center: RoutePoint | null = null

                if (hasPoints) {
                  center = getRouteCenter(route.points as RoutePoint[])
                }

                return (
                  <Card key={route.id} className="flex flex-col">
                    {route.imageUrl ? (
                      <div className="mb-4 overflow-hidden rounded-lg border border-border bg-black/5 flex items-center justify-center">
                        <img
                          src={route.imageUrl}
                          alt={route.title}
                          className="max-h-64 w-auto object-contain"
                        />
                      </div>
                    ) : hasPoints && center ? (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <RouteStaticMap
                          points={route.points as RoutePoint[]}
                          center={center}
                        />
                      </div>
                    ) : (
                      <div className="aspect-video mb-4 flex items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
                        Обложка маршрута появится здесь
                      </div>
                    )}

                    <div className="flex-1 flex flex-col px-4 pb-4">
                      <h3 className="text-lg font-semibold mb-1">
                        {route.title}
                      </h3>

                      <RouteCardWeatherChip points={route.points} />

                      <p className="text-sm text-muted-foreground mb-4">
                        {route.distanceKm.toFixed(1)} км ·{" "}
                        {route.durationHrs
                          ? `${route.durationHrs.toFixed(1)} ч в пути`
                          : "время рассчитывается автоматически"}
                      </p>

                      <Button asChild variant="outline" className="mt-auto">
                        <a href={`/route/${route.id}`}>Открыть маршрут</a>
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </section>


      {/* Preparation Timeline Section */}
      <section className="py-20 bg-muted/30 relative overflow-hidden">
        {/* Decorative trees */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
          <TreePine size={500} className="text-primary" />
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <h2 className="text-4xl font-semibold text-center mb-16">Подготовка к походу</h2>
          <div className="space-y-12">
            {[
              {
                step: "1",
                title: "Выберите маршрут",
                description: "Найдите подходящий маршрут в нашей базе данных по сложности и расстоянию",
              },
              {
                step: "2",
                title: "Проверьте условия",
                description: "Изучите прогноз погоды, предупреждения и советы от сообщества",
              },
              {
                step: "3",
                title: "Соберите снаряжение",
                description: "Используйте наш чек-лист, чтобы убедиться, что вы ничего не забыли",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-semibold">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-foreground/70">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-semibold mb-6">Готовы начать?</h2>
          <p className="text-lg mb-8 opacity-90">
            Присоединяйтесь к тысячам путешественников, которые открывают новые маршруты каждый день.
          </p>
          <Link href="/dashboard">
            <Button variant="secondary">Начать бесплатно</Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
