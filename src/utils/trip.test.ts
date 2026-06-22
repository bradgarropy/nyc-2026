import {expect, test} from "vitest"

import type {Day} from "~/data/types"
import {filterableDays, MODE_DASH} from "~/utils/trip"

const day = (id: number, travel?: boolean): Day => ({
    id,
    date: "",
    theme: "",
    color: "",
    route: [],
    segments: [],
    travel,
})

test("filterableDays keeps the touring days", () => {
    const days = [day(1), day(2), day(3), day(4)]
    expect(filterableDays(days).map(d => d.id)).toEqual([1, 2, 3, 4])
})

test("filterableDays drops travel-only days", () => {
    const days = [day(1), day(2), day(3), day(4), day(5, true)]
    expect(filterableDays(days).map(d => d.id)).toEqual([1, 2, 3, 4])
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
