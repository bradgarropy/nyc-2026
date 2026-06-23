import type {TransitMode} from "~/data/types"
import {MODE_DASH} from "~/utils/trip"

// The four transit modes, in the order they read best, paired with the label
// shown next to each line sample.
const MODES: {mode: TransitMode; label: string}[] = [
    {mode: "subway", label: "Subway"},
    {mode: "walk", label: "Walk"},
    {mode: "ferry", label: "Ferry"},
    {mode: "car", label: "Car"},
]

// A small key documenting the line style used for each transit mode. The line
// samples reuse `MODE_DASH` (and round caps) so they match the map exactly:
// subway solid, walk dotted, ferry dashed, car dash-dot.
const Legend = () => {
    return (
        <section aria-label="Transit modes" className="font-helvetica">
            <h2 className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                Transit
            </h2>

            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
                {MODES.map(({mode, label}) => (
                    <li key={mode} className="flex items-center gap-2">
                        <svg
                            width="44"
                            height="8"
                            viewBox="0 0 44 8"
                            aria-hidden="true"
                        >
                            <line
                                x1="2"
                                y1="4"
                                x2="42"
                                y2="4"
                                stroke="#1a1a1a"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeDasharray={MODE_DASH[mode]}
                            />
                        </svg>

                        <span className="text-sm font-medium text-gray-700">
                            {label}
                        </span>
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default Legend
