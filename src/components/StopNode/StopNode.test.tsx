import {render} from "@testing-library/react"
import {expect, test} from "vitest"

import StopNode from "~/components/StopNode"
import type {Stop} from "~/data/types"

const baseStop: Stop = {
    id: "x",
    name: "Test Stop",
    coord: {x: 100, y: 200},
    days: [1],
}

test("renders a circle at the stop coordinate", () => {
    const {container} = render(
        <svg>
            <StopNode stop={baseStop} color="red" />
        </svg>,
    )

    const circle = container.querySelector("circle")
    expect(circle).toHaveAttribute("cx", "100")
    expect(circle).toHaveAttribute("cy", "200")
})

test("uses the day color for the ring, with a uniform radius", () => {
    const {container} = render(
        <svg>
            <StopNode stop={baseStop} color="red" />
        </svg>,
    )

    const circle = container.querySelector("circle")
    expect(circle).toHaveAttribute("stroke", "red")
    expect(circle).toHaveAttribute("r", "5")
})

test("pops (scales up) when hovered", () => {
    const {container} = render(
        <svg>
            <StopNode stop={baseStop} color="red" hovered />
        </svg>,
    )

    const circle = container.querySelector("circle")
    expect(circle).toHaveAttribute("data-hovered", "true")
    expect(circle?.getAttribute("class")).toContain("scale-[1.4]")
})

test("is not popped by default", () => {
    const {container} = render(
        <svg>
            <StopNode stop={baseStop} color="red" />
        </svg>,
    )

    expect(container.querySelector("circle")).not.toHaveAttribute(
        "data-hovered",
    )
})
