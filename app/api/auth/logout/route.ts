import { NextResponse } from "next/server"
import { destroySession } from "@/lib/auth"

export async function POST() {
  await destroySession()

  const res = NextResponse.json({ ok: true })

  res.cookies.set("session_token", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  })

  return res
}
