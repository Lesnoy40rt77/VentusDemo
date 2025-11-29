"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/card"
import { Button } from "@/components/button"
import { Heart, MessageCircle, Share2 } from "lucide-react"

export default function CommunityPage() {
  const posts = [
    {
      id: 1,
      author: "Анна М.",
      avatar: "👤",
      content: "Только закончила маршрут в Карелии! Невероятные виды и погода была идеальной.",
      tags: ["Карелия", "Летний тур"],
      image: true,
      likes: 24,
      comments: 5,
    },
    {
      id: 2,
      author: "Иван П.",
      avatar: "👤",
      content: "Совет: всегда берите с собой больше воды, чем думаете. Спасло мне жизнь на вчерашнем маршруте!",
      tags: ["Советы", "Безопасность"],
      image: false,
      likes: 42,
      comments: 12,
    },
    {
      id: 3,
      author: "Мария Л.",
      avatar: "👤",
      content: "Нашла новый скрытый маршрут! Идеально для начинающих, красивый лес и речка.",
      tags: ["Новый маршрут", "Лёгкий"],
      image: true,
      likes: 18,
      comments: 8,
    },
  ]

  const recommendedRoutes = [
    { name: "Озеро в горах", users: "342 прошли" },
    { name: "Лесной водопад", users: "156 прошли" },
    { name: "Вершина Кивакка", users: "89 прошли" },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-secondary py-12 border-b border-border">
          <div className="max-w-7xl mx-auto px-8">
            <h1 className="text-4xl font-semibold mb-2">Сообщество</h1>
            <p className="text-foreground/70">Делитесь опытом с другими путешественниками</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Feed */}
            <div className="lg:col-span-2 space-y-6">
              {posts.map((post) => (
                <Card key={post.id}>
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg">
                        {post.avatar}
                      </div>
                      <div>
                        <h4 className="font-semibold">{post.author}</h4>
                        <p className="text-sm text-foreground/70">2 часа назад</p>
                      </div>
                    </div>
                    <button className="text-foreground/50 hover:text-foreground transition">⋯</button>
                  </div>

                  {/* Post Content */}
                  <p className="text-foreground mb-4">{post.content}</p>

                  {/* Image Placeholder */}
                  {post.image && (
                    <div className="aspect-video bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg mb-4" />
                  )}

                  {/* Tags */}
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {post.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-secondary text-primary text-sm rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <button className="flex items-center gap-2 text-foreground/60 hover:text-primary transition">
                      <Heart size={18} />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-foreground/60 hover:text-primary transition">
                      <MessageCircle size={18} />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-foreground/60 hover:text-primary transition">
                      <Share2 size={18} />
                    </button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Sidebar */}
            <div>
              <Card>
                <h3 className="text-xl font-semibold mb-6">Рекомендуемые маршруты</h3>
                <div className="space-y-4">
                  {recommendedRoutes.map((route, idx) => (
                    <div key={idx} className="pb-4 border-b border-border last:border-b-0">
                      <h4 className="font-semibold text-sm mb-1">{route.name}</h4>
                      <p className="text-xs text-foreground/60 mb-2">{route.users}</p>
                      <Button variant="outline" className="w-full text-sm py-1 bg-transparent">
                        Посмотреть
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
