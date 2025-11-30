"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { useState } from "react"
import { MapPin, Ruler } from "lucide-react"
import dynamic from "next/dynamic"

const RouteBuilderMap = dynamic(() => import("@/components/route-builder-map"), {
  ssr: false,
})

type LatLng = { lat: number; lng: number }

function computeDistanceKm(points: LatLng[]): number {
  if (points.length < 2) return 0

  const R = 6371 // радиус Земли в км
  const toRad = (deg: number) => (deg * Math.PI) / 180

  let total = 0
  for (let i = 1; i < points.length; i++) {
    const p1 = points[i - 1]
    const p2 = points[i]

    const dLat = toRad(p2.lat - p1.lat)
    const dLon = toRad(p2.lng - p1.lng)
    const lat1 = toRad(p1.lat)
    const lat2 = toRad(p2.lat)

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    total += R * c
  }
  return total
}


export default function BuilderPage() {
  const [routeGenerated, setRouteGenerated] = useState(false)
  const [routePoints, setRoutePoints] = useState<LatLng[]>([])
  const [distance, setDistanceKm] = useState(0)

  const [mapCenter, setMapCenter] = useState<LatLng>({
    lat: 61.78,
    lng: 34.35,
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  const handleRouteChange = (points: LatLng[]) => {
    setRoutePoints(points)
    setDistanceKm(computeDistanceKm(points))
    setRouteGenerated(points.length > 1)
  }


  const handleBuild = () => {
    setRouteGenerated(true)
  }

  const handleSearchStartPoint = async () => {
  if (!searchQuery.trim()) return

  try {
    setIsSearching(true)
    setSearchError(null)

    const res = await fetch(`/api/geocode?q=${encodeURIComponent(searchQuery.trim())}`)
    const data = await res.json()

    if (!data.results || data.results.length === 0) {
      setSearchError("Ничего не найдено")
      return
    }

    const first = data.results[0]
    setMapCenter({ lat: first.lat, lng: first.lng })
    // можно при желании подставить нормальное имя:
    // setSearchQuery(first.displayName)
  } catch (e) {
    console.error(e)
    setSearchError("Ошибка поиска")
  } finally {
    setIsSearching(false)
  }
}


  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-secondary py-12 border-b border-border">
          <div className="max-w-7xl mx-auto px-8">
            <h1 className="text-4xl font-semibold mb-2">Построить маршрут</h1>
            <p className="text-foreground/70">Создайте свой идеальный маршрут</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-1">
                <Card>
                  <h2 className="text-2xl font-semibold mb-6">Параметры маршрута</h2>

                  {/* Start Point */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Начальная точка</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Введите название"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleSearchStartPoint()
                          }
                        }}
                        className="flex-1 px-4 py-2 bg-input rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={handleSearchStartPoint}
                        disabled={isSearching}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-60"
                      >
                        {isSearching ? (
                          <span className="text-xs">...</span>
                        ) : (
                          <MapPin size={20} />
                        )}
                      </button>
                    </div>
                    {searchError && (
                      <p className="mt-1 text-xs text-red-500">{searchError}</p>
                    )}
                  </div>
                </Card>
              </div>

              {/* Preview */}
              <div className="lg:col-span-2">
                  <Card>
                    <RouteBuilderMap center={mapCenter} onRouteChange={handleRouteChange} />

                    <h2 className="text-2xl font-semibold mb-4 mt-6">Новый маршрут</h2>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center pb-4 border-b border-border">
                        <span className="text-foreground/70">Расстояние:</span>
                        <span className="font-semibold">
                          {distance > 0 ? `${distance.toFixed(1)} км` : "Маршрут ещё не построен"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-4 border-b border-border">
                        <span className="text-foreground/70">Время (пешком):</span>
                        <span className="font-semibold">
                          {distance > 0 ? `${(distance / 4).toFixed(1)} ч` : "—"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-4 border-b border-border">
                        <span className="text-foreground/70">Точек маршрута:</span>
                        <span className="font-semibold">{routePoints.length}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button variant="primary" className="w-full">
                        Начать маршрут
                      </Button>
                      <Button variant="secondary" className="w-full">
                        Сохранить маршрут
                      </Button>
                    </div>
                  </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
