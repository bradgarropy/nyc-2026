import {render, screen} from "@testing-library/react"
import {expect, test} from "vitest"

import DayItinerary from "~/components/DayItinerary"
import type {Day, Stop} from "~/data/types"

const stops: Record<string, Stop> = {
    "hotel": {
        id: "hotel",
        name: "Hotel",
        coord: {x: 0, y: 0},
        days: [1],
    },
    "hot-dog": {
        id: "hot-dog",
        name: "Hot Dog Cart",
        coord: {x: 0, y: 0},
        days: [1],
    },
    "times-square": {
        id: "times-square",
        name: "Times Square",
        coord: {x: 0, y: 0},
        days: [1],
    },
}

const day: Day = {
    id: 1,
    date: "Tue, Jun 16",
    theme: "Midtown",
    color: "var(--color-mta-red)",
    route: ["hotel", "times-square", "hot-dog"],
    segments: [{mode: "subway", line: "E"}, {mode: "walk"}],
}

test("renders the day header (number, date, theme)", () => {
    render(<DayItinerary day={day} stops={stops} />)

    expect(screen.getByRole("heading", {name: "Day 1"})).toBeInTheDocument()
    expect(screen.getByText("Tue, Jun 16")).toBeInTheDocument()
    expect(screen.getByText("Midtown")).toBeInTheDocument()
})

test("lists each stop by name (no badges or decorative emoji)", () => {
    render(<DayItinerary day={day} stops={stops} />)

    expect(screen.getByText("Hotel")).toBeInTheDocument()
    expect(screen.getByText("Hot Dog Cart")).toBeInTheDocument()
    expect(screen.getByText("Times Square")).toBeInTheDocument()
    expect(screen.queryByText(/⭐/)).not.toBeInTheDocument()
    expect(screen.queryByText(/🌭/)).not.toBeInTheDocument()
})

test("shows the transit mode between stops (with subway line)", () => {
    render(<DayItinerary day={day} stops={stops} />)

    expect(screen.getByText(/Subway E/)).toBeInTheDocument()
    expect(screen.getByText(/Walk/)).toBeInTheDocument()
})
