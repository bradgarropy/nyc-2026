import {render, screen} from "@testing-library/react"
import {expect, test} from "vitest"

import Route from "~/routes/index"

test("renders the trip map", () => {
    render(<Route />)

    expect(document.title).toEqual("🗽 nyc 2026 | home")
    expect(
        screen.getByRole("img", {name: /nyc 2026 trip map/i}),
    ).toBeInTheDocument()
})
