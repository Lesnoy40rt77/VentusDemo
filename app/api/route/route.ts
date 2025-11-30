// app/api/route/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { coordinates, profile } = body as {
      coordinates: [number, number][] // [lon, lat]
      profile?: string
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

    const orsProfile = profile ?? "foot-hiking"

    const res = await fetch(
        `https://api.openrouteservice.org/v2/directions/${orsProfile}/geojson`, // вот так ✅
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
    console.log("ORS response sample:", JSON.stringify(data, null, 2)) // TODO DEBUG ВРЕМЕННО: Логи для ответов маршрута
    return NextResponse.json(data)
  } catch (e: any) {
    console.error(e)
    return NextResponse.json(
      { error: "Server error", details: e?.message },
      { status: 500 },
    )
  }
}
