"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Ruler } from "lucide-react"
import dynamic from "next/dynamic"

const RouteBuilderMap = dynamic(() => import("@/components/route-builder-map"), {
  ssr: false,
})

type LatLng = { lat: number; lng: number }

function computeDistanceKm(points: LatLng[]): number {
  if (points.length < 2) return 0

  const R = 6371
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
  const router = useRouter()

  const [authChecked, setAuthChecked] = useState(false)

  const [routeGenerated, setRouteGenerated] = useState(false)
  const [routePoints, setRoutePoints] = useState<LatLng[]>([])
  const [distanceKm, setDistanceKm] = useState(0)
  const [routeImageUrl, setRouteImageUrl] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)


  const [mapCenter, setMapCenter] = useState<LatLng>({
    lat: 61.78,
    lng: 34.35,
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const [weather, setWeather] = useState<any | null>(null)
  const [loadingWeather, setLoadingWeather] = useState(false)

  const [saveError, setSaveError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" })
        const data = await res.json()

        if (!res.ok || !data.user) {
          if (!cancelled) {
            router.push("/auth?next=/builder")
          }
          return
        }

        if (!cancelled) {
          setAuthChecked(true)
        }
      } catch {
        if (!cancelled) {
          router.push("/auth?next=/builder")
        }
      }
    }

    checkAuth()

    return () => {
      cancelled = true
    }
  }, [router])

