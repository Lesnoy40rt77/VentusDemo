"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/card"
import { Cloud, Wind, Droplets, Sun } from "lucide-react"

export default function WeatherPage() {
  const weatherTimeline = [
    { time: "06:00", temp: "8°C", condition: "Ясно", icon: "☀️", wind: "5 км/ч", rain: "0%" },
    { time: "09:00", temp: "12°C", condition: "Солнечно", icon: "☀️", wind: "8 км/ч", rain: "0%" },
    { time: "12:00", temp: "16°C", condition: "Облачно", icon: "⛅", wind: "12 км/ч", rain: "10%" },
    { time: "15:00", temp: "15°C", condition: "Облачно", icon: "⛅", wind: "15 км/ч", rain: "20%" },
    { time: "18:00", temp: "10°C", condition: "Дождь", icon: "🌧️", wind: "18 км/ч", rain: "60%" },
    { time: "21:00", temp: "7°C", condition: "Дождь", icon: "🌧️", wind: "20 км/ч", rain: "70%" },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-secondary py-12 border-b border-border">
          <div className="max-w-7xl mx-auto px-8">
            <h1 className="text-4xl font-semibold mb-2">Погода на маршруте</h1>
            <p className="text-foreground/70">Прогноз погоды для вашего путешествия</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <Card>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Sun size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/70">Температура</p>
                    <p className="text-2xl font-semibold">12°C</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <Wind size={24} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/70">Ветер</p>
                    <p className="text-2xl font-semibold">12 км/ч</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Droplets size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/70">Осадки</p>
                    <p className="text-2xl font-semibold">20%</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Cloud size={24} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/70">Облачность</p>
                    <p className="text-2xl font-semibold">40%</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Timeline */}
            <Card>
              <h2 className="text-2xl font-semibold mb-6">График погоды</h2>
              <div className="space-y-3">
                {weatherTimeline.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition rounded"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <span className="font-semibold text-primary min-w-20">{item.time}</span>
                      <span className="text-2xl">{item.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium">{item.condition}</p>
                        <p className="text-sm text-foreground/60">
                          {item.wind} • {item.rain} осадков
                        </p>
                      </div>
                    </div>
                    <span className="text-2xl font-semibold text-primary">{item.temp}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Temperature and Wind Graphs (placeholder) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card>
                <h3 className="text-xl font-semibold mb-4">График температуры</h3>
                <div className="aspect-video bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg flex items-center justify-center">
                  <p className="text-foreground/50">Температурный график</p>
                </div>
              </Card>
              <Card>
                <h3 className="text-xl font-semibold mb-4">Скорость ветра</h3>
                <div className="aspect-video bg-gradient-to-br from-accent/5 to-primary/5 rounded-lg flex items-center justify-center">
                  <p className="text-foreground/50">График ветра</p>
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
