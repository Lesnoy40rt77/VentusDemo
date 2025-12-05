"use client"

import { useEffect, useMemo, useState } from "react"
import RouteStaticMap from "@/components/route-static-map"

type RoutePoint = {
  lat: number
  lng: number
}

type RouteForCarousel = {
  id: string
  title: string
  points: RoutePoint[] | null
}

interface HeroRouteCarouselProps {
  routes: RouteForCarousel[]
}

function getRouteCenter(points: RoutePoint[]): RoutePoint {
  let lat = 0
  let lng = 0

  for (const p of points) {
    lat += p.lat
    lng += p.lng
  }

  return {
    lat: lat / points.length,
    lng: lng / points.length,
  }
}

export function HeroRouteCarousel({ routes }: HeroRouteCarouselProps) {
  const [index, setIndex] = useState(0)

  const availableRoutes = useMemo(
    () => routes.filter((r) => Array.isArray(r.points) && r.points.length > 1),
    [routes],
  )

  useEffect(() => {
    if (availableRoutes.length <= 1) return

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % availableRoutes.length)
    }, 8000)

    return () => clearInterval(timer)
  }, [availableRoutes.length])

  if (availableRoutes.length === 0) {
    return (
      <div className="aspect-video bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg flex items-center justify-center text-sm text-muted-foreground">
        Нет маршрутов для предпросмотра
      </div>
    )
  }

  const current = availableRoutes[index]
  const center = current.points ? getRouteCenter(current.points) : null

  if (!center || !current.points) {
    return null
  }

  return (
    <div className="relative">
      <div className="mb-3 text-xs uppercase tracking-wide text-foreground/60">
        Пример маршрута
      </div>
      <RouteStaticMap points={current.points} center={center} />
      <div className="mt-3 text-xs text-foreground/70 flex items-center justify-between">
        <span className="font-medium truncate max-w-[75%]">
          {current.title}
        </span>
        {availableRoutes.length > 1 && (
          <span className="text-foreground/50">
            {index + 1} / {availableRoutes.length}
          </span>
        )}
      </div>
    </div>
  )
}
