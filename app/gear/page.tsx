"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/card"
import { Button } from "@/components/button"
import { useState } from "react"
import { Backpack, AlertCircle } from "lucide-react"

export default function GearPage() {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set())

  const gearCategories = [
    {
      category: "Одежда",
      items: [
        { id: 1, name: "Ветровка", essential: true },
        { id: 2, name: "Флисовая куртка", essential: true },
        { id: 3, name: "Влагостойкие брюки", essential: true },
        { id: 4, name: "Носки (2-3 пары)", essential: true },
        { id: 5, name: "Шапка", essential: false },
      ],
    },
    {
      category: "Обувь и аксессуары",
      items: [
        { id: 6, name: "Туристические ботинки", essential: true },
        { id: 7, name: "Рюкзак (30-40л)", essential: true },
        { id: 8, name: "Перчатки", essential: false },
        { id: 9, name: "Солнцезащитные очки", essential: false },
      ],
    },
    {
      category: "Гидратация и еда",
      items: [
        { id: 10, name: "Бутылка воды (1.5л)", essential: true },
        { id: 11, name: "Энергетические батончики", essential: true },
        { id: 12, name: "Орехи и сухофрукты", essential: false },
        { id: 13, name: "Спортивные напитки", essential: false },
      ],
    },
    {
      category: "Безопасность и навигация",
      items: [
        { id: 14, name: "Карта маршрута", essential: true },
        { id: 15, name: "GPS или мобильное приложение", essential: true },
        { id: 16, name: "Фонарик с батарейками", essential: true },
        { id: 17, name: "Первая помощь (аптечка)", essential: true },
        { id: 18, name: "Свисток", essential: false },
      ],
    },
    {
      category: "Защита от солнца",
      items: [
        { id: 19, name: "Солнцезащитный крем SPF 30+", essential: true },
        { id: 20, name: "Бальзам для губ с SPF", essential: false },
        { id: 21, name: "Шляпа или бандана", essential: false },
      ],
    },
  ]

  const toggleItem = (id: number) => {
    const newSet = new Set(checkedItems)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setCheckedItems(newSet)
  }

  const totalItems = gearCategories.reduce((sum, cat) => sum + cat.items.length, 0)
  const checkedCount = checkedItems.size
  const progress = Math.round((checkedCount / totalItems) * 100)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-secondary py-12 border-b border-border">
          <div className="max-w-7xl mx-auto px-8">
            <h1 className="text-4xl font-semibold mb-2 flex items-center gap-3">
              <Backpack size={32} />
              Снаряжение
            </h1>
            <p className="text-foreground/70">Проверьте, что вы ничего не забыли</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-8">
            {/* Progress Section */}
            <Card className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Прогресс упаковки</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70">
                    Готово: {checkedCount} из {totalItems} предметов
                  </span>
                  <span className="text-2xl font-semibold text-primary">{progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </Card>

            {/* Recommendation */}
            <Card className="mb-8 border-l-4 border-primary bg-secondary/50">
              <div className="flex gap-4">
                <div className="p-3 bg-primary/10 rounded-lg h-fit">
                  <AlertCircle className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Что надеть сегодня</h3>
                  <p className="text-foreground/70">
                    На основе прогноза погоды (облачно, возможны осадки 20%), рекомендуем: влагостойкую куртку,
                    эластичные брюки и ботинки с хорошей тягой. Не забудьте солнцезащитный крем!
                  </p>
                </div>
              </div>
            </Card>

            {/* Gear Categories */}
            <div className="space-y-6">
              {gearCategories.map((category, catIdx) => (
                <Card key={catIdx}>
                  <h3 className="text-xl font-semibold mb-4">{category.category}</h3>
                  <div className="space-y-2">
                    {category.items.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition"
                      >
                        <input
                          type="checkbox"
                          checked={checkedItems.has(item.id)}
                          onChange={() => toggleItem(item.id)}
                          className="w-5 h-5 accent-primary"
                        />
                        <span
                          className={`flex-1 ${checkedItems.has(item.id) ? "line-through text-foreground/50" : ""}`}
                        >
                          {item.name}
                        </span>
                        {item.essential && (
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                            Обязательно
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            {/* Action Button */}
            <div className="mt-8 text-center">
              <Button variant="primary" className="px-8">
                Я готов! Начать маршрут
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