const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    setImageError(null)

    try {
      setUploadingImage(true)

      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setImageError(data.error || "Не удалось загрузить файл")
        return
      }

      setRouteImageUrl(data.url)
    } catch (error) {
      setImageError("Ошибка загрузки файла")
    } finally {
      setUploadingImage(false)
    }
  }


  const handleRouteChange = (points: LatLng[]) => {
    setRoutePoints(points)

    const d = computeDistanceKm(points)
    setDistanceKm(d)
    setRouteGenerated(points.length > 1)

    if (points.length > 1) {
      void fetchWeather(points)
    } else {
      setWeather(null)
    }
  }

  const fetchWeather = async (points: LatLng[]) => {
    if (points.length < 2) return
    const mid = points[Math.floor(points.length / 2)]

    try {
      setLoadingWeather(true)
      setWeather(null)

      const res = await fetch(
        `/api/weather?lat=${mid.lat}&lng=${mid.lng}`,
      )
      const data = await res.json()

      if (!res.ok) {
        console.error("Weather error", data)
        return
      }

      setWeather(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingWeather(false)
    }
  }

  const handleSearchStartPoint = async () => {
    if (!searchQuery.trim()) return

    try {
      setIsSearching(true)
      setSearchError(null)

      const res = await fetch(
        `/api/geocode?q=${encodeURIComponent(searchQuery.trim())}`,
      )

      if (!res.ok) {
        const text = await res.text()
        console.error("Geocode HTTP error:", res.status, text.slice(0, 200))
        setSearchError("Ошибка поиска")
        return
      }

      const data = (await res.json()) as {
        results?: { displayName: string; lat: number; lng: number }[]
        error?: string
      }

      if (data.error) {
        console.error("Geocode logical error:", data.error)
        setSearchError("Ошибка поиска")
        return
      }

      if (!data.results || data.results.length === 0) {
        setSearchError("Ничего не найдено")
        return
      }

      const first = data.results[0]
      setMapCenter({ lat: first.lat, lng: first.lng })
    } catch (e) {
      console.error("Geocode fetch error:", e)
      setSearchError("Ошибка поиска")
    } finally {
      setIsSearching(false)
    }
  }

  const handleSaveRoute = async () => {
    setSaveError(null)

    if (!routeGenerated || routePoints.length < 2) {
      setSaveError("Сначала постройте маршрут на карте")
      return
    }

    if (!title.trim()) {
      setSaveError("Добавьте название маршрута")
      return
    }

    try {
      setSaving(true)

      const res = await fetch("/api/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          points: routePoints,
          distanceKm,
          durationHrs: distanceKm ? distanceKm / 4 : null,
          imageUrl: routeImageUrl,
        }),
      })

      const data = await res.json()

      if (res.status === 401) {
        window.location.href = `/auth?next=/builder`
        return
      }

      if (!res.ok) {
        setSaveError(data.error || "Не удалось сохранить маршрут")
        return
      }

      window.location.href = "/database"
    } catch (e) {
      console.error(e)
      setSaveError("Ошибка сохранения")
    } finally {
      setSaving(false)
    }
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-sm text-foreground/70">Проверяем авторизацию...</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-secondary py-12 border-b border-border">
          <div className="max-w-7xl mx-auto px-8">
            <h1 className="text-4xl font-semibold mb-2">Построить маршрут</h1>
            <p className="text-foreground/70">
              Отметьте точки на карте, получите прогноз погоды и сохраните маршрут в базе Ventus.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Card>
                  <h2 className="text-2xl font-semibold mb-6">Параметры маршрута</h2>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Начальная точка
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Введите название"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            void handleSearchStartPoint()
                          }
                        }}
                        className="flex-1 px-4 py-2 bg-input rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm"
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
                      <p className="mt-1 text-xs text-red-500">
                        {searchError}
                      </p>
                    )}
                  </div>

                  <div className="mb-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Название маршрута
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-md border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        placeholder="Например, Лесной маршрут у озера"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Краткое описание
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 rounded-md border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary text-sm min-h-[80px]"
                        placeholder="Что ждёт участников на этом маршруте?"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <label className="block text-sm font-medium">
                      Обложка маршрута (опционально)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-xs text-foreground/80 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-secondary file:text-foreground hover:file:bg-secondary/80"
                    />
                    {uploadingImage && (
                      <p className="text-xs text-foreground/60">
                        Загружаем изображение...
                      </p>
                    )}
                    {imageError && (
                      <p className="text-xs text-red-500">{imageError}</p>
                    )}
                    {routeImageUrl && (
                      <div className="mt-2">
                        <img
                          src={routeImageUrl}
                          alt="Обложка маршрута"
                          className="w-full h-40 object-cover rounded-md border border-border"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center pb-2 border-b border-border">
                      <span className="text-foreground/70">Дистанция:</span>
                      <span className="font-semibold">
                        {distanceKm > 0 ? `${distanceKm.toFixed(1)} км` : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-border">
                      <span className="text-foreground/70">Время (пешком, 4 км/ч):</span>
                      <span className="font-semibold">
                        {distanceKm > 0 ? `${(distanceKm / 4).toFixed(1)} ч` : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-border">
                      <span className="text-foreground/70">Точек маршрута:</span>
                      <span className="font-semibold">{routePoints.length}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Погода на маршруте</h3>
                    {loadingWeather && (
                      <p className="text-sm text-foreground/70">
                        Загружаем прогноз...
                      </p>
                    )}
                    {!loadingWeather && !weather && (
                      <p className="text-sm text-foreground/70">
                        Постройте маршрут, чтобы увидеть прогноз.
                      </p>
                    )}
                    {weather && (
                      <div className="text-sm text-foreground/80 space-y-1">
                        <p>
                          Сегодня:{" "}
                          {weather.daily?.temperature_2m_max?.[0]}° /{" "}
                          {weather.daily?.temperature_2m_min?.[0]}°C
                        </p>
                        <p>
                          Осадки за день:{" "}
                          {weather.daily?.precipitation_sum?.[0]} мм
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Что взять с собой</h3>
                    <ul className="text-sm text-foreground/80 list-disc pl-5 space-y-1">
                      <li>Запас воды и перекус</li>
                      <li>Тёплая одежда и дождевик</li>
                      <li>Заряженный телефон и пауэрбанк</li>
                      <li>Аптечка и средства от насекомых</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <span className="text-amber-500">⚠</span> Безопасность
                    </h3>
                    <ul className="text-sm text-foreground/80 list-disc pl-5 space-y-1">
                      <li>Сообщите близким маршрут и время возвращения.</li>
                      <li>Проверьте связь и заряд перед выходом.</li>
                      <li>Не уходите с тропы и следите за прогнозом.</li>
                    </ul>
                  </div>

                  {saveError && (
                    <p className="text-xs text-red-500 mb-2">{saveError}</p>
                  )}

                  <Button
                    type="button"
                    onClick={handleSaveRoute}
                    disabled={saving || !routeGenerated}
                    className="w-full"
                  >
                    {saving ? "Сохраняем..." : "Сохранить маршрут"}
                  </Button>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card>
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border mb-4">
                    <RouteBuilderMap
                      center={mapCenter}
                      onRouteChange={handleRouteChange}
                    />
                  </div>
                  <div className="px-2 pb-2">
                    {routeGenerated ? (
                      <p className="text-sm text-foreground/70">
                        Маршрут построен. Проверьте параметры слева и сохраните его в базу Ventus.
                      </p>
                    ) : (
                      <div className="flex items-center gap-3 text-sm text-foreground/70">
                        <Ruler
                          size={24}
                          className="text-muted-foreground opacity-70"
                        />
                        <p>
                          Кликните по карте, чтобы добавить точки маршрута. После этого появится расчёт дистанции и прогноз погоды.
                        </p>
                      </div>
                    )}
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
