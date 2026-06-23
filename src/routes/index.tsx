import {useState} from "react"

import BaseMap from "~/components/BaseMap"
import DayFilter from "~/components/DayFilter"
import DayLine from "~/components/DayLine"
import StopLabel from "~/components/StopLabel"
import StopNode from "~/components/StopNode"
import TripMap from "~/components/TripMap"
import {trip} from "~/data/trip"

const Route = () => {
    const {days, stops} = trip
    const [selectedDay, setSelectedDay] = useState<number | null>(null)

    const dayColors = Object.fromEntries(
        days.map(day => [day.id, day.color]),
    ) as Record<number, string>

    const isDayDimmed = (id: number) =>
        selectedDay !== null && id !== selectedDay

    const isStopDimmed = (stopDays: number[]) =>
        selectedDay !== null && !stopDays.includes(selectedDay)

    return (
        <>
            <title>🗽 nyc 2026 | home</title>

            <div className="mx-auto flex max-w-lg flex-col gap-4">
                <DayFilter
                    days={days}
                    selectedDay={selectedDay}
                    onSelect={setSelectedDay}
                />

                <TripMap>
                    <BaseMap />

                    {days.map(day => (
                        <DayLine
                            key={day.id}
                            day={day}
                            stops={stops}
                            strokeWidth={5}
                            dimmed={isDayDimmed(day.id)}
                        />
                    ))}

                    {Object.values(stops).map(stop => {
                        const dimmed = isStopDimmed(stop.days)

                        return (
                            <g
                                key={stop.id}
                                // Dimmed stops (other days) are non-interactive:
                                // no `group` class so the label can't hover in,
                                // and removed from the tab order.
                                tabIndex={dimmed ? -1 : 0}
                                aria-label={stop.name}
                                className={`transition-opacity duration-200 ${
                                    dimmed
                                        ? ""
                                        : "group cursor-pointer focus:outline-none"
                                }`}
                                opacity={dimmed ? 0.15 : 1}
                            >
                                <StopNode
                                    stop={stop}
                                    color={dayColors[stop.days[0]]}
                                />
                                <StopLabel stop={stop} />
                            </g>
                        )
                    })}
                </TripMap>
            </div>
        </>
    )
}

export default Route
