import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { execSync } from "node:child_process"

const resolveCommitHash = () => {
  try {
    return execSync("git rev-parse --short HEAD", { stdio: "pipe" })
      .toString()
      .trim()
  } catch (error) {
    console.warn("Failed to resolve git commit hash", error)
    return "unknown"
  }
}

const commitHash = resolveCommitHash()
const buildTimestamp = new Date().toISOString()

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  define: {
    __APP_COMMIT_HASH__: JSON.stringify(commitHash),
    __APP_BUILD_TIME__: JSON.stringify(buildTimestamp),
  },
})
