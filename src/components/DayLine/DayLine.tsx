import type {Day, Stop} from "~/data/types"
import {segmentPath} from "~/utils/path"
import {MODE_DASH} from "~/utils/trip"

type DayLineProps = {
    day: Day
    stops: Record<string, Stop>
    strokeWidth?: number
}

// One day's route, drawn segment-by-segment so each leg can carry its own
// mode-driven stroke style (walk dotted, subway solid, ferry dashed, car
// dash-dot).
const DayLine = ({day, stops, strokeWidth = 8}: DayLineProps) => {
    return (
        <g aria-label={`Day ${day.id} line`}>
            {day.segments.map((segment, index) => {
                const from = stops[day.route[index]]
                const to = stops[day.route[index + 1]]

                return (
                    <path
                        key={`${from.id}-${to.id}-${index}`}
                        d={segmentPath(from.coord, to.coord)}
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
