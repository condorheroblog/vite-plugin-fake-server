import type { RollupError } from "rollup";
import process from "node:process";

/* eslint-disable no-console */
/**
 * @see https://github.com/vitejs/vite/blob/main/packages/vite/src/node/logger.ts
 */
import readline from "node:readline";
import colors from "picocolors";

import { name } from "../../package.json";

export type LogType = "error" | "warn" | "info";
export type LogLevel = LogType | "silent";
export interface Logger {
	info: (msg: string, options?: LogOptions) => void
	warn: (msg: string, options?: LogOptions) => void
	warnOnce: (msg: string, options?: LogOptions) => void
	error: (msg: string, options?: LogErrorOptions) => void
	clearScreen: (type: LogType) => void
	hasErrorLogged: (error: Error | RollupError) => boolean
	hasWarned: boolean
}

export interface LogOptions {
	clear?: boolean
	timestamp?: boolean
}

export interface LogErrorOptions extends LogOptions {
	error?: Error | RollupError | null
}

export const LogLevels: Record<LogLevel, number> = {
	silent: 0,
	error: 1,
	warn: 2,
	info: 3,
};

let lastType: LogType | undefined;
let lastMsg: string | undefined;
let sameCount = 0;

function clearScreen() {
	const repeatCount = process.stdout.rows - 2;
	const blank = repeatCount > 0 ? "\n".repeat(repeatCount) : "";
	console.log(blank);
	readline.cursorTo(process.stdout, 0, 0);
	readline.clearScreenDown(process.stdout);
}

export interface LoggerOptions {
	prefix?: string
	allowClearScreen?: boolean
	customLogger?: Logger
}

export function createLogger(level: LogLevel = "info", options: LoggerOptions = {}): Logger {
	if (options.customLogger) {
		return options.customLogger;
	}

	const timeFormatter = new Intl.DateTimeFormat(undefined, {
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
	});
	const loggedErrors = new WeakSet<Error | RollupError>();
	const { prefix = `[${name}]`, allowClearScreen = true } = options;
	const thresh = LogLevels[level];
	const canClearScreen = allowClearScreen && process.stdout.isTTY && !process.env.CI;
	const clear = canClearScreen ? clearScreen : () => {};

	function output(type: LogType, msg: string, options: LogErrorOptions = {}) {
		if (thresh >= LogLevels[type]) {
			const method = type === "info" ? "log" : type;
			const format = () => {
				if (options.timestamp) {
					const tag
						= type === "info"
							? colors.cyan(colors.bold(prefix))
							: type === "warn"
								? colors.yellow(colors.bold(prefix))
								: colors.red(colors.bold(prefix));
					return `${colors.dim(timeFormatter.format(new Date()))} ${tag} ${msg}`;
				}
				else {
					return msg;
				}
			};
			if (options.error) {
				loggedErrors.add(options.error);
			}
			if (canClearScreen) {
				if (type === lastType && msg === lastMsg) {
					sameCount++;
					clear();
					console[method](format(), colors.yellow(`(x${sameCount + 1})`));
				}
				else {
					sameCount = 0;
					lastMsg = msg;
					lastType = type;
					if (options.clear) {
						clear();
					}
					console[method](format());
				}
			}
			else {
				console[method](format());
			}
		}
	}

	const warnedMessages = new Set<string>();

	const logger: Logger = {
		hasWarned: false,
		info(msg, opts) {
			output("info", msg, opts);
		},
		warn(msg, opts) {
			logger.hasWarned = true;
			output("warn", msg, opts);
		},
		warnOnce(msg, opts) {
			if (warnedMessages.has(msg))
				return;
			logger.hasWarned = true;
			output("warn", msg, opts);
			warnedMessages.add(msg);
		},
		error(msg, opts) {
			logger.hasWarned = true;
			output("error", msg, opts);
		},
		clearScreen(type) {
			if (thresh >= LogLevels[type]) {
				clear();
			}
		},
		hasErrorLogged(error) {
			return loggedErrors.has(error);
		},
	};

	return logger;
}
