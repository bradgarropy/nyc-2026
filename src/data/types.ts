// Shared types for the NYC 2026 trip data — see plan.md §5.

export type StopCategory = "major" | "food" | "standard"

export type TransitMode = "subway" | "walk" | "ferry" | "car"

export type Stop = {
    id: string
    name: string
    emoji?: string
    category: StopCategory
    coord: {x: number; y: number}
    isHub?: boolean
    days: number[]
    notes?: string
    restaurants?: string[]
    subwayLines?: string[]
    memories?: string[]
    photos?: string[]
}

export type Segment = {
    // The line style is driven by the mode (walk / subway / ferry / car each
    // render with a distinct stroke — see src/utils/trip.ts `MODE_DASH`).
    mode: TransitMode
    line?: string
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
