// Trip-related helpers — see plan.md for the design.

import type {TransitMode} from "~/data/types"

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

// Each transit mode renders with a distinct line style so the way we got
// between stops is easy to read. Values are SVG `stroke-dasharray` (undefined =
// a solid line). Pair the dotted "walk" style with round line caps.
export const MODE_DASH: Record<TransitMode, string | undefined> = {
    subway: undefined, // solid — the "real" subway line
    walk: "1 10", // dotted
    ferry: "14 10", // dashed
    car: "2 10 14 10", // dash-dot (arrival / departure drives)
}
