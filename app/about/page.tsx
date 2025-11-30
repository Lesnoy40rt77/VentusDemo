import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/card"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-secondary py-10 border-b border-border">
          <div className="max-w-7xl mx-auto px-8">
            <p className="text-xs uppercase tracking-[0.2em] text-foreground/60 mb-2">
              О проекте
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold mb-2">
              Ventus — умный гид для прогулок на природе
            </h1>
            <p className="text-foreground/70 max-w-2xl">
              Ventus помогает планировать прогулки, походы и семейный отдых на природе:
              объединяет карты, прогноз погоды по маршруту, рекомендации по экипировке
              и сообщество пользователей.
            </p>
          </div>
        </section>

        <section className="py-10">
          <div className="max-w-5xl mx-auto px-8 space-y-6">
            <Card className="p-6 space-y-3">
              <h2 className="text-xl font-semibold">Зачем нужен Ventus</h2>
              <p className="text-sm text-foreground/80">
                Сейчас для подготовки к походу приходится пользоваться сразу несколькими
                сервисами: отдельно карта, отдельно погода, отдельно отзывы и советы.
                Это занимает время и повышает риск промахнуться с погодой, маршрутом
                или экипировкой.
              </p>
              <p className="text-sm text-foreground/80">
                Ventus собирает всё в одном месте: интерактивные маршруты, гиперлокальный
                прогноз по треку, рекомендации по снаряжению и безопасность, а также
                обмен опытом через сообщество.
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <h2 className="text-xl font-semibold">Кому это подходит</h2>
              <ul className="text-sm text-foreground/80 list-disc pl-5 space-y-1">
                <li>любителям активного отдыха и лёгких походов;</li>
                <li>семьям с детьми, которым важна предсказуемость и безопасность;</li>
                <li>городским жителям, выезжающим «перезагрузиться» на природу;</li>
                <li>энтузиастам и туристам, которые уже используют outdoor-сервисы.</li>
              </ul>
            </Card>

            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Команда проекта</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-foreground/80">
                <div className="space-y-1">
                  <p className="font-semibold">Кейль Андрей Андреевич</p>
                  <p>Главный разработчик проекта Ventus.</p>
                  <p className="text-foreground/60 text-xs">
                    Студент 1 курса РГГМУ. Опыт проектирования мобильных приложений,
                    UX-прототипов и клиентской логистики.
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">Гладилин Михаил Николаевич</p>
                  <p>Разработчик.</p>
                  <p className="text-foreground/60 text-xs">
                    Студент 1 курса ИТМО. Web- и мобильная разработка, фронтенд и бэкенд.
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">Потёмкин Константин Александрович</p>
                  <p>Маркетолог.</p>
                  <p className="text-foreground/60 text-xs">
                    Студент 1 курса СПбГЭУ. Продвижение цифровых продуктов и
                    маркетинговая стратегия.
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">Аксёнова Алина Дмитриевна</p>
                  <p>Дизайнер и разработчик прототипа.</p>
                  <p className="text-foreground/60 text-xs">
                    Студентка 1 курса РГГМУ. Дизайн и прототипирование интерфейсов,
                    программирование на Python и Java.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-3">
              <h2 className="text-xl font-semibold">Контакты</h2>
              <p className="text-sm text-foreground/80">
                Владелец и оператор сервиса:{" "}
                <span className="font-medium">Кейль Андрей Андреевич</span>.
              </p>
              <p className="text-sm text-foreground/80">
                Почта для связи по проекту и вопросам сотрудничества:{" "}
                <a
                  href="mailto:akejl851@gmail.com"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  akejl851@gmail.com
                </a>
              </p>
              <p className="text-sm text-foreground/80">
                Телефон:{" "}
                <a
                  href="tel:+79818769986"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  +7 981 876-99-86
                </a>
              </p>
              <p className="text-xs text-foreground/60">
                Контакты используются для обратной связи, вопросов по работе сервиса
                и предложениям партнёрства.
              </p>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
