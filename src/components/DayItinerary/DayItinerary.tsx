import type {Day, Stop, TransitMode} from "~/data/types"

const MODE: Record<TransitMode, {icon: string; label: string}> = {
    walk: {icon: "🚶", label: "Walk"},
    subway: {icon: "🚇", label: "Subway"},
    ferry: {icon: "⛴️", label: "Ferry"},
    car: {icon: "🚗", label: "Car"},
}

type DayItineraryProps = {
    day: Day
    stops: Record<string, Stop>
}

// A single day's events as a stylized subway-line itinerary: a colored vertical
// line with station dots, each stop's name + major badge, and the transit mode
// used to reach the next stop.
const DayItinerary = ({day, stops}: DayItineraryProps) => {
    return (
        <section
            aria-label={`Day ${day.id} itinerary`}
            className="font-helvetica overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
        >
            <header className="px-4 py-3">
                <div className="flex items-baseline gap-2">
                    <h3 className="text-lg font-bold text-[#1a1a1a]">
                        Day {day.id}
                    </h3>
                    <span className="text-sm text-gray-500">{day.date}</span>
                </div>
                <p className="text-sm font-semibold" style={{color: day.color}}>
                    {day.theme}
                </p>
            </header>

            <ol className="px-4 py-3">
                {day.route.map((stopId, index) => {
                    const stop = stops[stopId]
                    const segment = day.segments[index]
                    const mode = segment ? MODE[segment.mode] : null
                    const isLast = index === day.route.length - 1

                    return (
                        <li key={`${stopId}-${index}`} className="flex gap-3">
                            {/* marker column: a dot centered on the first text
                                line, with line segments above/below it. The
                                segment above the first dot and below the last
                                are omitted, so the line starts and ends on a
                                circle. */}
                            <div
                                className="relative w-3.5 shrink-0 self-stretch"
                                aria-hidden="true"
                            >
                                {index > 0 ? (
                                    <span
                                        className="absolute top-0 left-1/2 h-[11px] w-0.5 -translate-x-1/2"
                                        style={{backgroundColor: day.color}}
                                    />
                                ) : null}
                                {!isLast ? (
                                    <span
                                        className="absolute top-[11px] bottom-0 left-1/2 w-0.5 -translate-x-1/2"
                                        style={{backgroundColor: day.color}}
                                    />
                                ) : null}
                                <span
                                    className="absolute top-[11px] left-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] bg-white"
                                    style={{borderColor: day.color}}
                                />
                            </div>

                            <div className="pb-4">
                                <div className="text-sm font-semibold text-[#1a1a1a]">
                                    {stop.name}
                                </div>

                                {mode ? (
                                    <div className="mt-1 text-xs text-gray-400">
                                        ↓ {mode.icon} {mode.label}
                                        {segment?.line
                                            ? ` ${segment.line}`
                                            : ""}
                                    </div>
                                ) : null}
                            </div>
                        </li>
                    )
                })}
            </ol>
        </section>
    )
}

export default DayItinerary
