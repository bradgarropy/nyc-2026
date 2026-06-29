import type {Day, Stop} from "~/data/types"
import {routePath, segmentPath} from "~/utils/path"
import {MODE_DASH} from "~/utils/trip"

type DayLineProps = {
    day: Day
    stops: Record<string, Stop>
    strokeWidth?: number
    // Faded back when another day is selected in the filter.
    dimmed?: boolean
}

// One day's route, drawn segment-by-segment so each leg can carry its own
// mode-driven stroke style (walk dotted, subway solid, ferry dashed, car
// dash-dot).
const DayLine = ({
    day,
    stops,
    strokeWidth = 8,
    dimmed = false,
}: DayLineProps) => {
    return (
        <g
            aria-label={`Day ${day.id} line`}
            opacity={dimmed ? 0.15 : 1}
            className="transition-opacity duration-200"
        >
            {day.segments.map((segment, index) => {
                const from = stops[day.route[index]]
                const to = stops[day.route[index + 1]]

                return (
                    <path
                        key={`${from.id}-${to.id}-${index}`}
                        d={
                            segment.via
                                ? routePath([
                                      from.coord,
                                      ...segment.via,
                                      to.coord,
                                  ])
                                : segmentPath(from.coord, to.coord)
                        }
                        fill="none"
                        stroke={day.color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray={MODE_DASH[segment.mode]}
                    />
                )
            })}
        </g>
    )
}

export default DayLine
