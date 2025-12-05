"use client"

import { MapContainer, TileLayer, Polyline, CircleMarker } from "react-leaflet"
import type { LatLngExpression } from "leaflet"
import "leaflet/dist/leaflet.css"
import { MAP_TILE_URL } from "@/lib/mapConfig"

type LatLng = { lat: number; lng: number }

interface RouteStaticMapProps {
  points: LatLng[]
  center: LatLng
}

function smoothPath(points: LatLng[]): LatLng[] {
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

export default function RouteStaticMap({ points, center }: RouteStaticMapProps) {
  const centerPos: LatLngExpression = [center.lat, center.lng]
  const smoothedPoints = smoothPath(points)
  const polyPoints: LatLngExpression[] = smoothedPoints.map((p) => [p.lat, p.lng])

  return (
    <div className="w-full aspect-video rounded-lg overflow-hidden border border-border">
      <MapContainer
        center={centerPos}
        zoom={9}
        scrollWheelZoom={false}
        className="w-full h-full"
        attributionControl={false}
      >
        <TileLayer url={MAP_TILE_URL} />

        {smoothedPoints.map((p, index) => (
          <CircleMarker
            key={`${p.lat}-${p.lng}-${index}`}
            center={[p.lat, p.lng]}
            radius={2}
          />
        ))}

        {smoothedPoints.length > 1 && (
          <Polyline
            positions={polyPoints}
            weight={4}
            smoothFactor={1}
            lineCap="round"
            lineJoin="round"
          />
        )}
      </MapContainer>
    </div>
  )
}
