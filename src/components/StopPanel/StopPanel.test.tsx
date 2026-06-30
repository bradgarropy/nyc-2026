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

test("renders photo thumbnails that link to the full size in a new tab", () => {
    vi.stubEnv("VITE_CLOUDFLARE_IMAGES_HASH", "testhash")

    render(
        <StopPanel
            stop={{...stop, photos: ["wtc/1", "wtc/2"]}}
            dayColors={dayColors}
            onClose={() => {}}
        />,
    )

    const links = screen.getAllByRole("link")
    expect(links).toHaveLength(2)
    expect(links[0]).toHaveAttribute(
        "href",
        "https://imagedelivery.net/testhash/wtc/1/full",
    )
    expect(links[0]).toHaveAttribute("target", "_blank")

    const image = screen.getAllByRole("img", {name: "World Trade Center"})[0]
    expect(image).toHaveAttribute(
        "src",
        "https://imagedelivery.net/testhash/wtc/1/thumbnail",
    )

    vi.unstubAllEnvs()
})

test("renders external links in a new tab", () => {
    render(
        <StopPanel
            stop={{
                ...stop,
                links: [
                    {
                        label: "Casey Neistat video",
                        url: "https://youtu.be/hqxUqRfceEQ",
                    },
                ],
            }}
            dayColors={dayColors}
            onClose={() => {}}
        />,
    )

    const link = screen.getByRole("link", {name: "Casey Neistat video"})
    expect(link).toHaveAttribute("href", "https://youtu.be/hqxUqRfceEQ")
    expect(link).toHaveAttribute("target", "_blank")
})

test("closes via the close button", async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()

    render(<StopPanel stop={stop} dayColors={dayColors} onClose={onClose} />)

    await user.click(screen.getByRole("button", {name: "Close panel"}))
    expect(onClose).toHaveBeenCalledOnce()
})

test("returns focus to the triggering element when closed", () => {
    const {rerender} = render(
        <>
            <button>open</button>
            <StopPanel stop={null} dayColors={dayColors} onClose={() => {}} />
        </>,
    )

    const trigger = screen.getByRole("button", {name: "open"})
    trigger.focus()
    expect(trigger).toHaveFocus()

    rerender(
        <>
            <button>open</button>
            <StopPanel stop={stop} dayColors={dayColors} onClose={() => {}} />
        </>,
    )
    expect(screen.getByRole("button", {name: "Close panel"})).toHaveFocus()

    rerender(
        <>
            <button>open</button>
            <StopPanel stop={null} dayColors={dayColors} onClose={() => {}} />
        </>,
    )
    expect(trigger).toHaveFocus()
})

test("closes on Escape", async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()

    render(<StopPanel stop={stop} dayColors={dayColors} onClose={onClose} />)

    await user.keyboard("{Escape}")
    expect(onClose).toHaveBeenCalledOnce()
})
