// NYC 2026 trip days — see plan.md for the design.
//
// Each day is a colored "line" routed through its stops in order. `segments[i]`
// is the transit mode between `route[i]` and `route[i + 1]`, and the mode drives
// the line style (see src/utils/trip.ts `MODE_DASH`). Day 1 opens with the
// drive in through the Lincoln Tunnel; Day 5 is the departure to LGA.

import type {Day} from "~/data/types"

export const days: Day[] = [
    {
        id: 1,
        date: "Tue, Jun 16",
        theme: "Midtown & Times Square",
        color: "var(--color-mta-blue)",
        route: [
            "lincoln-tunnel",
            "macys",
            "times-square",
            "disney-store",
            "mms-store",
            "rockefeller-center",
            "nintendo-store",
            "st-patricks",
            "lego-store",
            "johns-pizza",
            "hotel",
        ],
        segments: [
            // Lincoln Tunnel -> Macy's
            {mode: "car"},
            // Macy's -> Times Square
            {mode: "walk"},
            // Times Square -> Disney Store
            {mode: "walk"},
            // Disney Store -> M&M's Store
            {mode: "walk"},
            // M&M's Store -> Rockefeller Center
            {mode: "walk"},
            // Rockefeller Center -> Nintendo Store
            {mode: "walk"},
            // Nintendo Store -> St. Patrick's Cathedral
            {mode: "walk"},
            // St. Patrick's Cathedral -> LEGO Store
            {mode: "walk"},
            // LEGO Store -> John's of Times Square
            {mode: "walk"},
            // John's of Times Square -> Hotel
            {mode: "walk"},
        ],
    },
    {
        id: 2,
        date: "Wed, Jun 17",
        theme: "Downtown & Brooklyn",
        color: "var(--color-mta-yellow)",
        route: [
            "hotel",
            "wtc",
            "ground-zero",
            "oculus",
            "brooklyn-bridge",
            "westville-dumbo",
            "pebble-beach",
            "statue-liberty",
            "uss-intrepid",
            "nintendo-store",
            "grand-central",
            "hot-dog-cart",
            "hotel",
        ],
        segments: [
            // Hotel -> World Trade Center
            {mode: "subway"},
            // World Trade Center -> Ground Zero
            {mode: "walk"},
            // Ground Zero -> Oculus
            {mode: "walk"},
            // Oculus -> Brooklyn Bridge
            {mode: "walk"},
            // Brooklyn Bridge -> Westville DUMBO
            {mode: "walk"},
            // Westville DUMBO -> Pebble Beach
            {mode: "walk"},
            // Pebble Beach -> Statue of Liberty
            {
                mode: "ferry",
                via: [
                    {x: 414, y: 786},
                    {x: 414, y: 816},
                    {x: 272, y: 960},
                ],
            },
            // Statue of Liberty -> USS Intrepid
            {
                mode: "ferry",
                via: [{x: 28, y: 870}],
            },
            // USS Intrepid -> Nintendo Store
            {mode: "walk"},
            // Nintendo Store -> Grand Central Terminal
            {mode: "walk"},
            // Grand Central Terminal -> Grand Central Hot Dog Cart
            {mode: "walk"},
            // Grand Central Hot Dog Cart -> Hotel
            {mode: "walk"},
        ],
    },
    {
        id: 3,
        date: "Thu, Jun 18",
        theme: "Central Park & Midtown & SoHo",
        color: "var(--color-mta-orange)",
        route: [
            "hotel",
            "liberty-bagels",
            "central-park-zoo",
            "central-park",
            "el-mitote",
            "apple-fifth",
            "washington-square",
            "the-cage",
            "368-broadway",
            "burgerology",
            "hotel",
        ],
        segments: [
            // Hotel -> Liberty Bagels
            {mode: "walk"},
            // Liberty Bagels -> Central Park Zoo
            {
                mode: "subway",
                via: [
                    {x: 262, y: 544},
                    {x: 262, y: 485},
                ],
            },
            // Central Park Zoo -> Central Park
            {mode: "walk"},
            // Central Park -> El Mitote
            {mode: "walk"},
            // El Mitote -> Apple Fifth Avenue
            {
                mode: "subway",
                via: [
                    {x: 122, y: 448},
                    {x: 122, y: 485},
                ],
            },
            // Apple Fifth Avenue -> Washington Square Park
            {mode: "subway"},
            // Washington Square Park -> The Cage
            {mode: "walk"},
            // The Cage -> 368 Broadway
            {mode: "subway", via: [{x: 262, y: 706}]},
            // 368 Broadway -> Burgerology
            {
                mode: "subway",
                via: [
                    {x: 262, y: 790},
                    {x: 262, y: 686},
                    {x: 262, y: 544},
                ],
            },
            // Burgerology -> Hotel
            {mode: "walk"},
        ],
    },
    {
        id: 4,
        date: "Fri, Jun 19",
        theme: "West Side & Chinatown",
        color: "var(--color-mta-red)",
        route: [
            "hotel",
            "bh-photo",
            "vessel",
            "hudson-yards",
            "high-line",
            "chelsea-market",
            "little-island",
            "chinatown",
            "nyse",
            "wall-street",
            "oculus",
            "pizza-suprema",
            "madison-square-garden",
            "penn-station",
            "hotel",
        ],
        segments: [
            // Hotel -> B&H Photo
            {mode: "walk"},
            // B&H Photo -> Vessel
            {mode: "walk"},
            // Vessel -> Hudson Yards
            {mode: "walk"},
            // Hudson Yards -> High Line
            {mode: "walk"},
            // High Line -> Chelsea Market
            {mode: "walk"},
            // Chelsea Market -> Little Island
            {mode: "walk"},
            // Little Island -> Chinatown
            {
                mode: "subway",
                via: [
                    {x: 126, y: 674},
                    {x: 126, y: 764},
                ],
            },
            // Chinatown -> New York Stock Exchange
            {mode: "subway"},
            // New York Stock Exchange -> Wall Street Bull
            {mode: "walk"},
            // Wall Street Bull -> Oculus
            {mode: "walk"},
            // Oculus -> NY Pizza Suprema
            {
                mode: "subway",
                via: [
                    {x: 126, y: 764},
                    {x: 126, y: 674},
                ],
            },
            // NY Pizza Suprema -> Madison Square Garden
            {mode: "walk"},
            // Madison Square Garden -> Penn Station
            {mode: "walk"},
            // Penn Station -> Hotel
            {mode: "walk"},
        ],
    },
    {
        id: 5,
        date: "Sat, Jun 20",
        theme: "Departure",
        color: "var(--color-mta-brown)",
        travel: true,
        route: ["hotel", "lga"],
        segments: [
            // Hotel -> Airport
            {mode: "car"},
        ],
    },
]
