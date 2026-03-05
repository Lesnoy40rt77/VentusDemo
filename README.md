# VentusDemo

**VentusDemo** is a demo web app for **Ventus** — a product concept focused on helping people plan walks/hikes by combining routes, map navigation, and weather insights in the context of a specific trip.

This repository demonstrates the core UX pieces: a map-based route builder, saving routes to a database, basic auth/session flow, and a weather + geocoding API layer.

---

## Demo features

- **Landing page** with “Why Ventus?” blocks and a showcase of popular routes  
- **Route builder on a map** (waypoints → distance), saving to DB, optional cover upload  
- **Weather forecast by coordinates** via Open‑Meteo API  
- **Place search / geocoding** via Nominatim (OpenStreetMap)  
- **Authentication** + DB-backed sessions (cookie-based)

---

## Tech stack

- **Next.js** (TypeScript, App Router)
- **Prisma + SQLite**
- **Leaflet / React‑Leaflet** (maps)
- UI: TailwindCSS + Radix UI (and related libraries)

---

## Quick start (local)

### 1) Install dependencies
```bash
npm i
# or pnpm i
```

### 2) Environment variables
Create a `.env` file in the project root:

```env
# SQLite database
DATABASE_URL="file:./dev.db"

# Map tiles (Thunderforest Outdoors)
NEXT_PUBLIC_THUNDERFOREST_KEY="YOUR_KEY"

# Optional (recommended): identify your app for Nominatim requests
NOMINATIM_USER_AGENT="VentusDemo/1.0 (you@example.com)"
```

Notes:
- `NEXT_PUBLIC_THUNDERFOREST_KEY` is used to build the map tile URL (see `lib/mapConfig.ts`).
- `NOMINATIM_USER_AGENT` is optional, but recommended by Nominatim usage rules.

### 3) Prisma setup
```bash
npx prisma migrate dev
npx prisma generate
```

### 4) Run
```bash
npm run dev
```

Open: `http://localhost:3000`

---

## How to try the demo

1. Open the landing page.
2. Go to **/builder** (route constructor).
3. Search a place (geocoding), then click to add waypoints.
4. Check the weather (fetched by coordinates).
5. Save the route — it’s stored in SQLite through Prisma.

---

## Project layout (high level)

- `app/` — pages + API routes (Next App Router)
  - `app/api/weather` — Open‑Meteo proxy
  - `app/api/geocode` — Nominatim search
  - `app/api/upload` — uploads to `public/uploads`
- `prisma/` — schema + migrations
- `lib/` — Prisma client, auth helpers, configs

---

## Demo limitations

- This is a **web demo**, not the full mobile product.
- Weather is currently fetched for a single reference point (e.g., mid-route) to keep the demo simple.
- Image storage is local (`public/uploads`), no cloud storage integration.

---

## Roadmap (idea)

- Weather **along the entire route** (multiple sampling points + hourly “on-the-way” forecast).
- Gear/prep recommendations based on forecast + duration.
- GPX import/export, offline-friendly mobile version.
- Community features: collections, ratings, moderation tools.

---

## License

Not specified yet. If you want, add a `LICENSE` file (e.g., MIT) and adjust this section accordingly.

---

## Author

**Lesnoy40rt77**  
Repository: **VentusDemo**
