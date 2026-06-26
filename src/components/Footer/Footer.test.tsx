import {render, screen} from "@testing-library/react"
import {expect, test} from "vitest"

import Footer from "~/components/Footer"

test("renders", () => {
    render(<Footer />)
    expect(
        screen.getByText(
            "An interactive keepsake of our trip to New York City",
        ),
    ).toBeInTheDocument()
    expect(screen.getByRole("link", {name: "Built by BG"})).toHaveAttribute(
        "href",
        "https://bradgarropy.com",
    )
    expect(screen.getByRole("link", {name: "GitHub"})).toHaveAttribute(
        "href",
        "https://github.com/bradgarropy/nyc-2026",
    )
})
