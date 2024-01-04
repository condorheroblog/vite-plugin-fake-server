import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { vitePluginFakeServer } from "vite-plugin-fake-server";
import basicSSL from "@vitejs/plugin-basic-ssl";

// https://vitejs.dev/config/
export default defineConfig({
	optimizeDeps: {
		include: ["vue"],
		exclude: ["vite-plugin-fake-server"],
	},
	server: {
		https: {},
	},
	plugins: [
		vitePluginFakeServer({
			timeout: 1000,
			enableProd: true,
			headers: { "---------": "----------" },
			basename: "http2",
		}),
		vue(),
		basicSSL(),
	],
});
