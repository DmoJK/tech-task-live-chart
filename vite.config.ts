import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import svgr from "vite-plugin-svgr"
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svgr({ include: "**/*.svg", svgrOptions: { exportType: "default" } }),
    react(),
  ],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "/src/app/styles/variables/global" as *;`,
      },
    },
  },
})
