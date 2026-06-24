/// <reference types="vite/client" />
/// <reference types="./worker-configuration.d.ts" />

interface ImportMetaEnv {
    // Cloudflare Images account hash (public — it appears in every delivery
    // URL). Sourced from the environment so it isn't committed to source.
    readonly VITE_CLOUDFLARE_IMAGES_HASH: string
}
