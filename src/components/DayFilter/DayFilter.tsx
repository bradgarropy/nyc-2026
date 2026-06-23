import type {Day} from "~/data/types"
import {textColorOn} from "~/utils/trip"

type DayFilterProps = {
    days: Day[]
    // null = show all days
    selectedDay: number | null
    onSelect: (day: number | null) => void
}

const BASE_CLASS =
    "cursor-pointer rounded-full border-2 px-3 py-1 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"

// All Days / Day 1-4 toggle. The selected day's button fills with its line
// color; the rest are outlines.
const DayFilter = ({days, selectedDay, onSelect}: DayFilterProps) => {
    const allActive = selectedDay === null

    return (
        <div
            role="group"
            aria-label="Filter by day"
            className="font-helvetica flex flex-wrap gap-2"
        >
            <button
                type="button"
                aria-pressed={allActive}
                onClick={() => onSelect(null)}
                className={`${BASE_CLASS} ${
                    allActive
                        ? "border-black bg-black text-white"
                        : "border-gray-300 text-gray-700 hover:border-gray-500"
                }`}
            >
                All Days
            </button>

            {days.map(day => {
                const active = selectedDay === day.id

                return (
                    <button
                        key={day.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => onSelect(day.id)}
                        className={BASE_CLASS}
                        style={{
                            borderColor: day.color,
                            backgroundColor: active ? day.color : "transparent",
                            color: active ? textColorOn(day.color) : "#1a1a1a",
                        }}
                    >
                        Day {day.id}
                    </button>
                )
            })}
        </div>
    )
}

export default DayFilter
