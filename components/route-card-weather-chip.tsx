"use client"

import { useEffect, useState } from "react"

type Point = { lat: number; lng: number }

type Props = {
  points: Point[] | null
}

type WeatherSummary = {
  temperature: number
  description: string
}

type WeatherDaily = {
  temperature_2m_max?: number[]
  temperature_2m_min?: number[]
  precipitation_sum?: number[]
}

type WeatherApiResponse = {
  daily?: WeatherDaily
}

export function RouteCardWeatherChip({ points }: Props) {
  const [data, setData] = useState<WeatherSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!points || points.length === 0) {
      return
    }

    const start = points[0]

    async function load() {
      try {
        setLoading(true)
      setError(null)

        const res = await fetch(
          `/api/weather?lat=${start.lat}&lng=${start.lng}`,
          { cache: "no-store" },
        )

        if (!res.ok) {
          console.error("RouteCardWeatherChip /api/weather status", res.status)
          setError("нет данных")
          return
        }

        const json = (await res.json()) as WeatherApiResponse

        const max = json.daily?.temperature_2m_max?.[0] ?? null
        const min = json.daily?.temperature_2m_min?.[0] ?? null
        const precip = json.daily?.precipitation_sum?.[0] ?? null

        const temperature = max ?? min

        if (temperature == null) {
          setError("нет данных")
          return
        }

        let description = "Погода"

        if (precip != null) {
          if (precip < 0.1) {
            description = "Без осадков"
          } else if (precip < 2) {
            description = `Небольшие осадки (~${precip.toFixed(1)} мм)`
          } else {
            description = `Осадки, ~${precip.toFixed(1)} мм`
          }
        }

        setData({
          temperature,
          description,
        })
        setError(null)
      } catch (e) {
        setError("ошибка")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [points])

  if (!points || points.length === 0) {
    return null
  }

  if (loading && !data) {
    return (
      <div className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground mb-2">
        {/* Скелетон / лоадер */}
        Обновляем погоду…
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground mb-2">
        Погода недоступна
      </div>
    )
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] text-foreground mb-2">
      <span>{Math.round(data.temperature)}°C</span>
      <span className="text-muted-foreground">· {data.description}</span>
    </div>
  )
}
