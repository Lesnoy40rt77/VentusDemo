"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/card"
import { Button } from "@/components/button"
import { AlertTriangle, Phone, MapPin, Lightbulb, Share2 } from "lucide-react"

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-secondary py-12 border-b border-border">
          <div className="max-w-7xl mx-auto px-8">
            <h1 className="text-4xl font-semibold mb-2 flex items-center gap-3">
              <AlertTriangle size={32} />
              Центр безопасности
            </h1>
            <p className="text-foreground/70">Важная информация для безопасного путешествия</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-8">
            {/* Emergency Contacts */}
            <Card className="mb-8 border-l-4 border-red-500 bg-red-50">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-red-700">
                <Phone size={28} />
                Экстренные контакты
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-red-600 font-semibold mb-2">Спасательная служба</p>
                  <p className="text-2xl font-bold text-red-700">112</p>
                </div>
                <div>
                  <p className="text-sm text-red-600 font-semibold mb-2">Полиция</p>
                  <p className="text-2xl font-bold text-red-700">102</p>
                </div>
                <div>
                  <p className="text-sm text-red-600 font-semibold mb-2">Скорая помощь</p>
                  <p className="text-2xl font-bold text-red-700">103</p>
                </div>
              </div>
            </Card>

            {/* Risk Warnings */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-6">Предупреждения о рисках</h2>
              <div className="space-y-4">
                <Card className="border-l-4 border-yellow-500">
                  <div className="flex gap-4">
                    <div className="text-3xl">⚠️</div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Мокрый участок тропы</h3>
                      <p className="text-foreground/70">
                        После вчерашнего дождя некоторые участки тропы остаются мокрыми и скользкими. Используйте
                        трекинговые палки и двигайтесь медленнее.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="border-l-4 border-orange-500">
                  <div className="flex gap-4">
                    <div className="text-3xl">🌪️</div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Порывистый ветер</h3>
                      <p className="text-foreground/70">
                        В верхней части маршрута ожидается порывистый ветер до 20 км/ч. Будьте внимательны на открытых
                        участках.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="border-l-4 border-blue-500">
                  <div className="flex gap-4">
                    <div className="text-3xl">🔦</div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Ранний закат</h3>
                      <p className="text-foreground/70">
                        Солнце садится в 18:30. Убедитесь, что у вас есть фонарик, если вы планируете оставаться дольше.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Weather Alerts */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-6">Погодные оповещения</h2>
              <Card className="border-l-4 border-purple-500">
                <div className="flex gap-4">
                  <div className="text-3xl">⛈️</div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Штормовое предупреждение</h3>
                    <p className="text-foreground/70 mb-4">
                      Ожидаются грозы после 16:00. Рекомендуется вернуться на базу до 15:00 или укрыться в безопасном
                      месте.
                    </p>
                    <div className="space-y-2 text-sm">
                      <p>• Избегайте открытых участков</p>
                      <p>• Не используйте электроприборы</p>
                      <p>• Найдите низкую точку для укрытия</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Tips & Guidance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin size={24} className="text-primary" />
                  Навигация
                </h3>
                <ul className="space-y-3 text-foreground/70">
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Всегда имейте карту маршрута и координаты</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Используйте GPS на телефоне для отслеживания</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Проверьте разметку маршрута перед началом</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Скачайте mapp.in оффлайн версию</span>
                  </li>
                </ul>
              </Card>

              <Card>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Lightbulb size={24} className="text-primary" />
                  Первая помощь
                </h3>
                <ul className="space-y-3 text-foreground/70">
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Держите аптечку первой помощи всегда при себе</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Знайте основы оказания первой помощи</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>При необходимости вызывайте спасателей</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Сообщите кому-то вашу планируемый маршрут</span>
                  </li>
                </ul>
              </Card>
            </div>

            {/* Share Route */}
            <Card className="text-center">
              <h3 className="text-2xl font-semibold mb-4 flex items-center justify-center gap-2">
                <Share2 size={28} />
                Поделиться маршрутом
              </h3>
              <p className="text-foreground/70 mb-6">
                Расскажите другим путешественникам о вашем маршруте и поддержите сообщество Ventus
              </p>
              <Button variant="primary" className="px-8">
                Поделиться на сообществе
              </Button>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
