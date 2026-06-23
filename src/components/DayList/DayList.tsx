import DayItinerary from "~/components/DayItinerary"
import type {Day, Stop} from "~/data/types"

type DayListProps = {
    days: Day[]
    stops: Record<string, Stop>
    // null = show every day; otherwise just that day.
    selectedDay: number | null
    onSelectStop?: (stop: Stop) => void
}

// The itinerary list beside the map. Shows all days when nothing is filtered,
// or just the selected day — mirroring the map's day filter.
const DayList = ({days, stops, selectedDay, onSelectStop}: DayListProps) => {
    const shown =
        selectedDay === null ? days : days.filter(day => day.id === selectedDay)

    return (
        <div className="flex flex-col gap-4">
            {shown.map(day => (
                <DayItinerary
                    key={day.id}
                    day={day}
                    stops={stops}
                    onSelectStop={onSelectStop}
                />
            ))}
        </div>
    )
}

export default DayList
