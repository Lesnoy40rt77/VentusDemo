import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { IconCircle } from "@/components/icon-circle"
import { Mountain, Users, MapPin, Shield, TreePine } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-secondary min-h-screen flex items-center overflow-hidden relative">
        {/* Blurred tree silhouettes background */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
          <TreePine size={400} className="text-primary" />
        </div>
        <div className="absolute right-0 top-1/3 opacity-5 pointer-events-none">
          <TreePine size={350} className="text-primary" />
        </div>

        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-semibold text-foreground leading-tight">
              Откройте идеальный маршрут
            </h1>
            <p className="text-lg text-foreground/70 leading-relaxed">
              Ventus помогает вам спланировать, обнаружить и поделиться горными маршрутами. От лесных троп до горных
              вершин — все в одном месте.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="primary">Начать путешествие</Button>
              <Button variant="outline">Узнать больше</Button>
            </div>
          </div>

          {/* Right Preview Card */}
          <div>
            <Card className="lg:col-span-1">
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Mountain size={64} className="text-primary mx-auto mb-4 opacity-40" />
                  <p className="text-muted-foreground">Route preview placeholder</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-semibold text-center mb-16">Почему Ventus?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <MapPin size={32} />,
                title: "Лучшие маршруты",
                description: "Откройте проверенные маршруты от опытных путешественников",
              },
              {
                icon: <Users size={32} />,
                title: "Сообщество",
                description: "Делитесь опытом и учитесь у других туристов",
              },
              {
                icon: <Shield size={32} />,
                title: "Безопасность",
                description: "Погода, предупреждения и советы для безопасного путешествия",
              },
            ].map((item, idx) => (
              <Card key={idx}>
                <IconCircle icon={item.icon} color="primary" />
                <h3 className="text-2xl font-semibold mt-4 mb-2">{item.title}</h3>
                <p className="text-foreground/70">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-semibold text-center mb-16">Как это работает</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "01", title: "Выберите маршрут", description: "Просмотрите нашу базу данных маршрутов" },
              { number: "02", title: "Планируйте", description: "Проверьте погоду и получите рекомендации" },
              { number: "03", title: "Подготовьтесь", description: "Используйте чек-лист снаряжения" },
              { number: "04", title: "Начните", description: "Отправьтесь в приключение с Ventus" },
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-block mb-4 px-4 py-2 bg-primary text-white rounded-full font-semibold">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-foreground/70 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Routes Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-semibold text-center mb-16">Популярные маршруты</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Озеро в горах", difficulty: "Средний", distance: "12 км" },
              { title: "Лесной водопад", difficulty: "Лёгкий", distance: "8 км" },
              { title: "Вершина Кивакка", difficulty: "Сложный", distance: "18 км" },
            ].map((route, idx) => (
              <Card key={idx}>
                <div className="aspect-video bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg mb-4 flex items-center justify-center">
                  <MapPin size={48} className="text-muted-foreground opacity-50" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{route.title}</h3>
                <div className="flex justify-between text-sm text-foreground/70 mb-4">
                  <span>{route.distance}</span>
                  <span>{route.difficulty}</span>
                </div>
                <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                  Weather chip
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Preparation Timeline Section */}
      <section className="py-20 bg-muted/30 relative overflow-hidden">
        {/* Decorative trees */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
          <TreePine size={500} className="text-primary" />
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <h2 className="text-4xl font-semibold text-center mb-16">Подготовка к походу</h2>
          <div className="space-y-12">
            {[
              {
                step: "1",
                title: "Выберите маршрут",
                description: "Найдите подходящий маршрут в нашей базе данных по сложности и расстоянию",
              },
              {
                step: "2",
                title: "Проверьте условия",
                description: "Изучите прогноз погоды, предупреждения и советы от сообщества",
              },
              {
                step: "3",
                title: "Соберите снаряжение",
                description: "Используйте наш чек-лист, чтобы убедиться, что вы ничего не забыли",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-semibold">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-foreground/70">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Vertical line */}
          <div className="absolute left-1/2 md:left-20 top-32 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-transparent opacity-20" />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-semibold mb-6">Готовы начать?</h2>
          <p className="text-lg mb-8 opacity-90">
            Присоединяйтесь к тысячам путешественников, которые открывают новые маршруты каждый день.
          </p>
          <Button variant="secondary">Начать бесплатно</Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
