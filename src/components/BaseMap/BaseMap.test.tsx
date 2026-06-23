import {render} from "@testing-library/react"
import {expect, test} from "vitest"

import BaseMap from "~/components/BaseMap"

test("renders the base map group", () => {
    const {getByTestId} = render(
        <svg>
            <BaseMap />
        </svg>,
    )

    expect(getByTestId("base-map")).toBeInTheDocument()
})

test("draws the boroughs and parks", () => {
    const {container} = render(
        <svg>
            <BaseMap />
        </svg>,
    )

    // 4 land pieces + 2 parks
    expect(container.querySelectorAll("path")).toHaveLength(6)
})

test("draws water, land, and green parks", () => {
    const {container} = render(
        <svg>
            <BaseMap />
        </svg>,
    )

    expect(
        container.querySelector('[fill="var(--color-mta-water)"]'),
    ).toBeInTheDocument()
    expect(
        container.querySelector('[fill="var(--color-mta-paper)"]'),
    ).toBeInTheDocument()
    expect(
        container.querySelector('[fill="var(--color-mta-park)"]'),
    ).toBeInTheDocument()
})
