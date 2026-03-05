# VentusDemo

Демо-версия **Ventus** — сервиса для планирования прогулок/походов и работы с маршрутами: построение трека на карте, прогноз погоды в точках маршрута и небольшие социальные функции (посты/лайки/комментарии).

> Идея основного проекта Ventus: дать туристу “контекстные” рекомендации под конкретный маршрут (а не общий прогноз по району) — почасовая погода по маршруту, подготовка и чек-лист снаряжения, советы/предупреждения и т.д.  
> Этот репозиторий — **демо веб-приложения**, где часть этих идей показана в интерфейсе и API.

---

## Что умеет демо

- **Главная страница** с блоками “Почему Ventus?” и витриной популярных маршрутов. :contentReference[oaicite:0]{index=0}  
- **Построение маршрута на карте** (точки → дистанция), сохранение в базу, опциональная загрузка обложки. :contentReference[oaicite:1]{index=1}  
- **Прогноз погоды** по координатам (используется Open-Meteo API). :contentReference[oaicite:2]{index=2}  
- **Поиск стартовой точки** по названию (геокодинг через Nominatim / OpenStreetMap). :contentReference[oaicite:3]{index=3}  
- **Авторизация** + сессии в БД (cookie-based). :contentReference[oaicite:4]{index=4}  

---

## Технологии

- **Next.js** (TypeScript) :contentReference[oaicite:5]{index=5}  
- **Prisma + SQLite** :contentReference[oaicite:6]{index=6}  
- **Leaflet / React-Leaflet** (карта) :contentReference[oaicite:7]{index=7}  
- UI: **Radix UI**, TailwindCSS и др. :contentReference[oaicite:8]{index=8}  

---

## Быстрый старт (локально)

### 1) Установка зависимостей
```bash
npm i
# или pnpm i
