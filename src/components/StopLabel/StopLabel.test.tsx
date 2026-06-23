import {render} from "@testing-library/react"
import {expect, test} from "vitest"

import StopLabel from "~/components/StopLabel"
import type {Stop} from "~/data/types"

const stop = (overrides: Partial<Stop> = {}): Stop => ({
    id: "x",
    name: "Test Stop",
    coord: {x: 100, y: 200},
    days: [1],
    ...overrides,
})

test("renders the stop name (decorative; group carries the label)", () => {
    const {container} = render(
        <svg>
            <StopLabel stop={stop()} />
        </svg>,
    )

    const text = container.querySelector("text")
    expect(text).toHaveTextContent("Test Stop")
    expect(text).toHaveAttribute("aria-hidden", "true")
})

test("is hidden until the stop group is hovered/focused", () => {
    const {container} = render(
        <svg>
            <StopLabel stop={stop()} />
        </svg>,
    )

    const text = container.querySelector("text")
    expect(text?.getAttribute("class")).toContain("opacity-0")
    expect(text?.getAttribute("class")).toContain("group-hover:opacity-100")
})

test("a west-side stop labels to the right", () => {
    const {container} = render(
        <svg>
            <StopLabel stop={stop({coord: {x: 100, y: 200}})} />
        </svg>,
    )

    const text = container.querySelector("text")
    expect(text).toHaveAttribute("text-anchor", "start")
    expect(text).toHaveAttribute("x", "111") // 100 + offset
})

test("an east-side stop labels to the left", () => {
    const {container} = render(
        <svg>
            <StopLabel stop={stop({coord: {x: 500, y: 200}})} />
        </svg>,
    )

    const text = container.querySelector("text")
    expect(text).toHaveAttribute("text-anchor", "end")
    expect(text).toHaveAttribute("x", "489") // 500 - offset
})

test("labelSide overrides the automatic side", () => {
    const {container} = render(
        <svg>
            <StopLabel
                stop={stop({coord: {x: 100, y: 200}, labelSide: "left"})}
            />
        </svg>,
    )

    expect(container.querySelector("text")).toHaveAttribute(
        "text-anchor",
        "end",
    )
})
