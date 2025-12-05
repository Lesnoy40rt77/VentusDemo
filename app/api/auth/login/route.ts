import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { createSession } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email и пароль обязательны" },
        { status: 400 },
      )
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 400 },
      )
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 400 },
      )
    }

    const { token, expiresAt } = await createSession(user.id)

    const res = NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
    })

    res.cookies.set("session_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: expiresAt,
    })

    return res
  } catch (e) {
    console.error("LOGIN error:", e)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 },
    )
  }
}
