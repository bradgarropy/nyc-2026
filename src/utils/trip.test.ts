import {expect, test} from "vitest"

import {MODE_DASH, subwayLineColor, textColorOn} from "~/utils/trip"

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
