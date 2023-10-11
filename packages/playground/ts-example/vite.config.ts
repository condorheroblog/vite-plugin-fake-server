import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { vitePluginFaker } from "vite-plugin-fake-server";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), vitePluginFaker({ enableProd: true, exclude: ["./mock/index.ts"] })],
});
