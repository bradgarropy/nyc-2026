import {render, screen} from "@testing-library/react"
import {expect, test} from "vitest"

import TripMap from "~/components/TripMap"

test("renders the map canvas", () => {
    render(<TripMap />)

    const svg = screen.getByRole("img", {name: /nyc 2026 trip map/i})
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute("viewBox", "0 0 1000 1500")
})

test("renders its children inside the canvas", () => {
    render(
        <TripMap>
            <circle data-testid="stop" cx={10} cy={10} r={5} />
        </TripMap>,
    )

    expect(screen.getByTestId("stop")).toBeInTheDocument()
})
