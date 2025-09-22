import fs from "node:fs";
import path from "node:path";

function getFileName(assetInfo) {
	let extType = assetInfo.name.split(".").pop();
	let path = `assets/${extType}/[name][extname]`;

	if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
		extType = "img";
		path = `assets/${extType}/[name][extname]`;
	}

	if (/ttf|eot|woff2?/i.test(extType)) {
		extType = "fonts";
		path = `assets/${extType}/[name][extname]`;
	}

	return path;
}

export { getFileName };
