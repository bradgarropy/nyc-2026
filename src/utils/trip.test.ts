import {expect, test} from "vitest"

import {MODE_DASH, subwayLineColor} from "~/utils/trip"

test("subwayLineColor maps lines to their trunk color", () => {
    expect(subwayLineColor("E")).toBe("var(--color-mta-blue)")
    expect(subwayLineColor("1")).toBe("var(--color-mta-red)")
    expect(subwayLineColor("N")).toBe("var(--color-mta-yellow)")
})

test("subwayLineColor falls back to grey for unknown lines", () => {
    expect(subwayLineColor("X")).toBe("var(--color-mta-grey)")
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
