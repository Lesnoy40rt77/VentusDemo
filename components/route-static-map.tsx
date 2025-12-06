"use client"

import dynamic from "next/dynamic"
import type { RouteStaticMapProps } from "./route-static-map-client"

const RouteStaticMap = dynamic<RouteStaticMapProps>(
  () => import("./route-static-map-client"),
  {
    ssr: false,
  },
)

export default RouteStaticMap
