import {MAP_WIDTH} from "~/components/TripMap/TripMap"
import type {LabelSide, Stop} from "~/data/types"

// Distance from the dot center to the start of the label text.
const OFFSET = 13

// Auto-pick a side from the stop's x so labels lean toward the interior (and
// off the map edges); `stop.labelSide` overrides for crowded spots.
const sideFor = (stop: Stop): LabelSide =>
    stop.labelSide ?? (stop.coord.x > MAP_WIDTH / 2 ? "left" : "right")

type StopLabelProps = {
    stop: Stop
    // Forces the label visible (driven by a hovered day-card stop). Direct map
    // hover/focus still reveals it via the group-hover/-focus-within classes.
    hovered?: boolean
}

// The stop's name, hidden until the surrounding stop group is hovered/focused
// (or `hovered` is set from the day card). A white halo (paint-order stroke)
// keeps it legible over lines and coastlines.
const StopLabel = ({stop, hovered}: StopLabelProps) => {
    const side = sideFor(stop)
    const isLeft = side === "left"
    const {x, y} = stop.coord

    return (
        <text
            aria-hidden="true"
            x={isLeft ? x - OFFSET : x + OFFSET}
            y={y}
            textAnchor={isLeft ? "end" : "start"}
            dominantBaseline="middle"
            className={`font-helvetica pointer-events-none fill-[#1a1a1a] text-[16px] font-semibold transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none ${
                hovered ? "opacity-100" : "opacity-0"
            }`}
            style={{
                paintOrder: "stroke",
                stroke: "white",
                strokeWidth: 5,
                strokeLinejoin: "round",
            }}
        >
            {stop.name}
        </text>
    )
}

export default StopLabel
