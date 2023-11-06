import { version, name } from "../package.json";
import { FAKE_FILE_EXTENSIONS } from "./node";
import type { ResolvePluginOptionsType } from "./resolvePluginOptions";
import type { ServerBuildOptions } from "./types";
import { existsSync } from "node:fs";
import { mkdir, writeFile, readdir, copyFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import pc from "picocolors";
import type { ResolvedConfig } from "vite";

export const PORT = 8888;
export const OUTPUT_DIR = "fakeServer";

export async function generateFakeServer(options: ResolvePluginOptionsType, config: ResolvedConfig) {
	const buildOptions = options.build === true ? { port: PORT, outDir: OUTPUT_DIR } : options.build;

	const { port = PORT, outDir = OUTPUT_DIR } = buildOptions as Required<ServerBuildOptions>;
	const cwd = process.cwd();
	const outputDir = join(cwd, outDir);

	const outputList = [
		{
			filename: join(outputDir, "index.js"),
			source: generatorServerEntryCode(port, options, config),
		},
		{
			filename: join(outputDir, "package.json"),
			source: generatePackageJson(),
		},
	];

	if (!existsSync(outputDir)) {
		await mkdir(outputDir, { recursive: true });
	}

	// copy fake directory
	await copyFakeFiles(join(cwd, options.include), join(outputDir, options.include));
	for (const { filename, source } of outputList) {
		await writeFile(filename, source, "utf-8");
	}
	console.log(`\n[${name}]Builded a independently service in`, pc.green(outputDir), "\n");
	console.log(pc.yellow(`\nThis is just a template, you can adjust it according to your needs\n`));
	console.log(
		`We suggest that you begin by typing:\n\n  ${pc.blue("cd")} ${outDir}\n  ${pc.blue("npm install")}\n  ${pc.blue(
			"npm run start",
		)}\n\nHappy Hacking!\nSee more: ${pc.underline(
			pc.blue("https://github.com/condorheroblog/vite-plugin-fake-server#build"),
		)}`,
	);
}

function generatePackageJson() {
	const fakePkg = {
		name: "fake-server",
		version,
		private: true,
		type: "module",
		scripts: {
			start: "node index.js",
		},
		dependencies: {
			connect: "latest",
			[name]: `^${version}`,
		},
	};
	return JSON.stringify(fakePkg, null, 2);
}

function generatorServerEntryCode(port: number, options: ResolvePluginOptionsType, config: ResolvedConfig) {
	return `import connect from "connect";
import { createFakeMiddleware, createLogger } from "${name}";

const loggerOutput = createLogger(${JSON.stringify(config.logLevel)}, {
	allowClearScreen: ${config.clearScreen},
	// customLogger: ${config.customLogger},
});

async function main() {

	const app = connect();
	const middleware = await createFakeMiddleware(
		{
			...${JSON.stringify(options, null, 2)},
			loggerOutput,
			// config.root
			root: process.cwd(),
		},
		app
	);
	app.use(middleware);

	app.listen(${port});
	console.log("listen: http://localhost:${port}");
}

main();
`;
}

export async function copyFakeFiles(sourceDir: string, targetDir: string) {
	try {
		if (!existsSync(targetDir)) {
			await mkdir(targetDir, { recursive: true });
		}

		const files = await readdir(sourceDir);

		for (const file of files) {
			const sourcePath = join(sourceDir, file);
			const targetPath = join(targetDir, file);

			const fileStatus = await stat(sourcePath);
			if (fileStatus.isDirectory()) {
				await copyFakeFiles(sourcePath, targetPath);
			} else {
				const ext = extname(file).toLowerCase().slice(1);
				if (FAKE_FILE_EXTENSIONS.includes(ext)) {
					await copyFile(sourcePath, targetPath);
				}
			}
		}

		// console.log(`Fake files copied from ${sourceDir} to ${targetDir}`);
	} catch (error) {
		console.error(`Error copying fake files: ${error}`);
	}
}
