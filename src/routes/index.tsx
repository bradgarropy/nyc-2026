import BaseMap from "~/components/BaseMap"
import DayLine from "~/components/DayLine"
import StopNode from "~/components/StopNode"
import TripMap from "~/components/TripMap"
import {trip} from "~/data/trip"

const Route = () => {
    const {days, stops} = trip

    const dayColors = Object.fromEntries(
        days.map(day => [day.id, day.color]),
    ) as Record<number, string>

    return (
        <>
            <title>🗽 nyc 2026 | home</title>

            <TripMap>
                <BaseMap />

                {days.map(day => (
                    <DayLine
                        key={day.id}
                        day={day}
                        stops={stops}
                        strokeWidth={5}
                    />
                ))}

                {Object.values(stops).map(stop => (
                    <StopNode
                        key={stop.id}
                        stop={stop}
                        color={dayColors[stop.days[0]]}
                    />
                ))}
            </TripMap>
        </>
    )
}

export default Route
