import { cookies } from "next/headers"
import { prisma } from "./db"
import { randomBytes } from "crypto"

const SESSION_COOKIE_NAME = "session_token"
const SESSION_TTL_HOURS = 24

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + SESSION_TTL_HOURS * 60 * 60 * 1000)

  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  })

  const cookieStore = cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_HOURS * 60 * 60,
  })
}

export async function destroySession() {
  const cookieStore = cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (token) {
    await prisma.session.deleteMany({ where: { token } })
    cookieStore.set(SESSION_COOKIE_NAME, "", { maxAge: 0, path: "/" })
  }
}

export async function getCurrentUser() {
  const cookieStore = cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null

  const session = await prisma.session.findFirst({
    where: {
      token,
      expiresAt: { gt: new Date() },
    },
    include: {
      user: true,
    },
  })

  if (!session) return null
  return session.user
}