import Inspect from "vite-plugin-inspect";
import vituum from "vituum";
import pug from "@vituum/vite-plugin-pug";
import pages from "vituum/plugins/pages.js";
import imports from "vituum/plugins/imports.js";
import VitePluginSvgSpritemap from "@spiriit/vite-plugin-svg-spritemap";
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
		// VitePluginSvgSpritemap("./src/assets/sprite/*.svg", {
		// 	styles: false,
		// 	injectSVGOnDev: true,

		// 	prefix: "", // префикс перед иконкой use(xlink:href='./sprite.svg#{PREFIX}icon-chevron-down')
		// 	route: "assets/sprite.svg", // название файла спрайта use(xlink:href='./{ROUTE}#icon-chevron-down')
		// 	output: {
		// 		filename: "sprite.svg", // название файла спрайта на выходе
		// 		view: true,
		// 		use: true,
		// 	},
		// 	svgo: {
		// 		plugins: [
		// 			{
		// 				name: "removeStyleElement",
		// 			},
		// 			{
		// 				name: "removeAttrs",
		// 				params: {
		// 					attrs: "(fill|height|width)",
		// 				},
		// 			},
		// 		],
		// 	},
		// }),
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
		},
	},
});
