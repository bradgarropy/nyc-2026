# 🗽 nyc 2026 — plan

An interactive, MTA-inspired subway map of our 2026 NYC trip. Each day is a
colored "line", each stop is clickable, and you can filter by day. The goal is a
stylized keepsake that feels like it could hang in the Transit Museum gift
shop — not a Google Maps timeline.

**Status:** shipped and live at **https://nyc.bradgarropy.com**. Core build,
photos, deploy, and an accessibility pass are done. Remaining work is visual
polish (see §15). For day-to-day handoff state, see `session.md`.

---

## 1. concept

- A simplified, stylized NYC subway map (MTA-_inspired_, not copied).
- Each **day is a colored subway line**, routed through that day's stops in order.
- Lines are drawn MTA-style: thick strokes, octilinear (90°/45°) segments,
  rounded joins, white "bulb" station dots.
- The **Hotel is the central transfer hub** — every day's line passes through it.
- Stops visited on more than one day (Hotel, Oculus, Nintendo Store) render as a
  **single node** with each day's colored line passing through — like a real
  interchange.
- Clicking a stop opens a detail panel: photos, notes, and the subway line(s) we
  took to get there.
- A **day filter** (All / Day 1–5) highlights one line and dims the rest.
- The trip was **5 days / 4 nights**. The drive in through the **Lincoln Tunnel**
  is the start of **Day 1** (not a separate day); **Day 5** is the departure to
  the airport.
- **Transit modes have distinct line styles** so it's easy to tell how we got
  between stops: walk (dotted), subway (solid), ferry (dashed), car (dash-dot).
  The car style covers the Lincoln Tunnel arrival and the airport departure.
- v1 is a **static, fit-to-screen poster** with clickable stops. Pan/zoom and a
  line draw-on animation are possible later (see §15).

---

## 2. tech stack

- **React Router v7** (SSR) on **Cloudflare Workers**, via `@cloudflare/vite-plugin`.
- **TypeScript**, **Tailwind v4**, **Vitest**, **Playwright**.
- `@bradgarropy/eslint-config`, Prettier (4-space, no-semi, double-quote,
  trailing-comma all). `~/*` path alias.
- Single page: the index route (`src/routes/index.tsx`) renders the whole map +
  itinerary.
- Map is **hand-authored inline SVG** — no map/charting library. Hand-placed
  coordinates give full control over the schematic look.
- Deployed via **Cloudflare Workers Builds** (git-connected, auto-deploy on push
  to `main`) to the custom domain **nyc.bradgarropy.com**. See §10.

---

## 3. the trip (source data)

Modes are per-segment: `[car]`, `[walk]`, `[ferry]`, `[subway:LINE]`. Subway lines
shown are the lines we rode to reach the next stop.

### Day 1 — Tue, Jun 16 · Midtown & Times Square · blue line

Lincoln Tunnel `[car]` → Hotel → Macy's → Times Square → Disney Store →
M&M's Store → Rockefeller Center → Nintendo Store → St. Patrick's Cathedral →
LEGO Store → John's of Times Square → Hotel. (Arrival drive in, then all walking.)

### Day 2 — Wed, Jun 17 · Downtown & Brooklyn · yellow line

Hotel `[subway: E]` → World Trade Center (the Cloudflare office) → Ground Zero →
Oculus → Brooklyn Bridge → Westville DUMBO → Pebble Beach →
`[ferry]` Statue of Liberty → `[ferry]` USS Intrepid → Nintendo Store →
Grand Central Terminal → Grand Central Hot Dog Cart → Hotel.

### Day 3 — Thu, Jun 18 · Central Park & Midtown & SoHo · orange line

Hotel → Liberty Bagels `[subway: N]` → Central Park Zoo → Central Park →
El Mitote `[subway: 1]` → Apple Fifth Avenue `[subway: N]` → Washington Square Park
→ The Cage `[subway: E]` → 368 Broadway `[subway: E]` → Burgerology → Hotel.

### Day 4 — Fri, Jun 19 · West Side & Chinatown · red line

Hotel → B&H Photo → Vessel → Hudson Yards → High Line → Chelsea Market →
Little Island `[subway]` → Chinatown `[subway: A, B]` → New York Stock Exchange
`[subway: J]` → Wall Street Bull → Oculus `[subway: E]` → NY Pizza Suprema →
Madison Square Garden → Penn Station → Hotel.

