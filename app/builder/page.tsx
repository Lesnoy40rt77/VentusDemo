"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { useState } from "react"
import { MapPin, Ruler } from "lucide-react"
import dynamic from "next/dynamic"

const RouteBuilderMap = dynamic(() => import("@/components/route-builder-map"), {
  ssr: false,
})

export default function BuilderPage() {
  const [distance, setDistance] = useState(10)
  const [difficulty, setDifficulty] = useState("medium")
  const [terrainTags, setTerrainTags] = useState<string[]>([])
  const [routeGenerated, setRouteGenerated] = useState(false)
  const [routePoints, setRoutePoints] = useState<{ lat: number; lng: number }[]>([])


  const terrainOptions = ["Лес", "Вода", "Горы", "Город"]

  const toggleTerrain = (tag: string) => {
    setTerrainTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleBuild = () => {
    setRouteGenerated(true)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-secondary py-12 border-b border-border">
          <div className="max-w-7xl mx-auto px-8">
            <h1 className="text-4xl font-semibold mb-2">Построить маршрут</h1>
            <p className="text-foreground/70">Создайте свой идеальный маршрут</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-1">
                <Card>
                  <h2 className="text-2xl font-semibold mb-6">Параметры маршрута</h2>

                  {/* Start Point */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Начальная точка</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Введите название"
                        className="flex-1 px-4 py-2 bg-input rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90">
                        <MapPin size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Distance Slider */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Расстояние: {distance} км</label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={distance}
                      onChange={(e) => setDistance(Number.parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Difficulty */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3">Сложность</label>
                    <div className="space-y-2">
                      {[
                        { id: "easy", label: "Лёгкий" },
                        { id: "medium", label: "Средний" },
                        { id: "hard", label: "Сложный" },
                      ].map((opt) => (
                        <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="difficulty"
                            value={opt.id}
                            checked={difficulty === opt.id}
                            onChange={(e) => setDifficulty(e.target.value)}
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Terrain Tags */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3">Ландшафт</label>
                    <div className="grid grid-cols-2 gap-2">
                      {terrainOptions.map((terrain) => (
                        <button
                          key={terrain}
                          onClick={() => toggleTerrain(terrain)}
                          className={`px-3 py-2 rounded-lg font-medium transition-all ${
                            terrainTags.includes(terrain) ? "bg-primary text-white" : "bg-muted text-foreground"
                          }`}
                        >
                          {terrain}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button variant="primary" className="w-full" onClick={handleBuild}>
                    Построить маршрут
                  </Button>
                </Card>
              </div>

              {/* Preview */}
              <div className="lg:col-span-2">
                {routeGenerated ? (
                  <Card>
                    <RouteBuilderMap onRouteChange={setRoutePoints} />

                    <h2 className="text-2xl font-semibold mb-4 mt-6">Новый маршрут</h2>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center pb-4 border-b border-border">
                        <span className="text-foreground/70">Расстояние (пока по слайдеру):</span>
                        <span className="font-semibold">{distance} км</span>
                      </div>

                      <div className="flex justify-between items-center pb-4 border-b border-border">
                        <span className="text-foreground/70">Сложность:</span>
                        <span className="font-semibold">
                          {difficulty === "easy" && "Лёгкий"}
                          {difficulty === "medium" && "Средний"}
                          {difficulty === "hard" && "Сложный"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pb-4 border-b border-border">
                        <span className="text-foreground/70">Ландшафт:</span>
                        <span className="font-semibold">
                          {terrainTags.length > 0 ? terrainTags.join(", ") : "Не выбрано"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pb-4 border-b border-border">
                        <span className="text-foreground/70">Точек в маршруте:</span>
                        <span className="font-semibold">{routePoints.length}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button variant="primary" className="w-full">
                        Начать маршрут
                      </Button>
                      <Button variant="secondary" className="w-full">
                        Сохранить маршрут
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <Card>
                    <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Ruler size={48} className="text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-foreground/70">
                          Заполните параметры маршрута и нажмите &quot;Построить&quot;
                        </p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
