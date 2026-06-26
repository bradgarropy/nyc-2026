import type {ReactNode} from "react"

// The schematic is authored on a portrait 658 x 1269 grid (north up), matching
// the traced NYC base map. The SVG scales to fit its container while preserving
// that aspect ratio.
export const MAP_WIDTH = 658
export const MAP_HEIGHT = 1269
const MAP_VIEWBOX = {
    x: 0,
    y: 275,
    width: 610,
    height: 800,
}

type TripMapProps = {
    children?: ReactNode
}

const TripMap = ({children}: TripMapProps) => {
    return (
        <svg
            viewBox={`${MAP_VIEWBOX.x} ${MAP_VIEWBOX.y} ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="NYC 2026 trip map"
            className="font-helvetica mx-auto block h-auto w-full overflow-hidden rounded-lg shadow-sm"
        >
            {children}
        </svg>
    )
}

export default TripMap
