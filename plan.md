# 🗽 nyc 2026 — plan

An interactive, MTA-inspired subway map of our 2026 NYC trip. Each day is a
colored "line", each stop is clickable, and you can filter by day. The goal is a
stylized keepsake that feels like it could hang in the Transit Museum gift
shop — not a Google Maps timeline.

---

## 1. concept

- A simplified, stylized NYC subway map (MTA-_inspired_, not copied).
- Each **day is a colored subway line**, routed through that day's stops in order.
- Lines are drawn MTA-style: thick strokes, 45° angled segments, rounded joins,
  white "bulb" station dots.
- The **Hotel is the central transfer hub** — every day's line passes through it.
- Stops that recur across days (Hotel, Rockefeller Center, Nintendo Store,
  Oculus) render as **transfer stations** (a single larger node with multiple
  colored lines passing through), exactly like a real interchange.
- Clicking a stop opens a detail panel: photos, notes, restaurants, subway lines
  used, and funny memories.
- A **day filter** (All / Day 1–4) highlights one line and dims the rest.
- The trip was **5 days / 4 nights**. The drive in through the **Lincoln Tunnel**
  is the start of **Day 1** (not a separate day); **Day 5** is the departure to
  **LGA**, a travel-only day excluded from the filter.
- **Transit modes have distinct line styles** so it's easy to tell how we got
  between stops: walk (dotted), subway (solid), ferry (dashed), car (dash-dot).
  The car style covers the Lincoln Tunnel arrival and LGA departure.
- v1 is a **static, fit-to-screen poster** with clickable stops. Pan/zoom and a
  line draw-on animation are planned later (see Future enhancements).

---

## 2. tech stack (already scaffolded)

- **React Router v7** (SSR) on **Cloudflare Workers** — from `react-router-starter`.
- **TypeScript**, **Tailwind v4**, **Vitest**, **Playwright**.
- `@bradgarropy/eslint-config`, Prettier (4-space, no-semi, double-quote).
- Single page: the index route (`src/routes/index.tsx`) renders the whole map.
- Map is **hand-authored inline SVG** — no map/charting library. Hand-placed
  coordinates give us full control over the schematic look.
- Sentry and `react-router-devtools` were removed during scaffolding.

---

## 3. the trip (source data)

Classification legend: ⭐ major · 🍴 food · • standard · `[mode]` = transit
between stops · `hub` = recurring transfer station.

### Day 1 — Tue, Jun 16 · Midtown / Times Square · 🔴 line

Lincoln Tunnel 🚗 → `[car]` → Hotel (hub) → Times Square ⭐ → LEGO Store →
Nintendo Store (hub) → Rockefeller Center (hub) ⭐ → FAO Schwarz →
St. Patrick's Cathedral (outside) → Grand Central Terminal ⭐ →
Grand Central Hot Dog Cart 🍴🌭 → Hotel (hub)

_(The day opens with the drive in through the Lincoln Tunnel — that first `car`
segment is dash-dot styled, but it's part of the red Day 1 line, not a separate
day.)_

### Day 2 — Wed, Jun 17 · Downtown + Brooklyn · 🔵 line (rode the E)

Hotel (hub) → [E train] → Cloudflare Office → Oculus (hub) ⭐ → Ground Zero →
World Trade Center ⭐ → [walk] → Brooklyn Bridge ⭐ → [walk] →
Washington Street (Manhattan Bridge photo) → Pebble Beach → Westville DUMBO 🍴🥗 →
Jane's Carousel ⭐ → [ferry] → Statue of Liberty ⭐ → Pier 79 →
Rockefeller Center (hub) → Nintendo Store (hub) → Hotel (hub)

### Day 3 — Thu, Jun 18 · Central Park + Midtown + SoHo · 🟢 line

Hotel (hub) → Central Park Zoo → Central Park ⭐ → El Mitote 🍴🌮 →
Apple Fifth Avenue ⭐ → 368 Broadway → Washington Square Park ⭐ → Hotel (hub)

### Day 4 — Fri, Jun 19 · West Side + Chinatown · 🟠 line

Hotel (hub) → Hudson Yards ⭐ → Vessel → High Line ⭐ → Chelsea Market →
Little Island → Chinatown ⭐ → Pell Street → Doyers Street → Mott Street →
Bubble Tea 🍴 → Dumplings 🍴 → Wall Street → NYSE → Oculus (hub) →
Pop Mart → Hotel (hub) → Pizza Suprema 🍴🍕

