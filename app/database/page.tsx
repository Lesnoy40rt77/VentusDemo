"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/card"
import { Button } from "@/components/button"
import { useState } from "react"
import { MapPin, Sliders } from "lucide-react"

export default function DatabasePage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [selectedTerrain, setSelectedTerrain] = useState<string[]>([])

  const routes = [
    { name: "Озеро в горах", distance: "12 км", difficulty: "medium", terrain: "Горы", duration: "4-5 ч" },
    { name: "Лесной водопад", distance: "8 км", difficulty: "easy", terrain: "Лес", duration: "2-3 ч" },
    { name: "Вершина Кивакка", distance: "18 км", difficulty: "hard", terrain: "Горы", duration: "6-7 ч" },
    { name: "Лесная тропа к озеру", distance: "15 км", difficulty: "easy", terrain: "Вода", duration: "5-6 ч" },
    { name: "Поход по вершинам Карелии", distance: "23 км", difficulty: "hard", terrain: "Горы", duration: "3-4 ч" },
    { name: "Городская прогулка", distance: "5 км", difficulty: "easy", terrain: "Город", duration: "1-2 ч" },
  ]

  const difficultyLabels = { easy: "Лёгкий", medium: "Средний", hard: "Сложный" }
  const terrainOptions = ["Горы", "Лес", "Вода", "Город"]

  const filteredRoutes = routes.filter((route) => {
    const difficultyMatch = !selectedDifficulty || route.difficulty === selectedDifficulty
    const terrainMatch = selectedTerrain.length === 0 || selectedTerrain.includes(route.terrain)
    return difficultyMatch && terrainMatch
  })

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-secondary py-12 border-b border-border">
          <div className="max-w-7xl mx-auto px-8">
            <h1 className="text-4xl font-semibold mb-2">База треков</h1>
            <p className="text-foreground/70">Найдите идеальный маршрут для вашего следующего путешествия</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-8">
            {/* Filters */}
            <div className="mb-8 flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Sliders size={20} className="text-muted-foreground" />
                <span className="font-medium">Фильтры:</span>
              </div>

              <select
                value={selectedDifficulty || ""}
                onChange={(e) => setSelectedDifficulty(e.target.value || null)}
                className="px-4 py-2 bg-input rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Все сложности</option>
                <option value="easy">Лёгкий</option>
                <option value="medium">Средний</option>
                <option value="hard">Сложный</option>
              </select>

              <div className="flex gap-2">
                {terrainOptions.map((terrain) => (
                  <button
                    key={terrain}
                    onClick={() =>
                      setSelectedTerrain((prev) =>
                        prev.includes(terrain) ? prev.filter((t) => t !== terrain) : [...prev, terrain],
                      )
                    }
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedTerrain.includes(terrain) ? "bg-primary text-white" : "bg-muted text-foreground"
                    }`}
                  >
                    {terrain}
                  </button>
                ))}
              </div>
            </div>

            {/* Routes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredRoutes.map((route, idx) => (
                <Card key={idx}>
                  <div className="aspect-video bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg mb-4 flex items-center justify-center">
                    <MapPin size={48} className="text-muted-foreground opacity-50" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{route.name}</h3>
                  <div className="space-y-2 text-sm text-foreground/70 mb-4">
                    <div>Расстояние: {route.distance}</div>
                    <div>Время: {route.duration}</div>
                    <div>Сложность: {difficultyLabels[route.difficulty as keyof typeof difficultyLabels]}</div>
                  </div>
                  <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium mb-4">
                    {route.terrain}
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Открыть
                  </Button>
                </Card>
              ))}
            </div>

            {filteredRoutes.length === 0 && (
              <Card className="text-center py-12">
                <MapPin size={48} className="text-muted-foreground opacity-30 mx-auto mb-4" />
                <p className="text-foreground/70">Маршруты не найдены. Попробуйте изменить фильтры</p>
              </Card>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
