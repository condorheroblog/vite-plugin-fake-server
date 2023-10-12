import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { vitePluginFakeServer } from "vite-plugin-fake-server";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), vitePluginFakeServer({ enableProd: true, build: true })],
});
