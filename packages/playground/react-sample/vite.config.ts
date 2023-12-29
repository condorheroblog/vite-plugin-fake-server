import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { vitePluginFakeServer } from "vite-plugin-fake-server";

// https://vitejs.dev/config/
export default defineConfig({
	base: "/vite-plugin-fake-server/",
	plugins: [
		react(),
		vitePluginFakeServer({
			basename: "api",
			timeout: 1000,
			enableProd: true,
			build: true,
			headers: { "---------": "----------" },
		}),
	],
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					faker: ["@faker-js/faker"],
				},
			},
		},
	},
});
