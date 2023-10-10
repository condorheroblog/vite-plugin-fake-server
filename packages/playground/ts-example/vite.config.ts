import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vitePluginFaker } from "@condorhero/vite-plugin-fake-server";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), vitePluginFaker()],
});
