import type {Stop} from "~/data/types"

// Near-black used for transfer-station (hub) rings, MTA style.
const INK = "#1a1a1a"

type StopNodeProps = {
    stop: Stop
    // The stop's line color (its day's color); hubs override with a dark ring.
    color: string
}

const radiusFor = (stop: Stop): number => {
    if (stop.isHub) {
        return 7
    }

    return stop.category === "major" ? 5.5 : 4.5
}

// A station "bulb": white fill with a colored ring. Hubs are larger with a dark
// transfer-station ring; other stops take their day's line color.
const StopNode = ({stop, color}: StopNodeProps) => {
    const {x, y} = stop.coord
    const radius = radiusFor(stop)

    return (
        <circle
            aria-label={stop.name}
            cx={x}
            cy={y}
            r={radius}
            fill="white"
            stroke={stop.isHub ? INK : color}
            strokeWidth={stop.isHub ? 2.5 : 2}
        />
    )
}

export default StopNode
