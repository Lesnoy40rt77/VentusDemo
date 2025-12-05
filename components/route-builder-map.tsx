"use client"

import { useEffect, useMemo, useState } from "react"
import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  useMapEvents,
  useMap,
} from "react-leaflet"
import type { LeafletMouseEvent } from "leaflet"
import "leaflet/dist/leaflet.css"
import { MAP_TILE_URL } from "@/lib/mapConfig"

type LatLng = { lat: number; lng: number }

interface RouteBuilderMapProps {
  center: LatLng
  onRouteChange?: (points: LatLng[]) => void
}

function ClickHandler({ onClick }: { onClick: (event: LeafletMouseEvent) => void }) {
  useMapEvents({
    click: (event) => onClick(event),
  })
  return null
}

function MapCenterUpdater({ center }: { center: LatLng }) {
  const map = useMap()

  useEffect(() => {
    map.setView([center.lat, center.lng])
  }, [center, map])

  return null
}

function smoothRoute(points: LatLng[]): LatLng[] {
  if (points.length <= 2) return points

  const smoothed: LatLng[] = [points[0]]

  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const next = points[i + 1]

    smoothed.push({
      lat: (prev.lat + curr.lat + next.lat) / 3,
      lng: (prev.lng + curr.lng + next.lng) / 3,
    })
  }

  smoothed.push(points[points.length - 1])
  return smoothed
}

export default function RouteBuilderMap({ center, onRouteChange }: RouteBuilderMapProps) {
  const [viaPoints, setViaPoints] = useState<LatLng[]>([])
  const [routeLine, setRouteLine] = useState<LatLng[]>([])
  const [loading, setLoading] = useState(false)

  const smoothedRouteLine = useMemo(() => smoothRoute(routeLine), [routeLine])

  const recalcRoute = async (points: LatLng[]) => {
    if (points.length < 2) {
      setRouteLine(points)
      onRouteChange?.(points)
      return
    }

    try {
      setLoading(true)
      const res = await fetch("/api/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ points }),
      })
      const data = await res.json()

      const geom =
        data?.features?.[0]?.geometry?.coordinates as [number, number][] | undefined

      if (!geom) return

      const line = geom.map(([lon, lat]) => ({ lat, lng: lon }))
      setRouteLine(line)
      onRouteChange?.(line)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleMapClick = async (event: LeafletMouseEvent) => {
    const newPoint = { lat: event.latlng.lat, lng: event.latlng.lng }
    const nextVia = [...viaPoints, newPoint]
    setViaPoints(nextVia)
    await recalcRoute(nextVia)
  }

  const handleReset = () => {
    setViaPoints([])
    setRouteLine([])
    onRouteChange?.([])
  }

  return (
    <div className="space-y-2">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={8}
          scrollWheelZoom
          className="w-full h-full"
          attributionControl={false}
        >
          <TileLayer url={MAP_TILE_URL} />

          <MapCenterUpdater center={center} />
          <ClickHandler onClick={handleMapClick} />

          {viaPoints.map((p, index) => (
            <CircleMarker
              key={`${p.lat}-${p.lng}-${index}`}
              center={[p.lat, p.lng]}
              radius={3}
            />
          ))}

          {smoothedRouteLine.length > 0 && (
            <Polyline
              positions={smoothedRouteLine.map((p) => [p.lat, p.lng])}
              weight={4}
              smoothFactor={1}
              lineCap="round"
              lineJoin="round"
            />
          )}
        </MapContainer>

        {loading && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center text-xs">
            Строим маршрут...
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <button
          type="button"
          onClick={handleReset}
          className="underline underline-offset-4 hover:text-foreground text-xs"
        >
          Очистить маршрут
        </button>
      </div>

      <div className="text-[10px] text-muted-foreground">
        Карта: © Thunderforest, © OpenStreetMap contributors
      </div>
    </div>
  )
}
