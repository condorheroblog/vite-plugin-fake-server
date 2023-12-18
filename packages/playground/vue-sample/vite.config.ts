import { resolve } from "node:path";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { vitePluginFakeServer } from "vite-plugin-fake-server";

// https://vitejs.dev/config/
export default defineConfig({
	optimizeDeps: {
		include: ["vue"],
		exclude: ["vite-plugin-fake-server"],
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, ".", "fake"),
		},
	},
	plugins: [
		vitePluginFakeServer({ timeout: 1000, enableProd: true, headers: { "---------": "----------" }, basename: "vue" }),
		vue(),
	],
});
