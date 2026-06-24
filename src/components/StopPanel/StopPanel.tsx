import {useEffect, useRef, useState} from "react"

import type {Stop} from "~/data/types"
import {createImageUrl} from "~/utils/images"
import {subwayLineColor, textColorOn} from "~/utils/trip"

type StopPanelProps = {
    stop: Stop | null
    dayColors: Record<number, string>
    onClose: () => void
}

// Subway lines with light bullets need dark text.
const DARK_TEXT_LINES = new Set(["N", "Q", "R", "W", "L", "S"])

// A detail panel for a stop: photos, notes, the days it belongs to, and the
// subway lines used. Renders as a bottom sheet on mobile and a right-side
// drawer on larger screens. It stays mounted and animates in/out with CSS
// transitions; `stop` drives the open state, and the last stop is retained so
// its content remains visible while the panel slides closed.
const StopPanel = ({stop, dayColors, onClose}: StopPanelProps) => {
    const closeRef = useRef<HTMLButtonElement>(null)
    const [lastStop, setLastStop] = useState<Stop | null>(stop)
    const open = stop !== null
    const content = stop ?? lastStop

    useEffect(() => {
        if (stop) {
            setLastStop(stop)
        }
    }, [stop])

    useEffect(() => {
        if (!open) {
            return
        }

        closeRef.current?.focus()

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose()
            }
        }

        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [open, onClose])

    const photos = content?.photos ?? []
    const placeholderCount = photos.length === 0 ? 3 : 0

    return (
        <div
            aria-hidden={!open}
            inert={!open}
            className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
        >
            <button
                type="button"
                tabIndex={-1}
                aria-label="Close"
                onClick={onClose}
                className={`absolute inset-0 h-full w-full cursor-default bg-black/40 transition-opacity duration-300 ${
                    open ? "opacity-100" : "opacity-0"
                }`}
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="stop-panel-title"
                className={`font-helvetica absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl transition duration-300 ease-out sm:inset-x-auto sm:inset-y-0 sm:right-0 sm:max-h-none sm:w-[26rem] sm:rounded-none ${
                    open
                        ? "translate-x-0 translate-y-0 opacity-100"
                        : "translate-y-full opacity-0 sm:translate-x-full sm:translate-y-0"
                }`}
            >
                {content ? (
                    <>
                        <div className="flex items-start justify-between gap-4 border-b border-gray-100 p-5">
                            <div>
                                <h2
                                    id="stop-panel-title"
                                    className="text-xl font-bold text-[#1a1a1a]"
                                >
                                    {content.name}
                                </h2>

                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    {content.days.map(day => (
                                        <span
                                            key={day}
                                            className="rounded-full px-2 py-0.5 text-xs font-semibold"
                                            style={{
                                                backgroundColor: dayColors[day],
                                                color: textColorOn(
                                                    dayColors[day],
                                                ),
                                            }}
                                        >
                                            Day {day}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <button
                                ref={closeRef}
                                type="button"
                                onClick={onClose}
                                aria-label="Close panel"
                                className="-m-1 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M5 5l10 10M15 5L5 15"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5">
                            <div className="grid grid-cols-3 gap-2">
                                {photos.map(id => (
                                    <a
                                        key={id}
                                        href={createImageUrl(id, "full")}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                                    >
                                        <img
                                            src={createImageUrl(id, "thumb")}
                                            alt={content.name}
                                            loading="lazy"
                                            className="aspect-square w-full rounded-lg object-cover"
                                        />
                                    </a>
                                ))}

                                {Array.from({length: placeholderCount}).map(
                                    (_, index) => (
                                        <div
                                            key={index}
                                            className="flex aspect-square items-center justify-center rounded-lg bg-gray-100 text-gray-300"
                                        >
                                            <svg
                                                width="22"
                                                height="22"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                aria-hidden="true"
                                            >
                                                <rect
                                                    x="3"
                                                    y="5"
                                                    width="18"
                                                    height="14"
                                                    rx="2"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                />
                                                <circle
                                                    cx="8.5"
                                                    cy="10"
                                                    r="1.5"
                                                    fill="currentColor"
                                                />
                                                <path
                                                    d="M5 17l4-4 3 3 3-4 4 5"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>
                                    ),
                                )}
                            </div>

                            {content.notes ? (
                                <p className="mt-4 text-sm leading-relaxed text-gray-600">
                                    {content.notes}
                                </p>
                            ) : null}

                            {content.subwayLines?.length ? (
                                <div className="mt-5">
                                    <h3 className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                                        Subway
                                    </h3>
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                        {content.subwayLines.map(line => (
                                            <span
                                                key={line}
                                                className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                                                style={{
                                                    backgroundColor:
                                                        subwayLineColor(line),
                                                    color: DARK_TEXT_LINES.has(
                                                        line.toUpperCase(),
                                                    )
                                                        ? "#1a1a1a"
                                                        : "white",
                                                }}
                                            >
                                                {line}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    )
}

export default StopPanel
