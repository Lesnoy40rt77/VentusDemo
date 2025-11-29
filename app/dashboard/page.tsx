"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { Zap, Clock, Mountain } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Dashboard Header */}
        <section className="bg-secondary py-12 border-b border-border">
          <div className="max-w-7xl mx-auto px-8">
            <h1 className="text-4xl font-semibold mb-2">Привет, Андрей</h1>
            <p className="text-foreground/70">Добро пожаловать в ваш личный кабинет</p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-8 space-y-12">
            {/* Route of the Day */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Маршрут дня</h2>
              <Card className="lg:col-span-2">
                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold mb-2">Горная тропа Карелии</h3>
                    <div className="space-y-2 text-foreground/70">
                      <div className="flex items-center gap-2">
                        <Mountain size={18} />
                        <span>Расстояние: 12 км</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={18} />
                        <span>Время: 4-5 часов</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap size={18} />
                        <span>Сложность: Средний</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="primary">Начать маршрут</Button>
                </div>
              </Card>
            </div>

            {/* Statistics */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Ваша статистика</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <div className="text-center">
                    <div className="text-4xl font-semibold text-primary mb-2">127 км</div>
                    <p className="text-foreground/70">Всего пройдено</p>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <div className="text-4xl font-semibold text-primary mb-2">34 ч</div>
                    <p className="text-foreground/70">Общее время</p>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <div className="text-4xl font-semibold text-primary mb-2">18</div>
                    <p className="text-foreground/70">Прогулок завершено</p>
                  </div>
                </Card>
              </div>
            </div>

            {/* Saved Routes */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Сохраненные маршруты</h2>
                <Button variant="primary">Построить маршрут</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: "Озеро Горное", distance: "15 км", difficulty: "Лёгкий" },
                  { name: "Вершина Вулкана", distance: "18 км", difficulty: "Сложный" },
                  { name: "Лесной путь", distance: "8 км", difficulty: "Лёгкий" },
                ].map((route, idx) => (
                  <Card key={idx}>
                    <div className="aspect-video bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg mb-4 flex items-center justify-center">
                      <Mountain size={48} className="text-muted-foreground opacity-50" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{route.name}</h3>
                    <div className="flex justify-between text-sm text-foreground/70 mb-4">
                      <span>{route.distance}</span>
                      <span>{route.difficulty}</span>
                    </div>
                    <Button variant="outline" className="w-full bg-transparent">
                      Открыть
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
