# 🗽 nyc 2026

_An interactive, MTA-inspired subway map of our 2026 trip to New York City._

Each day of the trip is drawn as its own colored subway line, routed through that
day's stops in order. The line style encodes how we travelled between stops
(walk, car, ferry, subway), and clicking any stop opens a detail panel with
notes, photos, and the subway line(s) we rode to get there.

## ✨ highlights

- **Day-colored lines** — five days, five trunk colors, filterable.
- **Transit modes as line styles** — walk (dotted), car (dash-dot), ferry
  (dashed), subway (solid).
- **Linked map + itinerary** — hovering a stop in a day card highlights it on
  the map; clicking opens its detail panel.
- **Octilinear, Helvetica, MTA palette** — styled after the official subway map.

## 🧰 tech

[React Router][react-router] (SSR) · [TypeScript][typescript] ·
[Tailwind][tailwind] · [Vitest][vitest] · [Playwright][playwright] ·
[Cloudflare Workers][cloudflare]

## 🚀 development

```bash
npm install
npm run dev
```

The app runs at [`localhost:3000`](http://localhost:3000).

## 📜 scripts

| script              | description                       |
| ------------------- | --------------------------------- |
| `npm run dev`       | start the dev server              |
| `npm run build`     | production build                  |
| `npm run preview`   | build and serve with Wrangler     |
| `npm test`          | unit tests (Vitest) with coverage |
| `npm run test:e2e`  | end-to-end tests (Playwright)     |
| `npm run lint`      | lint with ESLint                  |
| `npm run typecheck` | generate types and run `tsc`      |
| `npm run deploy`    | build and deploy to Cloudflare    |

## 🗂️ structure

```
src/
  components/   map, itinerary, filter, and detail-panel components
  data/         the trip itself — stops, days, and the composed trip
  routes/       the single page that renders the map + itinerary
  utils/        path geometry and trip helpers
  styles/       Tailwind entry + MTA color tokens
```

## ✏️ editing the trip

All trip content lives in [`src/data`](./src/data):

- **`stops.ts`** — every place, with its map coordinate, the days it belongs to,
  optional notes, photos, and the subway line(s) taken to reach it.
- **`days.ts`** — each day's ordered route through the stops and the transit
  mode used between each pair.
- **`types.ts`** — the shapes for stops, days, and segments.

[react-router]: https://reactrouter.com
[typescript]: https://typescriptlang.org
[tailwind]: https://tailwindcss.com
[vitest]: https://vitest.dev
[playwright]: https://playwright.dev
[cloudflare]: https://workers.cloudflare.com
