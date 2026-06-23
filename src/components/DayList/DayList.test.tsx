import {render, screen} from "@testing-library/react"
import {expect, test} from "vitest"

import DayList from "~/components/DayList"
import type {Day, Stop} from "~/data/types"

const stops: Record<string, Stop> = {
    a: {
        id: "a",
        name: "Stop A",
        coord: {x: 0, y: 0},
        days: [1],
    },
}

const makeDay = (id: number, travel?: boolean): Day => ({
    id,
    date: `Day ${id} date`,
    theme: `Theme ${id}`,
    color: "var(--color-mta-red)",
    route: ["a"],
    segments: [],
    travel,
})

const days = [makeDay(1), makeDay(2), makeDay(3), makeDay(4), makeDay(5, true)]

test("shows every day (including the departure day) when nothing is filtered", () => {
    render(<DayList days={days} stops={stops} selectedDay={null} />)

    expect(screen.getByRole("heading", {name: "Day 1"})).toBeInTheDocument()
    expect(screen.getByRole("heading", {name: "Day 5"})).toBeInTheDocument()
    expect(screen.getAllByRole("heading")).toHaveLength(5)
})

test("shows only the selected day", () => {
    render(<DayList days={days} stops={stops} selectedDay={3} />)

    expect(screen.getByRole("heading", {name: "Day 3"})).toBeInTheDocument()
    expect(
        screen.queryByRole("heading", {name: "Day 1"}),
    ).not.toBeInTheDocument()
    expect(screen.getAllByRole("heading")).toHaveLength(1)
})
