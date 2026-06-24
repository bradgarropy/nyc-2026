// Trip-related helpers — see plan.md for the design.

import type {Day, Stop, TransitMode} from "~/data/types"

// Maps a subway line (its letter/number) to its MTA trunk-line color token.
const LINE_GROUPS: [string, string[]][] = [
    ["red", ["1", "2", "3"]],
    ["green", ["4", "5", "6"]],
    ["purple", ["7"]],
    ["blue", ["A", "C", "E"]],
    ["orange", ["B", "D", "F", "M"]],
    ["yellow", ["N", "Q", "R", "W"]],
    ["light-green", ["G"]],
    ["brown", ["J", "Z"]],
    ["grey", ["L", "S"]],
    ["teal", ["T"]],
]

const LINE_COLOR: Record<string, string> = Object.fromEntries(
    LINE_GROUPS.flatMap(([color, lines]) =>
        lines.map(line => [line, `var(--color-mta-${color})`]),
    ),
)

export const subwayLineColor = (line: string): string =>
    LINE_COLOR[line.toUpperCase()] ?? "var(--color-mta-grey)"

// MTA color tokens light enough that text sitting on top of them should be dark
// rather than white (the MTA uses black on its yellow line, for example).
const LIGHT_COLORS = new Set(["var(--color-mta-yellow)"])

// The legible text color ("#1a1a1a" or "white") to use on top of a given fill.
export const textColorOn = (color: string): string =>
    LIGHT_COLORS.has(color) ? "#1a1a1a" : "white"

// Unique stops in the order they were first visited across the trip (day order,
// then each day's route order). Drives the map's keyboard tab order so it
// follows the trip. Any stop not on a route is appended at the end.
export const visitOrderedStops = (
    days: Day[],
    stops: Record<string, Stop>,
): Stop[] => {
    const seen = new Set<string>()
    const ordered: Stop[] = []

    for (const day of days) {
        for (const id of day.route) {
            const stop = stops[id]
            if (stop && !seen.has(id)) {
                seen.add(id)
                ordered.push(stop)
            }
        }
    }

    for (const stop of Object.values(stops)) {
        if (!seen.has(stop.id)) {
            ordered.push(stop)
        }
    }

    return ordered
}

// Each transit mode renders with a distinct line style so the way we got
// between stops is easy to read. Values are SVG `stroke-dasharray` (undefined =
// a solid line). Pair the dotted "walk" style with round line caps.
export const MODE_DASH: Record<TransitMode, string | undefined> = {
    subway: undefined, // solid — the "real" subway line
    walk: "1 10", // dotted
    ferry: "14 10", // dashed
    car: "2 10 14 10", // dash-dot (arrival / departure drives)
}
