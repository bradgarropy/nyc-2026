import type {Stop} from "~/data/types"

type StopNodeProps = {
    stop: Stop
    // The stop's line color (its day's color).
    color: string
    // Pops the dot (driven by a hovered day-card stop). Direct map hover/focus
    // pops it too, via the group-hover/-focus-within classes below.
    hovered?: boolean
}

// A station "bulb": a small white-filled circle with a colored ring in the
// day's line color. Every stop renders identically. On hover (from the map or
// the matching day-card stop) it pops to ~1.4x.
const StopNode = ({stop, color, hovered}: StopNodeProps) => {
    const {x, y} = stop.coord

    return (
        <circle
            cx={x}
            cy={y}
            r={5}
            fill="white"
            stroke={color}
            strokeWidth={2}
            data-hovered={hovered ? "true" : undefined}
            className={`origin-center transition-transform duration-150 group-hover:scale-[1.4] group-focus-within:scale-[1.4] ${
                hovered ? "scale-[1.4]" : ""
            }`}
            style={{transformBox: "fill-box"}}
        />
    )
}

export default StopNode
