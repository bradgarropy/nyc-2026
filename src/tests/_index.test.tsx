import {render, screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {expect, test} from "vitest"

import Route from "~/routes/index"

test("renders the trip map", () => {
    render(<Route />)

    expect(document.title).toEqual("nyc 2026")
    expect(
        screen.getByRole("img", {name: /nyc 2026 trip map/i}),
    ).toBeInTheDocument()
})

test("colors shared stops with the selected day", async () => {
    const user = userEvent.setup()

    render(<Route />)

    const map = screen.getByRole("img", {name: /nyc 2026 trip map/i})
    const nintendoStore = map.querySelector('[aria-label="Nintendo Store"]')
    const node = nintendoStore?.querySelector("circle")

    expect(node).toHaveAttribute("stroke", "var(--color-mta-blue)")

    await user.click(screen.getByRole("button", {name: "Day 2"}))

    expect(node).toHaveAttribute("stroke", "var(--color-mta-yellow)")
})
