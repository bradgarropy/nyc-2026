// NYC 2026 trip stops — see plan.md for the design.
//
// Coordinates are a first pass on the 658 x 1269 base-map grid (north up, west =
// low x, downtown = high y), placed on the green Manhattan body (never Staten Island).
// They are meant to be nudged once we see the map render. Notes use lorem ipsum
// placeholders to be replaced later.

import type {Stop} from "~/data/types"

const LOREM =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."

export const stops: Record<string, Stop> = {
    // --- hotel + arrival/departure anchors ---
    "hotel": {
        id: "hotel",
        name: "Hotel",
        coord: {x: 150, y: 538},
        days: [1, 2, 3, 4, 5],
        notes: "Home base on 34th/36th St. " + LOREM,
    },
    "lincoln-tunnel": {
        id: "lincoln-tunnel",
        name: "Lincoln Tunnel",
        coord: {x: 14, y: 540},
        days: [1],
        notes: "Drove in from New Jersey through the Lincoln Tunnel. " + LOREM,
    },
    "lga": {
        id: "lga",
        name: "LaGuardia (LGA)",
        coord: {x: 560, y: 360},
        days: [5],
        notes: "Uber to LGA, then home to Houston and Austin. " + LOREM,
    },

    // --- Day 1: Midtown & Times Square ---
    "macys": {
        id: "macys",
        name: "Macy's",
        coord: {x: 158, y: 548},
        days: [1],
        notes: "Herald Square flagship. " + LOREM,
    },
    "times-square": {
        id: "times-square",
        name: "Times Square",
        coord: {x: 168, y: 518},
        days: [1],
        notes: LOREM,
    },
    "disney-store": {
        id: "disney-store",
        name: "Disney Store",
        coord: {x: 178, y: 512},
        days: [1],
        notes: LOREM,
    },
    "mms-store": {
        id: "mms-store",
        name: "M&M's Store",
        coord: {x: 172, y: 506},
        days: [1],
        notes: LOREM,
    },
    "rockefeller-center": {
        id: "rockefeller-center",
        name: "Rockefeller Center",
        coord: {x: 230, y: 508},
        days: [1],
        notes: LOREM,
    },
    "nintendo-store": {
        id: "nintendo-store",
        name: "Nintendo Store",
        coord: {x: 212, y: 513},
        days: [1, 2],
        notes: LOREM,
    },
    "st-patricks": {
        id: "st-patricks",
        name: "St. Patrick's Cathedral",
        coord: {x: 252, y: 505},
        days: [1],
        notes: "Admired it from the outside. " + LOREM,
    },
    "lego-store": {
        id: "lego-store",
        name: "LEGO Store",
        coord: {x: 244, y: 512},
        days: [1],
        notes: LOREM,
    },
    "johns-pizza": {
        id: "johns-pizza",
        name: "John's of Times Square",
        coord: {x: 160, y: 512},
        days: [1],
        notes: "Pizza in a converted church off Times Square. " + LOREM,
    },

    // --- Day 2: Downtown + Brooklyn ---
    "wtc": {
        id: "wtc",
        name: "World Trade Center",
        coord: {x: 165, y: 815},
        days: [2],
        notes: "Cloudflare's office is here. " + LOREM,
        subwayLines: ["E"],
    },
    "oculus": {
        id: "oculus",
        name: "Oculus",
        coord: {x: 186, y: 830},
        days: [2, 4],
        notes: LOREM,
    },
    "ground-zero": {
        id: "ground-zero",
        name: "Ground Zero",
        coord: {x: 158, y: 833},
        days: [2],
        notes: LOREM,
    },
    "brooklyn-bridge": {
        id: "brooklyn-bridge",
        name: "Brooklyn Bridge",
        coord: {x: 395, y: 825},
        days: [2],
        notes: LOREM,
    },
    "pebble-beach": {
        id: "pebble-beach",
        name: "Pebble Beach",
        coord: {x: 460, y: 738},
        days: [2],
        notes: LOREM,
    },
    "westville-dumbo": {
        id: "westville-dumbo",
        name: "Westville DUMBO",
        coord: {x: 482, y: 775},
        days: [2],
        notes: LOREM,
    },
    "statue-liberty": {
        id: "statue-liberty",
        name: "Statue of Liberty",
        coord: {x: 190, y: 955},
        days: [2],
        notes: LOREM,
    },
    "uss-intrepid": {
        id: "uss-intrepid",
        name: "USS Intrepid",
        coord: {x: 38, y: 515},
        days: [2],
        notes: "Sea, Air & Space Museum on the Hudson. " + LOREM,
    },
    "grand-central": {
        id: "grand-central",
        name: "Grand Central Terminal",
        coord: {x: 300, y: 520},
        days: [2],
        notes: LOREM,
    },
    "hot-dog-cart": {
        id: "hot-dog-cart",
        name: "Grand Central Hot Dog Cart",
        coord: {x: 312, y: 526},
        days: [2],
        notes: LOREM,
    },

    // --- Day 3: Central Park & Midtown & SoHo ---
    "liberty-bagels": {
        id: "liberty-bagels",
        name: "Liberty Bagels",
        coord: {x: 135, y: 532},
        days: [3],
        notes: "Breakfast bagels near the hotel. " + LOREM,
    },
    "central-park-zoo": {
        id: "central-park-zoo",
        name: "Central Park Zoo",
        coord: {x: 245, y: 470},
        days: [3],
        notes: LOREM,
        subwayLines: ["N"],
    },
    "central-park": {
        id: "central-park",
        name: "Central Park",
        coord: {x: 185, y: 425},
        days: [3],
        notes: LOREM,
    },
    "el-mitote": {
        id: "el-mitote",
        name: "El Mitote",
        coord: {x: 100, y: 425},
        days: [3],
        notes: LOREM,
    },
    "apple-fifth": {
        id: "apple-fifth",
        name: "Apple Fifth Avenue",
        coord: {x: 262, y: 485},
        days: [3],
        notes: LOREM,
        subwayLines: ["1"],
    },
    "368-broadway": {
        id: "368-broadway",
        name: "368 Broadway",
        coord: {x: 190, y: 702},
        days: [3],
        notes: "In SoHo. " + LOREM,
        subwayLines: ["E"],
    },
    "washington-square": {
        id: "washington-square",
        name: "Washington Square Park",
        coord: {x: 150, y: 662},
        days: [3],
        notes: LOREM,
        subwayLines: ["N"],
    },
    "the-cage": {
        id: "the-cage",
        name: "The Cage",
        coord: {x: 132, y: 666},
        days: [3],
        notes: "The West 4th Street Courts. " + LOREM,
    },
    "burgerology": {
        id: "burgerology",
        name: "Burgerology",
        coord: {x: 160, y: 538},
        days: [3],
        notes: "Burgers right next to the hotel on 36th. " + LOREM,
        subwayLines: ["E"],
    },

    // --- Day 4: West Side & Chinatown ---
    "bh-photo": {
        id: "bh-photo",
        name: "B&H Photo",
        coord: {x: 110, y: 535},
        days: [4],
        notes: LOREM,
    },
    "vessel": {
        id: "vessel",
        name: "Vessel",
        coord: {x: 74, y: 553},
        days: [4],
        notes: LOREM,
    },
    "hudson-yards": {
        id: "hudson-yards",
        name: "Hudson Yards",
        coord: {x: 60, y: 545},
        days: [4],
        notes: LOREM,
    },
    "high-line": {
        id: "high-line",
        name: "High Line",
        coord: {x: 70, y: 618},
        days: [4],
        notes: LOREM,
    },
    "chelsea-market": {
        id: "chelsea-market",
        name: "Chelsea Market",
        coord: {x: 108, y: 595},
        days: [4],
        notes: LOREM,
    },
    "little-island": {
        id: "little-island",
        name: "Little Island",
        coord: {x: 58, y: 632},
        days: [4],
        notes: LOREM,
    },
    "chinatown": {
        id: "chinatown",
        name: "Chinatown",
        coord: {x: 255, y: 722},
        days: [4],
        notes: LOREM,
        subwayLines: ["A", "B"],
    },
    "nyse": {
        id: "nyse",
        name: "New York Stock Exchange",
        coord: {x: 232, y: 867},
        days: [4],
        notes: LOREM,
        subwayLines: ["J"],
    },
    "wall-street": {
        id: "wall-street",
        name: "Wall Street Bull",
        coord: {x: 240, y: 858},
        days: [4],
        notes: "The Charging Bull statue. " + LOREM,
    },
    "pizza-suprema": {
        id: "pizza-suprema",
        name: "NY Pizza Suprema",
        coord: {x: 118, y: 548},
        days: [4],
        notes: "Near Penn Station / MSG. " + LOREM,
        subwayLines: ["E"],
    },
    "madison-square-garden": {
        id: "madison-square-garden",
        name: "Madison Square Garden",
        coord: {x: 128, y: 555},
        days: [4],
        notes: LOREM,
    },
    "penn-station": {
        id: "penn-station",
        name: "Penn Station",
        coord: {x: 138, y: 558},
        days: [4],
        notes: LOREM,
    },
}
