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

import pLimit from "p-limit"

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID
const TOKEN = process.env.CLOUDFLARE_IMAGES_TOKEN
const SRC_DIR = "photos"
const STOPS_FILE = "src/data/stops.ts"
const API = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1`

// How many uploads to run at once. Cloudflare's API comfortably handles this,
// and it's the main speedup over uploading one image at a time.
const CONCURRENCY = 8

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

type ApiError = {code?: number; message?: string}
type ApiResponse = {success?: boolean; errors?: ApiError[]}

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

const postImage = (id: string, filePath: string): Promise<Response> => {
    const form = new FormData()
    const bytes = readFileSync(filePath)
    form.append("file", new Blob([new Uint8Array(bytes)]), basename(filePath))
    form.append("id", id)
    form.append("requireSignedURLs", "false")

    return fetch(API, {method: "POST", headers, body: form})
}

const isConflict = (res: Response, json: ApiResponse): boolean =>
    res.status === 409 ||
    (json.errors?.some(
        error => error.code === 5409 || /exist/i.test(error.message ?? ""),
    ) ??
        false)

// Upload first; only if the custom ID already exists do we delete and retry.
// This avoids a wasted DELETE round-trip on every (first-run) upload.
const uploadImage = async (id: string, filePath: string): Promise<void> => {
    let res = await postImage(id, filePath)
    let json = (await res.json()) as ApiResponse

    if (!json.success && isConflict(res, json)) {
        await deleteImage(id)
        res = await postImage(id, filePath)
        json = (await res.json()) as ApiResponse
    }

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

type UploadTask = {id: string; file: string; filePath: string}

const main = async (): Promise<void> => {
    const dirs = listImageDirs()

    // Build the full upload list up front. IDs are deterministic
    // ("<stop-id>/<n>" in alphabetical order), so we know each stop's `photos`
    // array regardless of the order uploads finish in.
    const tasks: UploadTask[] = []
    const stopPhotos = new Map<string, string[]>()

    for (const stopId of dirs) {
        if (!validStopIds.has(stopId)) {
            console.warn(`⚠ skipping "${stopId}" — not a known stop id`)
            continue
        }

        const files = listPhotos(stopId)
        if (files.length === 0) {
            continue
        }

        const ids = files.map((file, index) => {
            const id = `${stopId}/${index + 1}`
            tasks.push({id, file, filePath: join(SRC_DIR, stopId, file)})
            return id
        })
        stopPhotos.set(stopId, ids)
    }

    const limit = pLimit(CONCURRENCY)
    let done = 0
    await Promise.all(
        tasks.map(({id, file, filePath}) =>
            limit(async () => {
                await uploadImage(id, filePath)
                done += 1
                console.log(`✓ [${done}/${tasks.length}] ${id}  (${file})`)
            }),
        ),
    )

    let source = stopsSource
    for (const [stopId, ids] of stopPhotos) {
        source = writePhotos(source, stopId, ids)
    }

    if (source !== stopsSource) {
        writeFileSync(STOPS_FILE, source)
        execSync(`npx prettier --write ${STOPS_FILE}`, {stdio: "inherit"})
    }

    console.log(`\nDone — uploaded ${tasks.length} image(s).`)
}

main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
})
