import {expect, test} from "vitest"

import type {Day, Stop} from "~/data/types"
import {
    MODE_DASH,
    subwayLineColor,
    textColorOn,
    visitOrderedStops,
} from "~/utils/trip"

test("subwayLineColor maps lines to their trunk color", () => {
    expect(subwayLineColor("E")).toBe("var(--color-mta-blue)")
    expect(subwayLineColor("1")).toBe("var(--color-mta-red)")
    expect(subwayLineColor("N")).toBe("var(--color-mta-yellow)")
})

test("subwayLineColor falls back to grey for unknown lines", () => {
    expect(subwayLineColor("X")).toBe("var(--color-mta-grey)")
})

test("textColorOn uses dark text on light fills (yellow) and white otherwise", () => {
    expect(textColorOn("var(--color-mta-yellow)")).toBe("#1a1a1a")
    expect(textColorOn("var(--color-mta-blue)")).toBe("white")
    expect(textColorOn("var(--color-mta-red)")).toBe("white")
})

test("visitOrderedStops lists unique stops in first-visit order", () => {
    const stops: Record<string, Stop> = {
        a: {id: "a", name: "A", coord: {x: 0, y: 0}, days: [1]},
        b: {id: "b", name: "B", coord: {x: 0, y: 0}, days: [1, 2]},
        c: {id: "c", name: "C", coord: {x: 0, y: 0}, days: [2]},
        d: {id: "d", name: "D", coord: {x: 0, y: 0}, days: []},
    }

    const days = [
        {
            id: 1,
            date: "",
            theme: "",
            color: "",
            route: ["a", "b", "a"],
            segments: [],
        },
        {
            id: 2,
            date: "",
            theme: "",
            color: "",
            route: ["b", "c"],
            segments: [],
        },
    ] satisfies Day[]

    // a, b (first visits on day 1), c (day 2), then d (never routed) appended.
    expect(visitOrderedStops(days, stops).map(stop => stop.id)).toEqual([
        "a",
        "b",
        "c",
        "d",
    ])
})

test("MODE_DASH renders subway as a solid line", () => {
    expect(MODE_DASH.subway).toBeUndefined()
})

test("MODE_DASH gives walk, ferry, and car distinct dash patterns", () => {
    const {walk, ferry, car} = MODE_DASH
    const patterns = [walk, ferry, car]

    for (const pattern of patterns) {
        expect(pattern).toBeTypeOf("string")
    }

    expect(new Set(patterns).size).toEqual(patterns.length)
})
