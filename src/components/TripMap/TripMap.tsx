import type {ReactNode} from "react"

// The schematic is authored on a portrait 658 x 1269 grid (north up), matching
// the traced NYC base map. The SVG scales to fit its container while preserving
// that aspect ratio.
export const MAP_WIDTH = 658
export const MAP_HEIGHT = 1269

type TripMapProps = {
    children?: ReactNode
}

const TripMap = ({children}: TripMapProps) => {
    return (
        <svg
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="NYC 2026 trip map"
            className="font-helvetica mx-auto block h-auto w-full"
        >
            {children}
        </svg>
    )
}

export default TripMap
