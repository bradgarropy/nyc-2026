// Shared types for the NYC 2026 trip data — see plan.md §5.

export type TransitMode = "subway" | "walk" | "ferry" | "car"

// Which side of the dot the hover label sits on. Defaults to auto (chosen from
// the stop's x position); set explicitly to fix a crowded or edge stop.
export type LabelSide = "left" | "right"

export type Stop = {
    id: string
    name: string
    coord: {x: number; y: number}
    days: number[]
    notes?: string
    subwayLines?: string[]
    // Cloudflare Images custom IDs (e.g. "macys/1"), in display order. The
    // delivery URL is built by `createImageUrl` (see src/utils/images.ts).
    photos?: string[]
    labelSide?: LabelSide
}

export type Segment = {
    // The line style is driven by the mode (walk / subway / ferry / car each
    // render with a distinct stroke — see src/utils/trip.ts `MODE_DASH`).
    mode: TransitMode
}

export type Day = {
    id: number
    date: string
    theme: string
    color: string
    route: string[]
    segments: Segment[]
    // Travel-only day (e.g. Day 5 departure to LGA); excluded from the day
    // filter but still drawn.
    travel?: boolean
}

export type Trip = {
    days: Day[]
    stops: Record<string, Stop>
}
