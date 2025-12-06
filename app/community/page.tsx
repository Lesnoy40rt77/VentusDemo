"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/card"
import { Button } from "@/components/button"
import { Heart, MessageCircle, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

type Post = {
  id: string
  title: string
  content: string
  createdAt: string
  imageUrl: string | null
  author: { id: string; name: string | null }
  route?: { id: string; title: string } | null
  _count: { comments: number; likes: number }
  likedByMe: boolean
  canDelete: boolean
}

type Comment = {
  id: string
  content: string
  createdAt: string
  author: { id: string; name: string | null }
}


export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [postImageUrl, setPostImageUrl] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentsError, setCommentsError] = useState<string | null>(null)
  const [commentText, setCommentText] = useState("")
  const [commentSubmitting, setCommentSubmitting] = useState(false)

  const handlePostImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageError(null)
    setUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()

      if (!res.ok) {
        setImageError(data.error || "Не удалось загрузить файл")
        return
      }

      setPostImageUrl(data.url)
    } catch {
      setImageError("Ошибка загрузки файла")
    } finally {
      setUploadingImage(false)
    }
  }

  const loadPosts = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/posts", { cache: "no-store" })
      const data = await res.json()
      setPosts(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const handleToggleLike = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      })

      if (res.status === 401) {
        window.location.href = "/auth?next=/community"
        return
      }

      if (!res.ok) {
        console.error("Toggle like error:", res.status)
        return
      }

      const data = (await res.json()) as {
        liked: boolean
        likesCount: number
      }

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                likedByMe: data.liked,
                _count: { ...p._count, likes: data.likesCount },
              }
            : p,
        ),
      )
    } catch (e) {
      console.error("Toggle like error:", e)
    }
  }

  const handleDeletePost = async (postId: string) => {
    const confirmDelete = window.confirm(
      "Точно удалить этот пост? Отменить будет нельзя.",
    )
    if (!confirmDelete) return

    try {
      const res = await fetch(`/api/posts/${postId}/delete`, {
        method: "POST",
      })

      if (res.status === 401) {
        window.location.href = "/auth?next=/community"
        return
      }

      if (!res.ok) {
        console.error("Delete post error:", res.status)
        return
      }

      setPosts((prev) => prev.filter((p) => p.id !== postId))
    } catch (e) {
      console.error("Delete post error:", e)
    }
  }

  const handleToggleComments = async (postId: string) => {
    if (activeCommentsPostId === postId) {
      setActiveCommentsPostId(null)
      setComments([])
      setCommentsError(null)
      setCommentText("")
      return
    }

    setActiveCommentsPostId(postId)
    setComments([])
    setCommentsError(null)
    setCommentText("")
    setCommentsLoading(true)

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        cache: "no-store",
      })

      if (!res.ok) {
        console.error("Load comments error:", res.status)
        setCommentsError("Не удалось загрузить комментарии")
        return
      }

      const data = (await res.json()) as Comment[]
      setComments(data)
    } catch (err) {
      console.error("Load comments error:", err)
      setCommentsError("Ошибка загрузки комментариев")
    } finally {
      setCommentsLoading(false)
    }
  }

  const handleSubmitComment = async (postId: string) => {
    if (!commentText.trim()) return

    setCommentsError(null)
    setCommentSubmitting(true)

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: commentText.trim() }),
      })

      if (res.status === 401) {
        window.location.href = "/auth?next=/community"
        return
      }

      if (!res.ok) {
        console.error("Create comment error:", res.status)
        setCommentsError("Не удалось отправить комментарий")
        return
      }

      const newComment = (await res.json()) as Comment

      setComments((prev) => [...prev, newComment])
      setCommentText("")

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                _count: {
                  ...p._count,
                  comments: p._count.comments + 1,
                },
              }
            : p,
        ),
      )
    } catch (err) {
      console.error("Create comment error:", err)
      setCommentsError("Ошибка отправки комментария")
    } finally {
      setCommentSubmitting(false)
    }
  }


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
          imageUrl: postImageUrl,
          routeId: null, // TODO:позже можно привязать к конкретному маршруту
        }),
      })
      const data = await res.json()
      if (res.status === 401) {
        window.location.href = "/auth?next=/community"
        return
      }
      if (!res.ok) {
        setError(data.error || "Не удалось создать пост")
        return
      }
      setTitle("")
      setContent("")
      setPostImageUrl(null)
      await loadPosts()
    } catch (e) {
      console.error(e)
      setError("Ошибка при создании поста")
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-secondary py-12 border-b border-border">
          <div className="max-w-7xl mx-auto px-8">
            <h1 className="text-4xl font-semibold mb-2">Сообщество</h1>
            <p className="text-foreground/70">
              Обсуждайте маршруты, делитесь впечатлениями и находите новые идеи.
            </p>
          </div>
        </section>

        <section className="py-10">
          <div className="max-w-4xl mx-auto px-8 space-y-8">
            {/* форма нового поста */}
            <Card className="p-5">
              <form onSubmit={handleCreatePost} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Заголовок
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    placeholder="Например, Как прошёл наш первый поход"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Текст
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary text-sm min-h-[100px]"
                    placeholder="Расскажите о маршруте, погоде, трудностях и советах."
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Фото (опционально)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePostImageChange}
                    className="block w-full text-xs text-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-secondary file:text-foreground hover:file:bg-secondary/80"
                  />
                  {uploadingImage && (
                    <p className="text-xs text-foreground/60">
                      Загружаем изображение...
                    </p>
                  )}
                  {imageError && (
                    <p className="text-xs text-red-500">{imageError}</p>
                  )}
                </div>
                {error && (
                  <p className="text-xs text-red-500">{error}</p>
                )}
                <Button type="submit" disabled={creating} className="w-full">
                  {creating ? "Публикуем..." : "Опубликовать пост"}
                </Button>
              </form>
            </Card>

            {/* список постов */}
            {loading && (
              <p className="text-sm text-foreground/70">
                Загружаем посты...
              </p>
            )}

            {!loading && posts.length === 0 && (
              <p className="text-sm text-foreground/70">
                Пока постов нет. Станьте первым, кто поделится опытом!
              </p>
            )}

            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id} className="p-5">
                  {post.imageUrl && (
                    <div className="mb-3 overflow-hidden rounded-lg border border-border bg-black/5 flex items-center justify-center">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="max-h-64 w-auto object-contain"
                      />
                    </div>
                  )}

                  <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm">
                      {post.author.name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <div>
                          <h2 className="font-semibold text-sm">
                            {post.author.name || "Аноним"}
                          </h2>
                          <p className="text-xs text-foreground/60">
                            {new Date(post.createdAt).toLocaleString("ru-RU", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <h3 className="font-semibold text-base mb-1">
                        {post.title}
                      </h3>
                      <p className="text-sm text-foreground/80 mb-3">
                        {post.content}
                      </p>
                      {post.route && (
                        <Link
                          href={`/route/${post.route.id}`}
                          className="text-xs text-primary underline"
                        >
                          Перейти к маршруту: {post.route.title}
                        </Link>
                      )}
                      <div className="mt-3 flex items-center gap-4 text-xs text-foreground/60">
                        <button
                          type="button"
                          onClick={() => handleToggleLike(post.id)}
                          className={`flex items-center gap-1 hover:text-foreground ${
                            post.likedByMe ? "text-red-500" : ""
                          }`}
                        >
                          <Heart
                            size={14}
                            className={post.likedByMe ? "fill-current" : ""}
                          />
                          {post._count.likes > 0
                            ? `Нравится (${post._count.likes})`
                            : "Нравится"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleComments(post.id)}
                          className="flex items-center gap-1 hover:text-foreground"
                        >
                          <MessageCircle size={14} />
                          Комментарии ({post._count.comments})
                        </button>

                        {post.canDelete && (
                          <button
                            type="button"
                            onClick={() => handleDeletePost(post.id)}
                            className="flex items-center gap-1 hover:text-foreground"
                          >
                            <Trash size={14} />
                            Удалить
                          </button>
                        )}
                      </div>
                      {activeCommentsPostId === post.id && (
                        <div className="mt-3 border-t border-border pt-3 space-y-3">
                          {commentsError && (
                            <p className="text-xs text-red-500">
                              {commentsError}
                            </p>
                          )}

                          {commentsLoading ? (
                            <p className="text-xs text-foreground/60">
                              Загружаем комментарии...
                            </p>
                          ) : comments.length === 0 ? (
                            <p className="text-xs text-foreground/60">
                              Пока комментариев нет. Напишите первый!
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {comments.map((comment) => (
                                <div key={comment.id} className="text-xs">
                                  <div className="flex justify-between">
                                    <span className="font-medium">
                                      {comment.author.name || "Аноним"}
                                    </span>
                                    <span className="text-foreground/60">
                                      {new Date(
                                        comment.createdAt,
                                      ).toLocaleString("ru-RU", {
                                        day: "2-digit",
                                        month: "short",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </div>
                                  <p className="text-foreground/80">
                                    {comment.content}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          <form
                            onSubmit={(e) => {
                              e.preventDefault()
                              void handleSubmitComment(post.id)
                            }}
                            className="flex gap-2"
                          >
                            <input
                              type="text"
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              className="flex-1 px-3 py-1.5 rounded-md border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="Напишите комментарий…"
                            />
                            <Button
                              type="submit"
                              disabled={
                                commentSubmitting || !commentText.trim()
                              }
                              className="px-3 py-1.5 text-xs"
                            >
                              {commentSubmitting ? "Отправляем..." : "Отправить"}
                            </Button>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
