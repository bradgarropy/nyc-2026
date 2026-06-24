// Upload trip photos to Cloudflare Images and wire the IDs into the stop data.
//
// Usage:
//   1. Put CLOUDFLARE_ACCOUNT_ID + CLOUDFLARE_IMAGES_TOKEN (Images: Edit) in .env
//   2. Drop JPGs into photos/<stop-id>/  (filenames don't matter; order is
//      alphabetical)
//   3. npm run photos
//
// For each photos/<stop-id>/ folder it uploads every image with a custom ID
// "<stop-id>/<n>" (1-based, in alphabetical order), then writes that stop's
// `photos` array in src/data/stops.ts. Re-running re-uploads: an existing custom
// ID is deleted first, so the command is idempotent.

import {execSync} from "node:child_process"
import {readdirSync, readFileSync, statSync, writeFileSync} from "node:fs"
import {basename, extname, join} from "node:path"
import process from "node:process"

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID
const TOKEN = process.env.CLOUDFLARE_IMAGES_TOKEN
const SRC_DIR = "photos"
const STOPS_FILE = "src/data/stops.ts"
const API = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1`

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"])

if (!ACCOUNT_ID || !TOKEN) {
    console.error(
        "Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_IMAGES_TOKEN. Add them to .env.",
    )
    process.exit(1)
}

const headers = {Authorization: `Bearer ${TOKEN}`}

// The set of valid stop ids, parsed from stops.ts, so typo'd folders are caught.
const stopsSource = readFileSync(STOPS_FILE, "utf8")
const validStopIds = new Set(
    [...stopsSource.matchAll(/^ {4}"([a-z0-9-]+)": \{$/gm)].map(
        match => match[1],
    ),
)

const listImageDirs = (): string[] => {
    let entries: string[]
    try {
        entries = readdirSync(SRC_DIR)
    } catch {
        console.error(`No ${SRC_DIR}/ directory found. Nothing to upload.`)
        process.exit(1)
    }

    return entries.filter(name => {
        try {
            return statSync(join(SRC_DIR, name)).isDirectory()
        } catch {
            return false
        }
    })
}

const listPhotos = (stopId: string): string[] =>
    readdirSync(join(SRC_DIR, stopId))
        .filter(file => IMAGE_EXTENSIONS.has(extname(file).toLowerCase()))
        .sort()

const deleteImage = async (id: string): Promise<void> => {
    const res = await fetch(`${API}/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers,
    })

    // 404 (never uploaded) is fine; anything else non-ok is a real error.
    if (!res.ok && res.status !== 404) {
        const body = await res.text()
        throw new Error(`delete ${id} failed (${res.status}): ${body}`)
    }
}

const uploadImage = async (id: string, filePath: string): Promise<void> => {
    const form = new FormData()
    const bytes = readFileSync(filePath)
    form.append("file", new Blob([new Uint8Array(bytes)]), basename(filePath))
    form.append("id", id)
    form.append("requireSignedURLs", "false")

    const res = await fetch(API, {method: "POST", headers, body: form})
    const json = (await res.json()) as {success?: boolean; errors?: unknown}

    if (!res.ok || !json.success) {
        throw new Error(
            `upload ${id} failed (${res.status}): ${JSON.stringify(json.errors)}`,
        )
    }
}

// Replace (or insert) the `photos` array inside a stop's object literal.
const writePhotos = (source: string, stopId: string, ids: string[]): string => {
    const lines = source.split("\n")
    const start = lines.findIndex(line => line === `    "${stopId}": {`)
    if (start === -1) {
        throw new Error(`could not find stop "${stopId}" in ${STOPS_FILE}`)
    }

    const end = lines.findIndex(
        (line, index) => index > start && line === "    },",
    )

    const photosLine = `        photos: [${ids.map(id => `"${id}"`).join(", ")}],`
    const existing = lines.findIndex(
        (line, index) =>
            index > start && index < end && line.startsWith("        photos:"),
    )

    if (existing !== -1) {
        lines[existing] = photosLine
    } else {
        lines.splice(end, 0, photosLine)
    }

    return lines.join("\n")
}

const main = async (): Promise<void> => {
    const dirs = listImageDirs()
    let source = stopsSource
    let uploaded = 0

    for (const stopId of dirs) {
        if (!validStopIds.has(stopId)) {
            console.warn(`⚠ skipping "${stopId}" — not a known stop id`)
            continue
        }

        const files = listPhotos(stopId)
        if (files.length === 0) {
            continue
        }

        const ids: string[] = []
        for (const [index, file] of files.entries()) {
            const id = `${stopId}/${index + 1}`
            await deleteImage(id)
            await uploadImage(id, join(SRC_DIR, stopId, file))
            ids.push(id)
            uploaded += 1
            console.log(`✓ ${id}  (${file})`)
        }

        source = writePhotos(source, stopId, ids)
    }

    if (source !== stopsSource) {
        writeFileSync(STOPS_FILE, source)
        execSync(`npx prettier --write ${STOPS_FILE}`, {stdio: "inherit"})
    }

    console.log(`\nDone — uploaded ${uploaded} image(s).`)
}

main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
})