### Day 5 — Sat, Jun 20 · Departure · brown line

Hotel `[car]` → Airport. `travel: true`, but still shown in the day filter.

### recurring transfer hubs

- **Hotel** (34th/36th St) — days 1–5, the central hub.
- **Oculus** — days 2, 4.
- **Nintendo Store** — days 1, 2.

(Rockefeller Center is Day 1 only after the data rework.)

### geography notes

- **NY Pizza Suprema** → near Penn Station / MSG (8th Ave & ~30th).
- **World Trade Center** = the Cloudflare office (WTC/Oculus cluster).
- **368 Broadway** → SoHo. **Burgerology** → next to the hotel on 36th.
- **Liberty Bagels** → near the hotel (Day 3 breakfast).

---

## 4. day colors (MTA palette)

Day colors follow the trip's most-to-least-used subway lines: **blue → yellow →
orange → red → brown**.

| day | theme                         | token                | hex       |
| --- | ----------------------------- | -------------------- | --------- |
| 1   | Midtown & Times Square        | `--color-mta-blue`   | `#0062cf` |
| 2   | Downtown & Brooklyn           | `--color-mta-yellow` | `#f6bc26` |
| 3   | Central Park & Midtown & SoHo | `--color-mta-orange` | `#eb6800` |
| 4   | West Side & Chinatown         | `--color-mta-red`    | `#d82233` |
| 5   | Departure                     | `--color-mta-brown`  | `#8e5c33` |

- The **full MTA palette** (blue, orange, light-green, brown, grey, yellow, red,
  green, purple, teal) plus surface tokens (`--color-mta-paper` `#ffffff`,
  `--color-mta-water` `#bed0e0`, `--color-mta-park` `#f0f4d0`) are defined in
  `src/styles/tailwind.css`.
- **Important Tailwind v4 note:** these color tokens live in a plain **`:root`
  block, not `@theme`.** Tailwind v4 tree-shakes unused `@theme` variables, and
  because we reference colors dynamically (`var(--color-mta-${x})` in
  `subwayLineColor`) the "unused" ones (e.g. brown / J) were being dropped,
  leaving bullets transparent. `:root` always emits them. Only
  `--font-helvetica` stays in `@theme` (it backs the `font-helvetica` utility).
  We consume colors as raw `var(--color-mta-*)` in inline styles / data — never
  as `bg-mta-*` utilities.
- **Contrast:** `textColorOn(color)` returns dark text for light fills (the yellow
  day) so the active filter pill / day badges use black-on-yellow like the real
  MTA. (Theme-subtitle contrast was intentionally left as-is.)
- **Type:** Helvetica (`--font-helvetica`).

---

## 5. data model

Types live in `src/data/types.ts`; data is split across `src/data/stops.ts`,
`src/data/days.ts`, and `src/data/trip.ts` (which composes them).

```ts
type TransitMode = "subway" | "walk" | "ferry" | "car"

type Stop = {
    id: string
    name: string
    coord: {x: number; y: number}
    days: number[] // which day-lines pass through (must match the routes)
    notes?: string
    subwayLines?: string[] // the line(s) we took to GET to this stop (panel only)
    photos?: string[] // Cloudflare Images custom IDs, e.g. ["macys/1"]
    labelSide?: "left" | "right"
}

type Segment = {mode: TransitMode} // line style is driven by mode (no `line` field)

type Day = {
    id: number
    date: string
    theme: string
    color: string // CSS var, e.g. "var(--color-mta-blue)"
    route: string[] // ordered Stop ids
    segments: Segment[] // route.length - 1 entries
    travel?: boolean // Day 5; still shown in the filter
}

type Trip = {days: Day[]; stops: Record<string, Stop>}
```

- Stops live in a keyed map so shared stops are defined once and referenced by
  each day. A stop's `days` must equal the set of days whose `route` includes it
  (enforced by `src/data/trip.test.ts`).
- `segments[i]` is the mode between `route[i]` and `route[i+1]`. Line style comes
  from `MODE_DASH` (`src/utils/trip.ts`): walk dotted, subway solid, ferry dashed,
  car dash-dot.
- `subwayLines` is "the line(s) we rode to reach this stop," rendered as MTA
  bullets in the detail panel only (color = day on the map; line identity lives in
  the panel). Stops we walked to have none.
