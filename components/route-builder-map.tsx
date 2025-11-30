"use client"

import { useState } from "react"
import { MapContainer, TileLayer, Polyline, CircleMarker, useMapEvents } from "react-leaflet"
import type { LeafletMouseEvent } from "leaflet"
import "leaflet/dist/leaflet.css"

type LatLng = { lat: number; lng: number }

interface RouteBuilderMapProps {
  onRouteChange?: (points: LatLng[]) => void
}

// Центральная точка — можешь поменять на свой регион
const DEFAULT_CENTER: LatLng = { lat: 61.78, lng: 34.35 } // условная Карелия

function ClickHandler({ onClick }: { onClick: (event: LeafletMouseEvent) => void }) {
  useMapEvents({
    click: (event) => {
      onClick(event)
    },
  })

  return null
}

export default function RouteBuilderMap({ onRouteChange }: RouteBuilderMapProps) {
  const [points, setPoints] = useState<LatLng[]>([])

  const handleMapClick = (event: LeafletMouseEvent) => {
    const nextPoints = [...points, { lat: event.latlng.lat, lng: event.latlng.lng }]
    setPoints(nextPoints)
    onRouteChange?.(nextPoints)
  }

  const handleReset = () => {
    setPoints([])
    onRouteChange?.([])
  }

  return (
    <div className="space-y-3">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border">
        <MapContainer
          center={[DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]}
          zoom={8}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          <ClickHandler onClick={handleMapClick} />

          {points.length > 0 && (
            <>
              <Polyline positions={points.map((p) => [p.lat, p.lng])} />

              {points.map((p, index) => (
                <CircleMarker
                  key={`${p.lat}-${p.lng}-${index}`}
                  center={[p.lat, p.lng]}
                  radius={5}
                  pathOptions={{ color: "#22c55e", fillColor: "#22c55e" }} // Tailwind: можно убрать цвет, если надо только по умолчанию
                />
              ))}
            </>
          )}
        </MapContainer>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Точек на маршруте: {points.length}</span>
        <button
          type="button"
          onClick={handleReset}
          className="underline underline-offset-4 hover:text-foreground"
        >
          Очистить маршрут
        </button>
      </div>
    </div>
  )
}
