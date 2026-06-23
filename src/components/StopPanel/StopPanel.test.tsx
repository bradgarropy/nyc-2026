import {render, screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {expect, test, vi} from "vitest"

import StopPanel from "~/components/StopPanel"
import type {Stop} from "~/data/types"

const stop: Stop = {
    id: "wtc",
    name: "World Trade Center",
    coord: {x: 0, y: 0},
    days: [2, 4],
    notes: "Some notes about the stop.",
    subwayLines: ["E"],
}

const dayColors: Record<number, string> = {
    2: "var(--color-mta-blue)",
    4: "var(--color-mta-orange)",
}

test("is hidden from the accessibility tree when no stop is selected", () => {
    render(<StopPanel stop={null} dayColors={dayColors} onClose={() => {}} />)

    // the panel stays mounted (to animate), but is aria-hidden/inert when closed
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
})

test("shows the stop name, day chips, notes, and subway lines", () => {
    render(<StopPanel stop={stop} dayColors={dayColors} onClose={() => {}} />)

    expect(
        screen.getByRole("heading", {name: "World Trade Center"}),
    ).toBeInTheDocument()
    expect(screen.getByText("Day 2")).toBeInTheDocument()
    expect(screen.getByText("Day 4")).toBeInTheDocument()
    expect(screen.getByText("Some notes about the stop.")).toBeInTheDocument()
    expect(screen.getByText("E")).toBeInTheDocument()
})

test("closes via the close button", async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()

    render(<StopPanel stop={stop} dayColors={dayColors} onClose={onClose} />)

    await user.click(screen.getByRole("button", {name: "Close panel"}))
    expect(onClose).toHaveBeenCalledOnce()
})

test("closes on Escape", async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()

    render(<StopPanel stop={stop} dayColors={dayColors} onClose={onClose} />)

    await user.keyboard("{Escape}")
    expect(onClose).toHaveBeenCalledOnce()
})
