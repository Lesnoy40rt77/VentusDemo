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
          setError("нет данных")
          return
        }

        const json = await res.json()

        const temperature =
          json.current?.temperature ??
          json.temperature ??
          json.current?.temp ??
          null

        const description =
          json.current?.description ??
          json.description ??
          json.current?.summary ??
          "Погода"

        if (temperature == null) {
          setError("нет данных")
          return
        }

        setData({
          temperature,
          description,
        })
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
