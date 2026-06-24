import {afterEach, expect, test, vi} from "vitest"

import {createImageUrl} from "~/utils/images"

afterEach(() => {
    vi.unstubAllEnvs()
})

test("builds a thumbnail delivery URL from the account hash and id", () => {
    vi.stubEnv("VITE_CLOUDFLARE_IMAGES_HASH", "testhash")

    expect(createImageUrl("macys/1", "thumb")).toBe(
        "https://imagedelivery.net/testhash/macys/1/thumbnail",
    )
})

test("builds a full-size delivery URL", () => {
    vi.stubEnv("VITE_CLOUDFLARE_IMAGES_HASH", "testhash")

    expect(createImageUrl("johns-pizza/2", "full")).toBe(
        "https://imagedelivery.net/testhash/johns-pizza/2/full",
    )
})
