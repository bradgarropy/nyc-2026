import {expect, test} from "vitest"

import {MODE_DASH} from "~/utils/trip"

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