- Notes are real (no placeholders). 3 stops have no photos by choice: hotel,
  the-cage, burgerology.

---

## 6. coordinate / layout

- SVG `viewBox` is **`0 0 658 1269`** (portrait; north up). `MAP_WIDTH` /
  `MAP_HEIGHT` are exported from `TripMap`.
- Geographically-_rough_ placement so the map reads as NYC, not survey-accurate.
- Lines route between anchors snapped to **90° / 45°** segments via the path
  helper in `src/utils/path.ts` (`bend`, `segmentPath`, `routePath`,
  `roundedPolygon`).
- **Coordinates are still a first pass** — the Midtown cluster is crowded and
  needs a tuning pass (see §15).

---

## 7. rendering

- `<TripMap>` — the SVG canvas (`role="img"`, `aria-label="NYC 2026 trip map"`),
  rounded corners, `viewBox` 658×1269.
    - `<BaseMap>` — the geographic backdrop: octilinear land / water / park
      polygons (`roundedPolygon`). Rendered first, under everything. **Done.**
    - `<DayLine>` — the day's colored route, octilinear, rounded caps/joins.
      Per-segment `stroke-dasharray` from `MODE_DASH`; round caps so dotted walk
      reads as dots. Dimmed when another day is filtered.
    - `<StopNode>` — white bulb with a colored ring (day color). Uniform size;
      pops to 1.4× on hover/focus (and when its day-card row is hovered/focused).
    - `<StopLabel>` — the stop name beside the dot, hidden until the stop group is
      hovered/focused (or driven from the matching day card). White halo for
      legibility.
- Render order: base map → day lines → stop groups (dot + label). Stop groups are
  rendered in **visit order** (`visitOrderedStops`) so keyboard tab order follows
  the trip.
- `<Legend>` documents the four mode line styles, ordered walk · car · ferry ·
  subway.
- **Known issue:** dots/labels are painted in document order, so an overlapping
  dot or its label can be clipped behind a later-drawn neighbor (Midtown). Needs a
  stacking fix — see §15.

---

## 8. interaction

- **Day filter** (`<DayFilter>`): `All Days` · `Day 1`–`Day 5`. Selecting a day
  shows its line/stops at full opacity and dims the rest; the itinerary list
  (`<DayList>`/`<DayItinerary>`) shows only that day. Active pill fills with the
  day color (black text on the yellow day).
- **Stop panel** (`<StopPanel>`): click a stop (map dot or itinerary row) →
  responsive panel — right drawer on desktop, bottom sheet on mobile. Shows the
  photo grid (thumbnails linking to full-size in a new tab), notes, and subway-line
  bullets. Animated in/out (always mounted), `inert`/`aria-hidden` when closed.
- **Map ↔ itinerary linking:** hovering or focusing a day-card stop highlights the
  matching map dot (label + pop); clicking either opens the panel.
- **Accessibility:** stops are focusable (`role="button"`, Enter/Space);
  visit-order tab sequence; while the panel is open the rest of the page is `inert`
  and focus returns to the trigger on close; `prefers-reduced-motion` disables the
  panel slide, dot pop, label fade, and scroll fades.

---

## 9. photos (Cloudflare Images)

- Photos are hosted in **Cloudflare Images**, not in the repo. `stop.photos` holds
  custom IDs like `"macys/1"`.
- `createImageUrl(id, "thumb" | "full")` (`src/utils/images.ts`) builds
  `https://imagedelivery.net/<hash>/<id>/<variant>` using
  `import.meta.env.VITE_CLOUDFLARE_IMAGES_HASH` (public, build-time).
- Named variants (dashboard): `thumbnail` (400×400, cover) for the grid, `full`
  (2000×2000, scale-down) for the open-in-new-tab view.
- **Upload flow:** drop JPGs into gitignored `photos/<stop-id>/`, run
  `npm run photos` (`scripts/upload-photos.ts`). It uploads with custom IDs
  `<stop-id>/<n>` (p-limit concurrency, upload-first / delete-on-conflict, so it's
  idempotent) and writes the IDs into `stops.ts`. Needs `CLOUDFLARE_ACCOUNT_ID` +
  an Images:Edit `CLOUDFLARE_IMAGES_TOKEN` in `.env`.
- **Cold loads:** the first request for a variant is generated/encoded on the fly
  (~1.3s) then edge-cached ~48h per pop; it re-encodes on a cache miss. Mitigations
  discussed in §15.

