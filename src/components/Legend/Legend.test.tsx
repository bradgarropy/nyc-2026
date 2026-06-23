import {render, screen, within} from "@testing-library/react"
import {expect, test} from "vitest"

import Legend from "~/components/Legend"
import {MODE_DASH} from "~/utils/trip"

test("renders a labelled list of the four transit modes", () => {
    render(<Legend />)

    const list = screen.getByRole("region", {name: "Transit modes"})
    const items = within(list).getAllByRole("listitem")

    expect(items).toHaveLength(4)
    expect(within(list).getByText("Subway")).toBeInTheDocument()
    expect(within(list).getByText("Walk")).toBeInTheDocument()
    expect(within(list).getByText("Ferry")).toBeInTheDocument()
    expect(within(list).getByText("Car")).toBeInTheDocument()
})

test("each line sample uses its mode's dash style", () => {
    const {container} = render(<Legend />)
    const lines = container.querySelectorAll("line")

    // order: walk, car, ferry, subway — subway is solid (no dash array).
    expect(lines[0].getAttribute("stroke-dasharray")).toBe(MODE_DASH.walk)
    expect(lines[1].getAttribute("stroke-dasharray")).toBe(MODE_DASH.car)
    expect(lines[2].getAttribute("stroke-dasharray")).toBe(MODE_DASH.ferry)
    expect(lines[3].getAttribute("stroke-dasharray")).toBeNull()
})
