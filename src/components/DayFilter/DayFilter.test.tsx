import {render, screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {expect, test, vi} from "vitest"

import DayFilter from "~/components/DayFilter"
import type {Day} from "~/data/types"

const day = (id: number, travel?: boolean): Day => ({
    id,
    date: "",
    theme: "",
    color: `var(--color-day-${id})`,
    route: [],
    segments: [],
    travel,
})

const days = [day(1), day(2), day(3), day(4), day(5, true)]

test("shows All Days plus every day including the departure day", () => {
    render(<DayFilter days={days} selectedDay={null} onSelect={() => {}} />)

    expect(screen.getByRole("button", {name: "All Days"})).toBeInTheDocument()
    expect(screen.getByRole("button", {name: "Day 1"})).toBeInTheDocument()
    expect(screen.getByRole("button", {name: "Day 4"})).toBeInTheDocument()
    expect(screen.getByRole("button", {name: "Day 5"})).toBeInTheDocument()
})

test("marks the selected day as pressed", () => {
    render(<DayFilter days={days} selectedDay={2} onSelect={() => {}} />)

    expect(screen.getByRole("button", {name: "Day 2"})).toHaveAttribute(
        "aria-pressed",
        "true",
    )
    expect(screen.getByRole("button", {name: "All Days"})).toHaveAttribute(
        "aria-pressed",
        "false",
    )
})

test("calls onSelect with the day id, and null for All Days", async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()

    render(<DayFilter days={days} selectedDay={null} onSelect={onSelect} />)

    await user.click(screen.getByRole("button", {name: "Day 3"}))
    expect(onSelect).toHaveBeenCalledWith(3)

    await user.click(screen.getByRole("button", {name: "All Days"}))
    expect(onSelect).toHaveBeenCalledWith(null)
})
