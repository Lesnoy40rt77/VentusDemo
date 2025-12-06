"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/card"
import { Button } from "@/components/button"
import { MessageCircle, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type Author = {
  id: string
  name: string | null
}

type Post = {
  id: string
  title: string
  content: string
  createdAt: string
  imageUrl: string | null
  author: Author
  route?: {
    id: string
    title: string
  } | null
}

interface Props {
  routeId: string
  initialPosts: Post[]
}

export default function RouteDiscussionClient({ routeId, initialPosts }: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [creating, setCreating] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    let cancelled = false

    async function loadMe() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" })
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled) {
          setCurrentUserId(data.user?.id ?? null)
        }
      } catch {
      }
    }

    loadMe()

    return () => {
      cancelled = true
    }
  }, [])

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim() || !content.trim()) {
      setError("Заполните заголовок и текст")
      return
    }

    try {
      setCreating(true)

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          routeId,
        }),
      })

      const data = await res.json()

      if (res.status === 401) {
        router.push(`/auth/login?next=/route/${routeId}`)
        return
      }

      if (!res.ok) {
        setError(data.error || "Не удалось создать пост")
        return
      }

      const newPost: Post = {
        id: data.id,
        title: data.title,
        content: data.content,
        createdAt: data.createdAt,
        imageUrl: data.imageUrl ?? null,
        author: data.author ?? {
          id: "",
          name: "Автор",
        },
        route: data.route ?? null,
      }

      setPosts((prev) => [newPost, ...prev])
      setTitle("")
      setContent("")
    } catch (e) {
      console.error("Create route post error", e)
      setError("Ошибка при создании поста")
    } finally {
      setCreating(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    setError(null)

    const confirmed = window.confirm("Удалить этот пост?")
    if (!confirmed) return

    try {
      setDeletingId(postId)

      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data.error || "Не удалось удалить пост")
        return
      }

      setPosts((prev) => prev.filter((p) => p.id !== postId))
    } catch (e) {
      console.error("Delete route post error", e)
      setError("Ошибка при удалении поста")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Обсуждение маршрута</h2>
        <Link
          href="/community"
          className="text-xs text-foreground/60 hover:text-foreground underline underline-offset-4"
        >
          Открыть сообщество
        </Link>
      </div>

      {/* форма нового поста */}
      <form onSubmit={handleCreatePost} className="space-y-3">
        <div>
          <label className="block text-xs font-medium mb-1">
            Заголовок поста
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            placeholder="Например, Как прошёл наш поход по этому маршруту"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Текст</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-primary text-sm min-h-[80px] resize-y"
            placeholder="Поделитесь впечатлениями, сложностями и советами для других"
          />
        </div>

        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}

        <Button
          type="submit"
          className="w-full text-sm"
          disabled={creating}
        >
          {creating ? "Публикуем..." : "Опубликовать пост о маршруте"}
        </Button>
      </form>

      {/* список постов */}
      <div className="space-y-3 pt-2 border-t border-border/60">
        {posts.length === 0 ? (
          <p className="text-xs text-foreground/60">
            Пока никто не оставил постов об этом маршруте.
            Будьте первым!
          </p>
        ) : (
          posts.map((post) => {
            const canDelete =
              currentUserId != null && currentUserId === post.author.id

            return (
              <div
                key={post.id}
                className="flex items-start gap-3 pb-2 border-b border-border/40 last:border-0"
              >
                <div className="mt-1">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-medium text-foreground/80">
                        {post.author?.name ?? "Автор"}
                      </p>
                      <p className="text-[10px] text-foreground/50">
                        {new Date(post.createdAt).toLocaleString("ru-RU", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    {canDelete && (
                      <Button
                        type="button"
                        variant="outline"
                        className="h-7 w-7 p-0 border-red-500/60 text-red-500 hover:bg-red-500/10 flex items-center justify-center"
                        onClick={() => handleDeletePost(post.id)}
                        disabled={deletingId === post.id}
                        title="Удалить пост"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>

                  <div className="mt-0.5">
                    <p className="text-xs font-semibold mb-0.5">
                      {post.title}
                    </p>
                    <p className="text-xs text-foreground/80">
                      {post.content}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </Card>
  )
}
