import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const rawBody = (await req.json()) as any

    let coordinates: [number, number][] | undefined
    let profile: string | undefined = rawBody?.profile

    if (Array.isArray(rawBody?.coordinates)) {
      coordinates = rawBody.coordinates as [number, number][]
    }

    if (!coordinates && Array.isArray(rawBody?.points)) {
      const pts = rawBody.points as any[]

      const normalized = pts
        .map((p) => {
          if (!p) return null

          // [lat, lng]
          if (Array.isArray(p) && p.length >= 2) {
            const [latRaw, lngRaw] = p
            const lat = Number(latRaw)
            const lng = Number(lngRaw)
            if (Number.isFinite(lat) && Number.isFinite(lng)) {
              return { lat, lng }
            }
            return null
          }

          // { lat, lng }
          if (typeof p === "object") {
            const lat = Number((p as any).lat)
            const lng = Number((p as any).lng)
            if (Number.isFinite(lat) && Number.isFinite(lng)) {
              return { lat, lng }
            }
          }

          return null
        })
        .filter((p): p is { lat: number; lng: number } => !!p)

      if (normalized.length >= 2) {
        coordinates = normalized.map(
          (p) => [p.lng, p.lat] as [number, number],
        )
      }
    }

    if (!coordinates || coordinates.length < 2) {
      return NextResponse.json(
        { error: "Need at least two coordinates" },
        { status: 400 },
      )
    }

    const apiKey = process.env.ORS_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing ORS_API_KEY" },
        { status: 500 },
      )
    }

    const profileName = profile || "foot-hiking"

    const res = await fetch(
      `https://api.openrouteservice.org/v2/directions/${profileName}/geojson`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: apiKey,
        },
        body: JSON.stringify({ coordinates }),
      },
    )

    if (!res.ok) {
      const text = await res.text()
      console.error("ORS error:", res.status, text)
      return NextResponse.json(
        { error: "ORS request failed", details: text },
        { status: 500 },
      )
    }

    const data = await res.json()
    console.log("ORS response sample:", JSON.stringify(data, null, 2))
    return NextResponse.json(data)
  } catch (e: unknown) {
    console.error(e)
    const message = e instanceof Error ? e.message : "unknown"
    return NextResponse.json(
      { error: "Server error", details: message },
      { status: 500 },
    )
  }
}
