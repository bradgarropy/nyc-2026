import type {ReactNode} from "react"

// The schematic is authored on a portrait 1000 x 1500 grid (north up). The SVG
// scales to fit its container while preserving that aspect ratio.
export const MAP_WIDTH = 1000
export const MAP_HEIGHT = 1500

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
            <rect
                x={0}
                y={0}
                width={MAP_WIDTH}
                height={MAP_HEIGHT}
                fill="var(--color-mta-paper)"
            />

            {children}
        </svg>
    )
}

export default TripMap
