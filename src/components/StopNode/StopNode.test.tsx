import {render} from "@testing-library/react"
import {expect, test} from "vitest"

import StopNode from "~/components/StopNode"
import type {Stop} from "~/data/types"

const baseStop: Stop = {
    id: "x",
    name: "Test Stop",
    category: "standard",
    coord: {x: 100, y: 200},
    days: [1],
}

test("renders a labeled circle at the stop coordinate", () => {
    const {container} = render(
        <svg>
            <StopNode stop={baseStop} color="red" />
        </svg>,
    )

    const circle = container.querySelector("circle")
    expect(circle).toHaveAttribute("cx", "100")
    expect(circle).toHaveAttribute("cy", "200")
    expect(circle).toHaveAttribute("aria-label", "Test Stop")
})

test("uses the day color for a normal stop", () => {
    const {container} = render(
        <svg>
            <StopNode stop={baseStop} color="red" />
        </svg>,
    )

    expect(container.querySelector("circle")).toHaveAttribute("stroke", "red")
})

test("hubs use a dark transfer ring and a larger radius", () => {
    const {container} = render(
        <svg>
            <StopNode stop={{...baseStop, isHub: true}} color="red" />
        </svg>,
    )

    const circle = container.querySelector("circle")
    expect(circle).toHaveAttribute("stroke", "#1a1a1a")
    expect(circle).toHaveAttribute("r", "7")
})
