import DayLine from "~/components/DayLine"
import TripMap from "~/components/TripMap"
import {trip} from "~/data/trip"

const Route = () => {
    const {days, stops} = trip

    return (
        <>
            <title>🗽 nyc 2026 | home</title>

            <TripMap>
                {days.map(day => (
                    <DayLine key={day.id} day={day} stops={stops} />
                ))}
            </TripMap>
        </>
    )
}

export default Route
