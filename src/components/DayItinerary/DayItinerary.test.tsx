import {render, screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {expect, test, vi} from "vitest"

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
    segments: [{mode: "subway"}, {mode: "walk"}],
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
    expect(screen.queryByText(/⭐|🌭|🚇|🚶|🚗|⛴️/)).not.toBeInTheDocument()
})

test("connects stops with a line segment styled per transit mode", () => {
    const {container} = render(<DayItinerary day={day} stops={stops} />)

    // No per-stop transit text any more — the mode is shown by the line style.
    expect(screen.queryByText(/Subway/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Walk/)).not.toBeInTheDocument()

    // hotel → times-square is a subway segment; times-square → hot-dog is a
    // walk. Each connector contributes two halves (below one dot, above the
    // next), so each mode appears twice.
    expect(container.querySelectorAll('[data-mode="subway"]')).toHaveLength(2)
    expect(container.querySelectorAll('[data-mode="walk"]')).toHaveLength(2)
    expect(container.querySelectorAll('[data-mode="car"]')).toHaveLength(0)
})

test("calls onSelectStop with the stop when its name is clicked", async () => {
    const user = userEvent.setup()
    const onSelectStop = vi.fn()
    render(<DayItinerary day={day} stops={stops} onSelectStop={onSelectStop} />)

    await user.click(screen.getByRole("button", {name: "Times Square"}))

    expect(onSelectStop).toHaveBeenCalledExactlyOnceWith(stops["times-square"])
})

test("renders stop names as plain text when not selectable", () => {
    render(<DayItinerary day={day} stops={stops} />)

    expect(
        screen.queryByRole("button", {name: "Hotel"}),
    ).not.toBeInTheDocument()
    expect(screen.getByText("Hotel")).toBeInTheDocument()
})
