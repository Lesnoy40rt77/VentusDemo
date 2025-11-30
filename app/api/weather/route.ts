import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const lat = parseFloat(searchParams.get("lat") || "")
    const lng = parseFloat(searchParams.get("lng") || "")

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json(
        { error: "Invalid coordinates" },
        { status: 400 },
      )
    }

    const url = new URL("https://api.open-meteo.com/v1/forecast")
    url.searchParams.set("latitude", lat.toString())
    url.searchParams.set("longitude", lng.toString())
    url.searchParams.set("hourly", "temperature_2m,precipitation,wind_speed_10m")
    url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,precipitation_sum")
    url.searchParams.set("timezone", "auto")

    const res = await fetch(url.toString(), { cache: "no-store" })

    if (!res.ok) {
      const t = await res.text()
      console.error("Weather upstream error:", res.status, t.slice(0, 200))
      return NextResponse.json(
        { error: "Weather upstream error" },
        { status: 502 },
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (e: any) {
    console.error(e)
    return NextResponse.json(
      { error: "Server error", details: e?.message ?? "unknown" },
      { status: 500 },
    )
  }
}
