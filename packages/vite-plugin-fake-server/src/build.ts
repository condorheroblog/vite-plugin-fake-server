import { version, name } from "../package.json";
import { FAKE_FILE_EXTENSIONS } from "./node";
import type { ResolvePluginOptionsType } from "./resolvePluginOptions";
import type { ServerBuildOptions } from "./types";
import { existsSync } from "node:fs";
import { mkdir, writeFile, readdir, copyFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import pc from "picocolors";

export const PORT = 8888;
export const OUTPUT_DIR = "mockServer";

export async function generateMockServer(options: ResolvePluginOptionsType) {
	const buildOptions = options.build === true ? { port: PORT, outDir: OUTPUT_DIR } : options.build;

	const { port = PORT, outDir = OUTPUT_DIR } = buildOptions as Required<ServerBuildOptions>;
	const cwd = process.cwd();
	const outputDir = join(cwd, outDir);

	const outputList = [
		{
			filename: join(outputDir, "index.js"),
			source: generatorServerEntryCode(port, options),
		},
		{
			filename: join(outputDir, "package.json"),
			source: generatePackageJson(),
		},
	];

	if (!existsSync(outputDir)) {
		await mkdir(outputDir, { recursive: true });
	}

	// copy mock directory
	await copyMockFiles(join(cwd, options.include[0]), join(outputDir, options.include[0]));
	for (const { filename, source } of outputList) {
		await writeFile(filename, source, "utf-8");
	}
	console.log(`\n[${name}]Builded a independently service in`, pc.green(outputDir), "\n");
	console.log(
		`We suggest that you begin by typing:\n\n  ${pc.blue("cd")} ${outDir}\n  ${pc.blue("npm install")}\n  ${pc.blue(
			"npm run start",
		)}\n\nHappy Hacking!\nSee more: ${pc.underline(
			pc.blue("https://github.com/condorheroblog/vite-plugin-fake-server#build"),
		)}`,
	);
}

function generatePackageJson() {
	const mockPkg = {
		name: "mock-server",
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
	return JSON.stringify(mockPkg, null, 2);
}

function generatorServerEntryCode(port: number, options: ResolvePluginOptionsType) {
	return `import connect from "connect";
import { getFakeData, requestMiddleware } from "${name}";

async function main() {
	const fakeData = await getFakeData(${JSON.stringify(options, null, 2)});
	const middleware = await requestMiddleware({...${JSON.stringify(options, null, 2)}, fakeData});

	const app = connect();
	app.use(middleware);

	app.listen(${port});
	console.log("listen: http://localhost:${port}");
}

main();
`;
}

export async function copyMockFiles(sourceDir: string, targetDir: string) {
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
				await copyMockFiles(sourcePath, targetPath);
			} else {
				const ext = extname(file).toLowerCase().slice(1);
				if (FAKE_FILE_EXTENSIONS.includes(ext)) {
					await copyFile(sourcePath, targetPath);
				}
			}
		}

		// console.log(`Mock files copied from ${sourceDir} to ${targetDir}`);
	} catch (error) {
		console.error(`Error copying mock files: ${error}`);
	}
}
