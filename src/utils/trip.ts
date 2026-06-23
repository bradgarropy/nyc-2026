// Trip-related helpers — see plan.md for the design.

import type {TransitMode} from "~/data/types"

// Each transit mode renders with a distinct line style so the way we got
// between stops is easy to read. Values are SVG `stroke-dasharray` (undefined =
// a solid line). Pair the dotted "walk" style with round line caps.
export const MODE_DASH: Record<TransitMode, string | undefined> = {
    subway: undefined, // solid — the "real" subway line
    walk: "1 10", // dotted
    ferry: "14 10", // dashed
    car: "2 10 14 10", // dash-dot (arrival / departure drives)
}
