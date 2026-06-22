import {cloudflare} from "@cloudflare/vite-plugin"
import {reactRouter} from "@react-router/dev/vite"
import tailwind from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import devtoolsJson from "vite-plugin-devtools-json"
import {defineConfig} from "vitest/config"

const config = defineConfig({
    build: {
        sourcemap: true,
    },
    plugins: [
        tailwind(),
        devtoolsJson(),
        ...(process.env.VITEST
            ? [react()]
            : [cloudflare({viteEnvironment: {name: "ssr"}}), reactRouter()]),
    ],
    resolve: {
        tsconfigPaths: true,
    },
    server: {
        open: true,
        port: 3000,
    },
    test: {
        clearMocks: true,
        coverage: {
            clean: true,
            enabled: true,
            provider: "v8",
            reporter: ["text", "lcov", "html"],
            reportOnFailure: false,
        },
        environment: "jsdom",
        include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
        globals: false,
        passWithNoTests: true,
        setupFiles: "src/tests/setup.ts",
        watch: false,
    },
})

export default config
