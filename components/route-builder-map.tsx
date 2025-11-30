"use client"

import { useEffect, useState } from "react"
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
    map.setView([center.lat, center.lng], map.getZoom())
  }, [center.lat, center.lng, map])
  return null
}

export default function RouteBuilderMap({ center, onRouteChange }: RouteBuilderMapProps) {
  const [viaPoints, setViaPoints] = useState<LatLng[]>([])
  const [routeLine, setRouteLine] = useState<LatLng[]>([])
  const [loading, setLoading] = useState(false)

  const recalcRoute = async (nextVia: LatLng[]) => {
    if (nextVia.length < 2) {
      setRouteLine([])
      onRouteChange?.([])
      return
    }

    try {
      setLoading(true)

      const coordinates = nextVia.map((p) => [p.lng, p.lat])

      const res = await fetch("/api/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coordinates,
          profile: "foot-hiking",
        }),
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
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <MapCenterUpdater center={center} />
          <ClickHandler onClick={handleMapClick} />

          {viaPoints.map((p, index) => (
            <CircleMarker key={`${p.lat}-${p.lng}-${index}`} center={[p.lat, p.lng]} radius={5} />
          ))}

          {routeLine.length > 0 && (
            <Polyline positions={routeLine.map((p) => [p.lat, p.lng])} />
          )}
        </MapContainer>
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
