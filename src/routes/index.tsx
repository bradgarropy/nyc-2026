import {useState} from "react"

import BaseMap from "~/components/BaseMap"
import DayFilter from "~/components/DayFilter"
import DayLine from "~/components/DayLine"
import DayList from "~/components/DayList"
import Legend from "~/components/Legend"
import StopLabel from "~/components/StopLabel"
import StopNode from "~/components/StopNode"
import StopPanel from "~/components/StopPanel"
import TripMap from "~/components/TripMap"
import {trip} from "~/data/trip"
import type {Stop} from "~/data/types"

const Route = () => {
    const {days, stops} = trip
    const [selectedDay, setSelectedDay] = useState<number | null>(null)
    const [selectedStop, setSelectedStop] = useState<Stop | null>(null)
    const [hoveredStopId, setHoveredStopId] = useState<string | null>(null)

    const dayColors = Object.fromEntries(
        days.map(day => [day.id, day.color]),
    ) as Record<number, string>

    const isDayDimmed = (id: number) =>
        selectedDay !== null && id !== selectedDay

    const isStopDimmed = (stopDays: number[]) =>
        selectedDay !== null && !stopDays.includes(selectedDay)

    return (
        <>
            <title>nyc 2026</title>

            <div className="mx-auto flex max-w-5xl flex-col gap-6 lg:grid lg:grid-cols-2 lg:grid-rows-[auto_auto] lg:gap-x-6 lg:gap-y-4">
                {/* filter: top-left, above the map only; bottom-aligned so it
                    sits flush with the legend across the row */}
                <div className="lg:col-start-1 lg:row-start-1 lg:flex lg:items-end">
                    <DayFilter
                        days={days}
                        selectedDay={selectedDay}
                        onSelect={setSelectedDay}
                    />
                </div>

                {/* legend: top-right, above the itinerary, aligned to its bottom */}
                <div className="lg:col-start-2 lg:row-start-1 lg:flex lg:items-end">
                    <Legend />
                </div>

                {/* map: left; its natural height drives the row */}
                <div className="lg:col-start-1 lg:row-start-2">
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
                                    // removed from the tab order, and not clickable.
                                    role={dimmed ? undefined : "button"}
                                    tabIndex={dimmed ? -1 : 0}
                                    aria-label={stop.name}
                                    onClick={
                                        dimmed
                                            ? undefined
                                            : () => setSelectedStop(stop)
                                    }
                                    onKeyDown={
                                        dimmed
                                            ? undefined
                                            : event => {
                                                  if (
                                                      event.key === "Enter" ||
                                                      event.key === " "
                                                  ) {
                                                      event.preventDefault()
                                                      setSelectedStop(stop)
                                                  }
                                              }
                                    }
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
                                        hovered={hoveredStopId === stop.id}
                                    />
                                    <StopLabel
                                        stop={stop}
                                        hovered={hoveredStopId === stop.id}
                                    />
                                </g>
                            )
                        })}
                    </TripMap>
                </div>

                {/* day cards: right, aligned with the map top. The inner
                    container is absolutely positioned so the (tall) list never
                    stretches the row — the row height stays equal to the map,
                    and the list scrolls within it. */}
                <div className="day-list-scope lg:relative lg:col-start-2 lg:row-start-2">
                    <div className="day-list-scroller lg:absolute lg:inset-0 lg:overflow-y-auto">
                        <DayList
                            days={days}
                            stops={stops}
                            selectedDay={selectedDay}
                            onSelectStop={setSelectedStop}
                            onHoverStop={setHoveredStopId}
                        />
                    </div>

                    {/* fades in over the first 4rem once the list is scrolled */}
                    <div
                        aria-hidden="true"
                        className="day-list-fade-top pointer-events-none absolute inset-x-0 top-0 hidden h-16 lg:block"
                        style={{
                            background:
                                "linear-gradient(to bottom, white, rgba(255,255,255,0))",
                        }}
                    />

                    {/* fades out over the last 4rem as you reach the bottom */}
                    <div
                        aria-hidden="true"
                        className="day-list-fade-bottom pointer-events-none absolute inset-x-0 bottom-0 hidden h-16 lg:block"
                        style={{
                            background:
                                "linear-gradient(to top, white, rgba(255,255,255,0))",
                        }}
                    />
                </div>
            </div>

            <StopPanel
                stop={selectedStop}
                dayColors={dayColors}
                onClose={() => setSelectedStop(null)}
            />
        </>
    )
}

export default Route