---

## 10. deployment

- **Cloudflare Workers Builds** (git integration), Worker name `nyc-2026`.
    - Build command: `npm run build`. Deploy command: `npx wrangler deploy`.
    - Auto-deploys on push to `main`; other branches create preview versions.
- **Build variable** `VITE_CLOUDFLARE_IMAGES_HASH` must be set in the Workers
  Builds build config (build-time, separate from runtime vars) or images break.
  The runtime Worker needs no secrets.
- Custom domain: **nyc.bradgarropy.com**.

---

## 11. file structure

```
src/
  routes/index.tsx        # the page: map + filter + legend + itinerary + panel
  components/
    TripMap/ BaseMap/ DayLine/ StopNode/ StopLabel/
    DayFilter/ Legend/ DayList/ DayItinerary/ StopPanel/
    Header/ Footer/ ErrorBoundary/
  data/
    types.ts stops.ts days.ts trip.ts
    trip.test.ts          # data-integrity checks
  utils/
    trip.ts               # MODE_DASH, subwayLineColor, textColorOn, visitOrderedStops
    images.ts             # createImageUrl + variant config
    path.ts               # octilinear SVG path helpers
    errors.ts
  styles/tailwind.css     # MTA color tokens (:root) + font (@theme) + scroll fades
  e2e/                    # Playwright: home.spec.ts, flows.spec.ts
scripts/upload-photos.ts  # Cloudflare Images uploader (npm run photos)
photos/<stop-id>/         # gitignored local photo sources
```

Components follow `Name/{Name.tsx, index.tsx, Name.test.tsx}`.

---

## 12. status

Done: data + real notes + subway lines · octilinear map + base map · day filter ·
animated/responsive stop panel · Cloudflare Images photos · day recolor +
black-on-yellow · title block + legend + `&` themes + favicon · clickable
itinerary + map↔card hover · starter cleanup + README · deploy (Workers Builds +
custom domain) · accessibility pass (focus trap/return, reduced motion, visit-order
tab) · tests (72 unit incl. data-integrity, + e2e flows).

Remaining: see §15.

---

## 13. title block

- Header: **New York City 2026** + subtitle **JUNE 16–20, 2026** (uppercase tag).
- Document `<title>` is plain **`nyc 2026`**; the 🗽 lives in the favicon
  (`https://fav.farm/🗽`).

---

## 14. decisions locked in

- **Color = day**, full stop. Subway line identity appears **only in the detail
  panel** (real MTA-colored bullets), never as a second color system on the map.
- **Shared stops are single map nodes** (transfer hubs), with one content set per
  place (we considered per-visit photos/notes and decided against it).
- Transit mode drives line **style** (dash pattern), not color.
- MTA color tokens live in **`:root`** (Tailwind v4 tree-shaking — see §4).
- Day 5 is `travel: true` but **is shown** in the filter.
- No decorative emoji in the UI; the 🗽 is favicon-only.
- Photos in **Cloudflare Images**, referenced by custom ID; sources gitignored.

---

## 15. remaining / future work

In rough priority:

1. **Coordinate & line-routing tuning** — the Midtown cluster is crowded and
   overlapping; nudge coordinates + routing until it reads cleanly. Biggest
   remaining visual win.
2. **SVG dot stacking & label readability** — overlapping dots and their labels can
   be clipped behind later-drawn neighbors, and label text is sometimes hard to
   read. Need a way to control stacking (e.g. raise the hovered/active stop and its
   label above siblings, and/or strengthen the label halo / collision handling).
3. **Cold-load image cache (in planning)** — first load of a variant is ~1.3s
   (cold transform), re-encoded on cache miss (~48h TTL, per pop). Plan: serve
   images from our own zone (`/cdn-cgi/imagedelivery/...`, since Cache Rules don't
   apply to `imagedelivery.net`) + a Cache Rule with a long Edge TTL to reduce
   miss frequency. Caveat: reduces frequency, not the first-hit cost.
4. **Downscale originals to ~2000px** — the only durable fix for the cold-encode
   cost (encode time scales with source pixels); declined so far for simplicity.
5. **Future enhancements** — pan/zoom on the map; a line draw-on animation.

Mobile is knowingly cramped (small map dots, hover-only labels) and is not a
priority — the itinerary cards are the primary mobile interaction.
