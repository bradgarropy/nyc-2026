import {render} from "@testing-library/react"
import {expect, test} from "vitest"

import DayLine from "~/components/DayLine"
import type {Day, Stop} from "~/data/types"

const stops: Record<string, Stop> = {
    a: {
        id: "a",
        name: "A",
        coord: {x: 0, y: 0},
        days: [1],
    },
    b: {
        id: "b",
        name: "B",
        coord: {x: 10, y: 10},
        days: [1],
    },
    c: {
        id: "c",
        name: "C",
        coord: {x: 20, y: 0},
        days: [1],
    },
}

const day: Day = {
    id: 1,
    date: "",
    theme: "",
    color: "var(--color-mta-red)",
    route: ["a", "b", "c"],
    segments: [{mode: "walk"}, {mode: "subway"}],
}

test("draws one path per segment", () => {
    const {container} = render(
        <svg>
            <DayLine day={day} stops={stops} />
        </svg>,
    )

    expect(container.querySelectorAll("path")).toHaveLength(2)
})

test("uses the day color and mode-driven dash styles", () => {
    const {container} = render(
        <svg>
            <DayLine day={day} stops={stops} />
        </svg>,
    )

    const paths = container.querySelectorAll("path")

    expect(paths[0]).toHaveAttribute("stroke", "var(--color-mta-red)")
    expect(paths[0]).toHaveAttribute("stroke-dasharray", "1 10") // walk = dotted
    expect(paths[1]).not.toHaveAttribute("stroke-dasharray") // subway = solid
})

test("routes a segment through optional waypoints", () => {
    const waypointDay: Day = {
        ...day,
        segments: [{mode: "ferry", via: [{x: 10, y: 0}]}],
        route: ["a", "c"],
    }

    const {container} = render(
        <svg>
            <DayLine day={waypointDay} stops={stops} />
        </svg>,
    )

    expect(container.querySelector("path")).toHaveAttribute(
        "d",
        "M 0 0 L 10 0 L 20 0",
    )
})
