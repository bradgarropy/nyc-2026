import {expect, test} from "vitest"

import {MAP_HEIGHT, MAP_WIDTH} from "~/components/TripMap/TripMap"
import {trip} from "~/data/trip"

const {days, stops} = trip

test("every routed stop id exists in stops", () => {
    for (const day of days) {
        for (const id of day.route) {
            expect(
                stops[id],
                `day ${day.id} references unknown stop "${id}"`,
            ).toBeDefined()
        }
    }
})

test("each day has one segment between consecutive stops", () => {
    for (const day of days) {
        expect(day.segments.length, `day ${day.id} segment count`).toBe(
            day.route.length - 1,
        )
    }
})

test("a stop's `days` matches exactly the days that route through it", () => {
    for (const [id, stop] of Object.entries(stops)) {
        const routedDays = days
            .filter(day => day.route.includes(id))
            .map(day => day.id)
            .sort((a, b) => a - b)

        expect(
            [...stop.days].sort((a, b) => a - b),
            `${id} days`,
        ).toEqual(routedDays)
    }
})

test("no orphan stops — every stop is used by at least one day", () => {
    const routed = new Set(days.flatMap(day => day.route))

    for (const id of Object.keys(stops)) {
        expect(routed.has(id), `stop "${id}" is never routed`).toBe(true)
    }
})

test("every stop sits within the map bounds", () => {
    for (const [id, stop] of Object.entries(stops)) {
        expect(stop.coord.x, `${id} x`).toBeGreaterThanOrEqual(0)
        expect(stop.coord.x, `${id} x`).toBeLessThanOrEqual(MAP_WIDTH)
        expect(stop.coord.y, `${id} y`).toBeGreaterThanOrEqual(0)
        expect(stop.coord.y, `${id} y`).toBeLessThanOrEqual(MAP_HEIGHT)
    }
})

test("each stop's record key matches its id", () => {
    for (const [key, stop] of Object.entries(stops)) {
        expect(stop.id, `key "${key}"`).toBe(key)
    }
})
