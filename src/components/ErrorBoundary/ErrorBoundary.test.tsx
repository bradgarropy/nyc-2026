import {render, screen} from "@testing-library/react"
import type {ErrorResponse} from "react-router"
import {isRouteErrorResponse} from "react-router"
import {expect, test, vitest} from "vitest"

import ErrorBoundary from "~/components/ErrorBoundary"

vitest.mock("react-router", () => ({
    isRouteErrorResponse: vitest.fn(),
}))

const isRouteErrorResponseMock = vitest.mocked(isRouteErrorResponse)

test("shows route error", () => {
    const mockErrorResponse: ErrorResponse = {
        status: 500,
        statusText: "Internal server error",
        data: "Something went wrong",
    }

    isRouteErrorResponseMock.mockReturnValue(true)

    render(<ErrorBoundary error={mockErrorResponse} />)

    expect(screen.getByText("500 Internal server error")).toBeInTheDocument()
    expect(screen.getByText("Something went wrong")).toBeInTheDocument()
})

test("shows javascript error", () => {
    const mockError = new Error("Something went wrong", {cause: "Unknown"})

    isRouteErrorResponseMock.mockReturnValue(false)

    render(<ErrorBoundary error={mockError} />)

    expect(screen.getByText("Error: Something went wrong")).toBeInTheDocument()
    expect(screen.getByText("at file://", {exact: false})).toBeInTheDocument()
})

test("shows unknown error", () => {
    isRouteErrorResponseMock.mockReturnValue(false)

    render(<ErrorBoundary error="Something went wrong" />)

    expect(screen.getByText("Unknown error")).toBeInTheDocument()
})
