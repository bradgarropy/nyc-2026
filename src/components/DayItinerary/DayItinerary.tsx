import type {CSSProperties} from "react"

import type {Day, Stop, TransitMode} from "~/data/types"

// The line style for the connector between two stops, keyed by transit mode.
// This mirrors the map's `MODE_DASH` (subway solid, walk dotted, ferry dashed,
// car dash-dot) using CSS backgrounds so the timeline reads the same way as the
// map without any per-stop text. The connector is a 2px-wide vertical bar.
const connectorStyle = (mode: TransitMode, color: string): CSSProperties => {
    switch (mode) {
        case "subway":
            // solid — the "real" subway line
            return {backgroundColor: color}
        case "walk":
            // dotted — round dots
            return {
                backgroundImage: `radial-gradient(circle, ${color} 0 1px, transparent 1.5px)`,
                backgroundSize: "2px 6px",
                backgroundRepeat: "repeat-y",
                backgroundPosition: "center",
            }
        case "ferry":
            // dashed
            return {
                backgroundImage: `repeating-linear-gradient(to bottom, ${color} 0 6px, transparent 6px 10px)`,
            }
        case "car":
            // dash-dot (arrival / departure drives)
            return {
                backgroundImage: `repeating-linear-gradient(to bottom, ${color} 0 2px, transparent 2px 6px, ${color} 6px 12px, transparent 12px 16px)`,
            }
    }
}

type DayItineraryProps = {
    day: Day
    stops: Record<string, Stop>
    // When provided, each stop name becomes a button that opens its detail
    // panel — mirroring the clickable stops on the map.
    onSelectStop?: (stop: Stop) => void
}

// A single day's events as a stylized subway-line itinerary: station dots joined
// by a colored line whose style encodes how we travelled between each pair of
// stops (see `connectorStyle`).
const DayItinerary = ({day, stops, onSelectStop}: DayItineraryProps) => {
    return (
        <section
            aria-label={`Day ${day.id} itinerary`}
            className="font-helvetica overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
        >
            <header className="px-4 py-3">
                <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-lg font-bold text-[#1a1a1a]">
                        Day {day.id}
                    </h3>
                    <span className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                        {day.date}
                    </span>
                </div>
                <p className="text-sm font-semibold" style={{color: day.color}}>
                    {day.theme}
                </p>
            </header>

            <ol className="px-4 py-3">
                {day.route.map((stopId, index) => {
                    const stop = stops[stopId]
                    const isLast = index === day.route.length - 1

                    // The connector above this dot belongs to the previous
                    // segment; the one below belongs to this one. Both halves of
                    // a connector therefore share the same mode.
                    const prevMode =
                        index > 0 ? day.segments[index - 1]?.mode : undefined
                    const nextMode = !isLast
                        ? day.segments[index]?.mode
                        : undefined

                    return (
                        <li key={`${stopId}-${index}`} className="flex gap-3">
                            {/* marker column: a dot centered on the stop name,
                                with mode-styled line segments above/below it.
                                The segment above the first dot and below the
                                last are omitted, so the line starts and ends on
                                a circle. */}
                            <div
                                className="relative w-3.5 shrink-0 self-stretch"
                                aria-hidden="true"
                            >
                                {prevMode ? (
                                    <span
                                        data-mode={prevMode}
                                        className="absolute top-0 left-1/2 h-[11px] w-0.5 -translate-x-1/2"
                                        style={connectorStyle(
                                            prevMode,
                                            day.color,
                                        )}
                                    />
                                ) : null}
                                {nextMode ? (
                                    <span
                                        data-mode={nextMode}
                                        className="absolute top-[11px] bottom-0 left-1/2 w-0.5 -translate-x-1/2"
                                        style={connectorStyle(
                                            nextMode,
                                            day.color,
                                        )}
                                    />
                                ) : null}
                                <span
                                    className="absolute top-[11px] left-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] bg-white"
                                    style={{borderColor: day.color}}
                                />
                            </div>

                            <div className={isLast ? "pb-3" : "pb-8"}>
                                {onSelectStop ? (
                                    <button
                                        type="button"
                                        onClick={() => onSelectStop(stop)}
                                        className="cursor-pointer rounded text-left text-sm font-semibold text-[#1a1a1a] focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                                    >
                                        {stop.name}
                                    </button>
                                ) : (
                                    <span className="text-sm font-semibold text-[#1a1a1a]">
                                        {stop.name}
                                    </span>
                                )}
                            </div>
                        </li>
                    )
                })}
            </ol>
        </section>
    )
}

export default DayItinerary
