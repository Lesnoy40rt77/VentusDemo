"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/card"
import { Button } from "@/components/button"

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const params = useSearchParams()
  const next = params.get("next") || "/dashboard"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email || !password || (mode === "register" && !name.trim())) {
      setError("Заполните все поля")
      return
    }

    try {
      setLoading(true)
      const res = await fetch(
        mode === "login" ? "/api/auth/login" : "/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name: name.trim() || null, password }),
        },
      )

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Ошибка авторизации")
        return
      }

      router.push(next)
    } catch (e) {
      console.error(e)
      setError("Ошибка сети")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-6">
          <div className="mb-6 flex gap-4 border-b border-border pb-4">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`text-sm font-medium pb-1 border-b-2 ${
                mode === "login"
                  ? "border-primary text-primary"
                  : "border-transparent text-foreground/60"
              }`}
            >
              Вход
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`text-sm font-medium pb-1 border-b-2 ${
                mode === "register"
                  ? "border-primary text-primary"
                  : "border-transparent text-foreground/60"
              }`}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                placeholder="you@example.com"
              />
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Имя
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  placeholder="Как вас подписать в приложении"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full mt-2"
              disabled={loading}
            >
              {loading
                ? "Загружаем..."
                : mode === "login"
                ? "Войти"
                : "Зарегистрироваться"}
            </Button>
          </form>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
