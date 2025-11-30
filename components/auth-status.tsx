"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type MeResponse = {
  user: { id: string; email: string; name: string | null } | null
}

export function AuthStatus() {
  const [user, setUser] = useState<MeResponse["user"] | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const run = async () => {
        try {
        const res = await fetch("/api/auth/me", { cache: "no-store" })

        if (!res.ok) {
            console.error("AuthStatus /api/auth/me status", res.status)
            setUser(null)
            setLoaded(true)
            return
        }

        let data: MeResponse | null = null
        try {
            data = (await res.json()) as MeResponse
        } catch (e) {
            console.error("AuthStatus parse error", e)
            setUser(null)
            setLoaded(true)
            return
        }

        setUser(data.user)
        } catch (e) {
        console.error("AuthStatus fetch error", e)
        setUser(null)
        } finally {
        setLoaded(true)
        }
    }
    run()
    }, [])


  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
    } catch (e) {
      console.error(e)
    }
  }

  if (!loaded) {
    return (
      <span className="text-xs text-foreground/60">...</span>
    )
  }

  if (!user) {
    return (
      <Link
        href="/auth"
        className="px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-opacity-90 transition-all text-sm"
      >
        Войти
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/dashboard"
        className="text-sm text-foreground/80 hover:text-primary"
      >
        {user.name || user.email}
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        className="text-xs text-foreground/60 hover:text-foreground"
      >
        Выйти
      </button>
    </div>
  )
}
