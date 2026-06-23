import type {Stop} from "~/data/types"

type StopNodeProps = {
    stop: Stop
    // The stop's line color (its day's color).
    color: string
}

// A station "bulb": a small white-filled circle with a colored ring in the
// day's line color. Every stop renders identically.
const StopNode = ({stop, color}: StopNodeProps) => {
    const {x, y} = stop.coord

    return (
        <circle
            cx={x}
            cy={y}
            r={5}
            fill="white"
            stroke={color}
            strokeWidth={2}
        />
    )
}

export default StopNode
