// Cloudflare Images helpers — see plan.md / readme for the design.
//
// Photos live in Cloudflare Images; a stop's `photos` array holds custom image
// IDs (e.g. "macys/1"). Two named variants are configured in the dashboard:
//   - thumbnail (400x400, cover)  — the panel grid
//   - full      (2000x2000, scale-down) — the open-in-new-tab view
// The account hash is public; it comes from VITE_CLOUDFLARE_IMAGES_HASH at build time.

type ImageSize = "thumb" | "full"

const VARIANT: Record<ImageSize, string> = {
    thumb: "thumbnail",
    full: "full",
}

// Builds the Cloudflare Images delivery URL for a stop photo id and size.
export const createImageUrl = (id: string, size: ImageSize): string => {
    const hash = import.meta.env.VITE_CLOUDFLARE_IMAGES_HASH
    return `https://imagedelivery.net/${hash}/${id}/${VARIANT[size]}`
}
