import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import svgr from "vite-plugin-svgr"
import fs from "fs"

import pkg from "./package.json"
import { createHtmlPlugin } from "vite-plugin-html"
import {
  GROOM_FULLNAME,
  BRIDE_FULLNAME,
  WEDDING_DATE,
  LOCATION,
  WEDDING_DATE_FORMAT,
} from "./src/const"

const distFolder = "build"

let base = "/"

try {
  const url = new URL(pkg.homepage)
  base = url.pathname
} catch (e) {
  base = pkg.homepage || "/"
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const previewImageVersion = env.VITE_PREVIEW_IMAGE_VERSION || pkg.version

  return {
    plugins: [
      react(),
      svgr(),
      createHtmlPlugin({
        inject: {
          data: {
            GROOM_FULLNAME,
            BRIDE_FULLNAME,
            DESCRIPTION: `${WEDDING_DATE.format(WEDDING_DATE_FORMAT)} ${LOCATION}`,
            PREVIEW_IMAGE_URL: `/preview_image.jpg?v=${previewImageVersion}`,
          },
        },
      }),
      {
        name: "manifest-inject",
        writeBundle() {
          const content = fs.readFileSync("public/manifest.json", "utf-8")
          const processed = content
            .replace(/<%= GROOM_FULLNAME %>/g, GROOM_FULLNAME)
            .replace(/<%= BRIDE_FULLNAME %>/g, BRIDE_FULLNAME)
          fs.writeFileSync(`${distFolder}/manifest.json`, processed)
        },
      },
    ],
    server: { port: 3000 },
    build: { outDir: distFolder },
    base,
  }
})
