import {render, screen} from "@testing-library/react"
import {expect, test} from "vitest"

import Route from "~/routes/index"

test("renders", () => {
    render(<Route />)

    expect(document.title).toEqual("🗽 nyc 2026 | home")
    expect(screen.getByText("Home")).toBeInTheDocument()
})
