import {expect, test} from "vitest"

import {bend, routePath, segmentPath} from "~/utils/path"

test("no bend for a horizontal leg", () => {
    expect(bend({x: 0, y: 0}, {x: 10, y: 0})).toBeNull()
})

test("no bend for a vertical leg", () => {
    expect(bend({x: 0, y: 0}, {x: 0, y: 10})).toBeNull()
})

test("no bend for a perfect 45° diagonal", () => {
    expect(bend({x: 0, y: 0}, {x: 5, y: 5})).toBeNull()
})

test("wide leg bends straight horizontally, then diagonally", () => {
    // adx (10) > ady (4): run along y = 0, then 45° into the point.
    expect(bend({x: 0, y: 0}, {x: 10, y: 4})).toEqual({x: 6, y: 0})
})

test("tall leg bends straight vertically, then diagonally", () => {
    // ady (10) > adx (4): run along x = 0, then 45° into the point.
    expect(bend({x: 0, y: 0}, {x: 4, y: 10})).toEqual({x: 0, y: 6})
})

test("bend respects negative directions", () => {
    expect(bend({x: 10, y: 10}, {x: 0, y: 6})).toEqual({x: 4, y: 10})
})

test("segmentPath inserts the bend corner", () => {
    expect(segmentPath({x: 0, y: 0}, {x: 10, y: 4})).toEqual(
        "M 0 0 L 6 0 L 10 4",
    )
})

test("segmentPath is a straight line when no bend is needed", () => {
    expect(segmentPath({x: 0, y: 0}, {x: 10, y: 10})).toEqual("M 0 0 L 10 10")
})

test("routePath is empty for no points", () => {
    expect(routePath([])).toEqual("")
})

test("routePath chains legs with their bends", () => {
    const d = routePath([
        {x: 0, y: 0},
        {x: 10, y: 4},
        {x: 10, y: 20},
    ])

    expect(d).toEqual("M 0 0 L 6 0 L 10 4 L 10 20")
})