_(Friends Apartment was on the original list but we skipped it — omitted.)_

### Day 5 — Sat, Jun 20 · Departure — LGA · ⚪ travel

Hotel → `[car]` → LGA ✈ → Houston → Austin.
A **travel-only day** (`travel: true`): drawn as a grey dash-dot car line off the
Hotel hub, but excluded from the day filter. (Houston/Austin are off-map.)

### recurring transfer hubs

- **Hotel** (34th/36th St) — days 1, 2, 3, 4 → the central hub
- **Rockefeller Center** — days 1, 2
- **Nintendo Store** — days 1, 2
- **Oculus** — days 2, 4

### geography notes (confirmed)

- **Pizza Suprema** → near Penn Station / MSG / the Hotel (8th Ave & ~30th).
  Placed there even though it's last on Day 4's list.
- **Cloudflare Office** → at the **World Trade Center** (sits with the WTC/Oculus cluster).
- **368 Broadway** → **SoHo**.
- **Friends Apartment** → skipped, omitted from the map.
- **Pier 79** is far west midtown (the ferry up the Hudson lands there).

---

## 4. day colors (MTA palette)

Official MTA trunk-line colors, sourced from the MTA brand colors doc
([mta.info/document/168976](https://www.mta.info/document/168976)), defined as
**Tailwind theme variables** in `src/styles/tailwind.css` (`@theme`). Use the
generated utilities (`bg-mta-red`, `text-mta-blue`, …) and CSS vars
(`var(--color-mta-red)`) instead of hardcoding hex.

| day | theme                       | tailwind token       | hex       | nod to         |
| --- | --------------------------- | -------------------- | --------- | -------------- |
| 1   | Midtown / Times Square      | `--color-mta-red`    | `#EE352E` | 1·2·3 red      |
| 2   | Downtown + Brooklyn         | `--color-mta-blue`   | `#0039A6` | A·C·**E** blue |
| 3   | Central Park + Midtown/SoHo | `--color-mta-green`  | `#00933C` | 4·5·6 green    |
| 4   | West Side + Chinatown       | `--color-mta-orange` | `#FF6319` | B·D·F·M orange |
| 5   | departure (travel)          | `--color-mta-grey`   | `#A7A9AC` | grey, car      |

The full palette (yellow, light-green, brown, purple, shuttle, teal) is also
defined for the optional subway-lines layer.

- **Background:** warm off-white/cream — `--color-mta-paper` (`#F5F3EC`).
- **Type:** **Helvetica** (`--font-helvetica`: `Helvetica, "Helvetica Neue", Arial, sans-serif`).

---

## 5. data model

Types live in `src/data/types.ts`; the data is split across `src/data/stops.ts`,
`src/data/days.ts`, and `src/data/trip.ts` (which composes them).

```ts
// src/data/types.ts
type StopCategory = "major" | "food" | "standard"
type TransitMode = "subway" | "walk" | "ferry" | "car"

type Stop = {
    id: string // "hotel", "times-square", ...
    name: string
    emoji?: string // "🌭", "🥗", ...
    category: StopCategory
    coord: {x: number; y: number} // schematic grid position
    isHub?: boolean // recurring transfer station
    days: number[] // [1,2,3,4] — which day-lines pass through
    notes?: string
    restaurants?: string[]
    subwayLines?: string[] // ["E"], ["N","Q","R","W"], ...
    memories?: string[] // "Grand Central hot dog cart", ...
    photos?: string[] // "/images/<id>/01.jpg" (placeholders for now)
}

type Segment = {
    mode: TransitMode // drives the line style (see MODE_DASH)
    line?: string // "E" when mode === "subway"
}

type Day = {
    id: number
    date: string // "Tue, Jun 16"
    theme: string
    color: string // CSS var, e.g. "var(--color-mta-red)"
    route: string[] // ordered Stop ids
    segments: Segment[] // route.length - 1 entries, mode between stops
    travel?: boolean // travel-only day (Day 5 → LGA); excluded from filter
}

type Trip = {days: Day[]; stops: Record<string, Stop>}
```

- Stops live in a keyed map so hubs are defined once and referenced by every day.
- Each `Day.route` is an ordered list of stop ids; `segments[i]` is the
  transit mode used between `route[i]` and `route[i+1]`.
- **Line style is driven by `mode`** (`MODE_DASH` in `src/utils/trip.ts`):
  walk = dotted, subway = solid, ferry = dashed, car = dash-dot.
- **Arrival** is the leading `car` segment of **Day 1** (Lincoln Tunnel → Hotel);
  **departure** is **Day 5** (`travel: true`, Hotel → LGA, `car`). Both render
  dash-dot via the car style. `filterableDays()` (in `src/utils/trip.ts`) hides
  travel-only days from the toggle.
- **Notes/memories** are seeded from the trip brain-dump where we have them
  (e.g. the Grand Central hot dog cart, Washington Square Park); every other stop
  gets lorem-ipsum placeholder text to be replaced later.

---

## 6. coordinate / layout strategy

- SVG `viewBox` **portrait** (Manhattan is tall), e.g. `0 0 1000 1500`, north at top.
- Brooklyn stays **compact** in the lower-right — just enough room for the
  Brooklyn Bridge / DUMBO cluster. We don't need to show all of Brooklyn.
- Geographically-_rough_ placement so the map reads as NYC and shows how much
  of the island we covered — not survey-accurate.
    - top: Central Park / Zoo, Upper East & West Side
    - upper-mid: Times Sq, Rockefeller, Fifth Ave, Grand Central, **Hotel hub**
    - west (left): Hudson Yards, Vessel, High Line, Chelsea Market, Little Island,
      Pier 79, **Lincoln Tunnel** (far-west midtown, ~42nd St — Day 1 arrival)
    - lower-mid: Washington Sq, SoHo, 368 Broadway
    - bottom: Chinatown (Pell/Doyers/Mott), FiDi, WTC/Oculus, Wall St/NYSE, Statue of Liberty
    - lower-right (Brooklyn): Brooklyn Bridge, DUMBO, Jane's Carousel, Westville, Pebble Beach
- Lines route between anchors snapped to **45° / 90°** segments (the MTA look).
  A small helper generates an SVG path that only turns in 45° increments.
- **Coordinates are iterative.** First pass places everything; we'll nudge after
  seeing it render. This is expected and fine.

---

## 7. rendering

- `<TripMap>` — the SVG canvas (viewBox, optional pan/zoom later).
    - `<DayLine day={...}>` — the day's colored route, 45° routing, rounded
      caps/joins. Drawn segment-by-segment so each segment's **stroke style comes
      from its `mode`** (`MODE_DASH`): walk dotted, subway solid, ferry dashed,
      car dash-dot. Use round line caps so the dotted walk reads as dots.
    - `<StopNode stop={...}>` — white bulb with colored ring. Hubs render larger
      with multiple colored rings (one per day passing through). Food/major stops
      get an emoji/badge.
    - `<StopLabel>` — MTA-style label beside each dot, collision-avoided where easy.
- Render order: lines first (so dots sit on top), then nodes, then labels.
- A small **legend** also documents the four mode line styles.

---

## 8. interaction

- **Day filter** (primary UI): `All Days` · `Day 1` · `Day 2` · `Day 3` · `Day 4`.
    - Selecting a day highlights its line + stops at full opacity and dims others.
    - `All Days` shows everything.
- **Stop panel** (detail): click/tap a stop → responsive panel.
    - desktop: right-side drawer; mobile: bottom sheet.
    - shows photo gallery (placeholders now), notes, restaurants, subway lines used,
      funny memories.
    - keyboard-accessible: stops are focusable, `Enter`/`Space` opens, `Esc` closes.
- **Legend**: day color + theme list; doubles as the filter on small screens.

---

## 9. layers (on for v1, may remove later)

Enabled by default for v1; we may drop them if they don't earn their keep. Both
are toggleable so turning them off is trivial:

- 🍴 **Food layer** — highlight just the food stops (Westville, El Mitote,
  Pizza Suprema, Hot Dog Cart, Bubble Tea, Dumplings).
- 🚇 **Subway-lines layer** — show which lines we used (E; B D F M; N Q R W;
  A C; 1 2 3; Ferry) as a separate key.
    - **Most-used lines, in order:** 🔵 blue (A·C·E) → 🟠 orange (B·D·F·M) →
      🟡 yellow (N·Q·R·W) → 🔴 red (1·2·3). Order the legend/key this way, and
      consider sizing/emphasis by usage.

---

## 10. photos

- Placeholders for now. Each stop reads from `/public/images/<stop-id>/`.
- The gallery shows numbered placeholder slots + captions; drop real files in
  later and they appear automatically.
- README will document the folder convention.

---

## 11. proposed file structure

```
src/
  routes/
    index.tsx            # renders <TripMap/> + <Legend/> + <DayFilter/>
  components/
    TripMap/             # SVG canvas
    DayLine/
    StopNode/
    StopLabel/
    DayFilter/
    Legend/
    StopPanel/           # detail drawer / bottom sheet
  data/
    types.ts             # shared types (Stop, Segment, Day, Trip)
    stops.ts             # the stops map (coords, days, notes, ...)
    days.ts              # the day routes + segments
    trip.ts              # composes stops + days into Trip
  utils/
    trip.ts              # filterableDays(), MODE_DASH
    path.ts              # 45° SVG path helper
  styles/
    tailwind.css
public/
  images/<stop-id>/...   # photos (placeholders for now)
```

(Components follow the starter convention: `Name/Name.tsx` + `index.tsx` +
`Name.test.tsx`.)

---

## 12. build phases

1. **Data** — author `src/data/{types,stops,days,trip}.ts`: every stop with
   first-pass coords, days, categories, hubs, memories, placeholder photo paths.
   _(done)_
2. **Static map** — `<TripMap>` + `<DayLine>` + `<StopNode>` + `<StopLabel>`
   rendering all days at once. Nail the 45° path helper.
3. **Coordinate pass** — render, screenshot, nudge coordinates until it reads
   like NYC and looks clean.
4. **Day filter** — highlight/dim by day; `All Days` default.
5. **Stop panel** — clickable stops → responsive drawer/bottom-sheet with
   gallery, notes, restaurants, lines, memories.
6. **MTA polish** — title block, legend, fonts, colors, shadows; the Day 5
   dotted departure tail.
7. **A11y + responsive** — keyboard nav, focus states, mobile bottom sheet.
8. **Photos + README** — wire `/public/images/<stop-id>/`, document swapping in
   real photos.
9. **Tests** — unit (data integrity, path helper, components) + a couple of
   Playwright flows (filter a day, open a stop).

---

## 13. title block

- Big title: **NYC 2026**
- Subtext: the date range — **June 16–20, 2026**

## 14. decisions locked in

- **Portrait** canvas, north up; Brooklyn kept compact (no need to show all of it).
- Trip is **5 days / 4 nights**: the **Lincoln Tunnel arrival is the start of
  Day 1**; **Day 5** is the LGA departure (`travel: true`, excluded from filter).
- **Transit mode drives line style**: walk dotted, subway solid, ferry dashed,
  car dash-dot (car = arrival + departure drives).
- Recurring stops = transfer hubs (single node, multiple colored lines).
- Pizza Suprema → Penn/MSG/Hotel area; Cloudflare Office → WTC; 368 Broadway → SoHo;
  Friends Apartment skipped.
- Day filter is the primary control; **food + subway-lines layers on for v1**
  (toggleable, may remove later).
- Geographically-rough schematic with 45° MTA-style routing.
- **v1 is a static, fit-to-screen poster** (clickable stops); not deployed yet
  (**local-only** for this pass).
- Notes/memories seeded from the brain-dump; lorem ipsum elsewhere.

---

## 15. future enhancements (not v1)

- **Pan / zoom** — drag to pan, scroll/pinch to zoom (helps on dense mobile view).
- **Draw-on animation** — each day's line animates drawing itself on load / when
  selected in the filter.
- **Cloudflare deploy** — publish to `nyc-2026.workers.dev` for a shareable link.

---

## 16. references

Official MTA source material (committed locally in `references/` for safekeeping):

- **Subway map** (visual style reference) —
  [mta.info/map/5256](https://www.mta.info/map/5256) → `references/mta-subway-map.pdf`
- **Brand colors** (line hex values) —
  [mta.info/document/168976](https://www.mta.info/document/168976) → `references/mta-brand-colors.pdf`
