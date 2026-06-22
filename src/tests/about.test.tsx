import {render, screen} from "@testing-library/react"
import {expect, test} from "vitest"

import Route from "~/routes/about"

test("renders", () => {
    render(<Route />)

    expect(document.title).toEqual("🗽 nyc 2026 | about")
    expect(screen.getByText("About")).toBeInTheDocument()
})
