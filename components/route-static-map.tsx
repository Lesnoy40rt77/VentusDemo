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

export default function RouteStaticMap({ points, center }: RouteStaticMapProps) {
  const centerPos: LatLngExpression = [center.lat, center.lng]
  const polyPoints: LatLngExpression[] = points.map((p) => [p.lat, p.lng])

  return (
    <div className="w-full aspect-video rounded-lg overflow-hidden border border-border">
      <MapContainer
        center={centerPos}
        zoom={9}
        scrollWheelZoom
        className="w-full h-full"
        attributionControl={false}
      >
        <TileLayer url={MAP_TILE_URL} />

        {points.map((p, index) => (
          <CircleMarker
            key={`${p.lat}-${p.lng}-${index}`}
            center={[p.lat, p.lng]}
            radius={4}
          />
        ))}

        {points.length > 1 && <Polyline positions={polyPoints} />}
      </MapContainer>
    </div>
  )
}
