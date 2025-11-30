// app/api/geocode/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const qRaw = searchParams.get("q")

    const q = qRaw?.trim()
    console.log("[GEOCODE] q =", q)

    if (!q) {
      return NextResponse.json({ results: [] })
    }

    const url = new URL("https://nominatim.openstreetmap.org/search")
    url.searchParams.set("format", "jsonv2")
    url.searchParams.set("q", q)
    url.searchParams.set("limit", "5")

    const upstream = await fetch(url.toString(), {
      headers: {
        // 👇 СЮДА ВПИШИ СВОЙ email или домен, по правилам Nominatim
        "User-Agent": "VentusDemo/1.0 (ventus@example.com)",
        "Accept-Language": "ru",
      },
      cache: "no-store",
    })

    const text = await upstream.text()
    console.log("[GEOCODE] upstream status =", upstream.status)

    // Если вообще не JSON (HTML-ошибка, капча и т.п.)
    let raw: any
    try {
      raw = JSON.parse(text)
    } catch {
      console.error("[GEOCODE] Nominatim non-JSON:", text.slice(0, 200))
      return NextResponse.json(
        {
          error: "Upstream did not return JSON",
          status: upstream.status,
        },
        { status: 502 },
      )
    }

    // Часто при ошибках Nominatim шлёт объект, а не массив
    if (!Array.isArray(raw)) {
      console.error("[GEOCODE] Nominatim returned non-array:", raw)
      return NextResponse.json(
        {
          error: "Bad response from Nominatim",
          status: upstream.status,
          raw,
        },
        { status: 502 },
      )
    }

    const results = raw.map((item: any) => ({
      displayName: item.display_name as string,
      lat: parseFloat(item.lat as string),
      lng: parseFloat(item.lon as string),
    }))

    console.log("[GEOCODE] results count =", results.length)

    return NextResponse.json({ results })
  } catch (e: any) {
    console.error("[GEOCODE] Internal error:", e)
    return NextResponse.json(
      {
        error: "Internal error",
        details: e?.message ?? "unknown",
      },
      { status: 500 },
    )
  }
}
