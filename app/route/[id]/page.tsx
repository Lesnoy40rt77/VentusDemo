"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { useState } from "react"
import { MapPin, Clock, Mountain, AlertTriangle, Backpack, Share2, Heart } from "lucide-react"

export default function RouteDetailPage({ params }: { params: { id: string } }) {
  const [gearItems, setGearItems] = useState([
    { id: 1, name: "Ветровка", checked: false },
    { id: 2, name: "Вода 0.5л", checked: false },
    { id: 3, name: "Фонарик", checked: false },
    { id: 4, name: "Кроссовки", checked: false },
    { id: 5, name: "Рюкзак", checked: false },
    { id: 6, name: "Солнцезащитный крем", checked: false },
  ])

  const toggleGear = (id: number) => {
    setGearItems((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)))
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Map Header */}
        <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 w-full" />

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-8">
            {/* Title & Meta */}
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-semibold mb-4">Горная тропа Карелия</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin size={20} className="text-primary" />
                    <div>
                      <p className="text-sm text-foreground/70">Расстояние</p>
                      <p className="font-semibold">12 км</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={20} className="text-primary" />
                    <div>
                      <p className="text-sm text-foreground/70">Время</p>
                      <p className="font-semibold">4-5 часов</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mountain size={20} className="text-primary" />
                    <div>
                      <p className="text-sm text-foreground/70">Сложность</p>
                      <p className="font-semibold">Средний</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-3 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition">
                  <Heart size={20} />
                </button>
                <button className="p-3 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                <Card>
                  <h2 className="text-2xl font-semibold mb-4">О маршруте</h2>
                  <p className="text-foreground/70 leading-relaxed">
                    Это одна из самых популярных троп в Карелии. Маршрут начинается в долине и постепенно набирает
                    высоту, открывая потрясающие виды на лесной массив. Идеально подходит для опытных туристов, которые
                    ищут вызов.
                  </p>
                </Card>

                {/* Weather Along Route */}
                <Card>
                  <h2 className="text-2xl font-semibold mb-4">Погода на маршруте</h2>
                  <div className="space-y-4">
                    {[
                      { time: "08:00", temp: "10°C", icon: "☀️", desc: "Ясно" },
                      { time: "12:00", temp: "15°C", icon: "⛅", desc: "Облачно" },
                      { time: "16:00", temp: "12°C", icon: "🌧️", desc: "Дождь" },
                    ].map((weather, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{weather.icon}</span>
                          <div>
                            <p className="font-semibold">{weather.time}</p>
                            <p className="text-sm text-foreground/70">{weather.desc}</p>
                          </div>
                        </div>
                        <span className="font-semibold text-primary">{weather.temp}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Gear List */}
                <Card>
                  <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <Backpack size={24} />
                    Снаряжение
                  </h2>
                  <div className="space-y-3">
                    {gearItems.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-muted transition"
                      >
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => toggleGear(item.id)}
                          className="w-5 h-5"
                        />
                        <span className={item.checked ? "line-through text-foreground/50" : ""}>{item.name}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-secondary rounded-lg">
                    <p className="text-sm font-medium text-primary">
                      Совет: На горных маршрутах погода меняется быстро. Убедитесь, что у вас есть несколько слоёв одежды!
                    </p>
                  </div>
                </Card>

                {/* Warnings */}
                <Card>
                  <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle size={24} />
                    Предупреждения
                  </h2>
                  <div className="space-y-3">
                    <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded">
                      <p className="font-semibold text-yellow-900">Высота</p>
                      <p className="text-sm text-yellow-800">
                        Узкие горные тропы требуют подготовки для прохождения. Может быть трудно неопытным туристам.
                      </p>
                    </div>
                    <div className="p-4 border-l-4 border-orange-500 bg-orange-50 rounded">
                      <p className="font-semibold text-orange-900">Скалистый участок</p>
                      <p className="text-sm text-orange-800">
                        Часть маршрута проходит по скалистой тропе. Требуется хорошая координация.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sidebar CTA */}
              <div>
                <Card className="sticky top-24">
                  <Button variant="primary" className="w-full mb-3">
                    Начать маршрут
                  </Button>
                  <Button variant="secondary" className="w-full">
                    Сохранить
                  </Button>

                  <div className="mt-6 p-4 bg-secondary rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Рекомендуемое время</h4>
                    <p className="text-sm text-foreground/70">Начните рано утром для лучшего опыта</p>
                  </div>

                  <div className="mt-4 p-4 bg-secondary rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Экстренные контакты</h4>
                    <p className="text-sm text-foreground/70">Спасательная служба: 112</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
