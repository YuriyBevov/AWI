import Inspect from "vite-plugin-inspect";
import vituum from "vituum";
import pug from "@vituum/vite-plugin-pug";
import pages from "vituum/plugins/pages.js";
import imports from "vituum/plugins/imports.js";
import svgSpritemap from "vite-plugin-svg-spritemap";
import { resolve } from "path";
import { defineConfig } from "vite";

import { getFileName } from "./app.config";

const MODE = process.env.NODE_ENV || "development";

export default defineConfig({
	plugins: [
		Inspect(),
		vituum(),
		pug({
			options: {
				pretty: true,
			},
		}),
		imports({
			paths: ["/src/assets/*/**"],
		}),
		pages({
			dir: "./",
			root: "./",
			normalizeBasePath: true,
		}),

		svgSpritemap({
			pattern: "./src/assets/sprite/*.svg",
			filename: "assets/sprite.svg",
			prefix: "",
			svgo: {
				multipass: true,
				plugins: [
					{ name: "cleanupAttrs", params: { removeEmptyAttrs: true } },
					{
						name: "removeAttrs",
						params: {
							attrs: ["fill", "fill-rule", "stroke", "stroke-width"],
						},
					},
				],
			},
		}),
	],

	css: {
		preprocessorOptions: {
			scss: {
				api: "modern",
			},
		},
	},

	publicDir: "public",
	root: "./src",
	build: {
		minify: false, // not for PUG
		outDir: "../dist",
		emptyOutDir: true,
		// cssCodeSplit: true,
		rollupOptions: {
			input: ["*.{pug,html,js}"],
			output: {
				assetFileNames: getFileName,
			},
		},
	},

	base: "./",
	server: {
		port: 3000,
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
			"@assets": resolve(__dirname, "./src/assets"),
			"@styles": resolve(__dirname, "./src/styles"),
			"@pug": resolve(__dirname, "./src/pug"),
			"@img": resolve(__dirname, "./src/assets/img"),
			"@js": resolve(__dirname, "./src/js"),
		},
	},
});
