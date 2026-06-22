// NYC 2026 trip — composes the stops and days into a single Trip object.
// See plan.md for the design.

import {days} from "~/data/days"
import {stops} from "~/data/stops"
import type {Trip} from "~/data/types"

export const trip: Trip = {days, stops}
