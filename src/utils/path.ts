// Octilinear (45°) SVG path helpers for the subway-style routes.
//
// Real transit maps only draw horizontal, vertical, and 45° diagonal segments.
// Between two stops we draw a single bend: a straight run, then a 45° diagonal
// into the destination.

export type Point = {x: number; y: number}

const sign = (n: number): number => (n < 0 ? -1 : 1)

// The 45°-aware bend corner between `a` and `b` (straight run from `a`, then a
// diagonal into `b`). Returns null when the leg is already horizontal, vertical,
// or a perfect 45° diagonal and needs no bend.
export const bend = (a: Point, b: Point): Point | null => {
    const dx = b.x - a.x
    const dy = b.y - a.y
    const adx = Math.abs(dx)
    const ady = Math.abs(dy)

    if (adx === 0 || ady === 0 || adx === ady) {
        return null
    }

    const diagonal = Math.min(adx, ady)

    return {
        x: b.x - sign(dx) * diagonal,
        y: b.y - sign(dy) * diagonal,
    }
}

// SVG path for a single octilinear segment from `a` to `b`.
export const segmentPath = (a: Point, b: Point): string => {
    const corner = bend(a, b)

    return corner
        ? `M ${a.x} ${a.y} L ${corner.x} ${corner.y} L ${b.x} ${b.y}`
        : `M ${a.x} ${a.y} L ${b.x} ${b.y}`
}

// SVG path for a whole route, used when a single styled stroke is enough.
export const routePath = (points: Point[]): string => {
    if (points.length === 0) {
        return ""
    }

    let d = `M ${points[0].x} ${points[0].y}`

    for (let i = 1; i < points.length; i++) {
        const corner = bend(points[i - 1], points[i])

        if (corner) {
            d += ` L ${corner.x} ${corner.y}`
        }

        d += ` L ${points[i].x} ${points[i].y}`
    }

    return d
}
