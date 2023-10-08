import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";


// Environment variables
const build = process.env.BUILD || "development";
const isDev = (build === "development");


/**
 * @type {import("rollup").Plugin[]}
 */
const plugins =
[
	replace({
		include: "./src/utilities/environment.ts",
		preventAssignment: true,
		values: {
			__BUILD_CONFIGURATION__: JSON.stringify(build)
		}
	}),
	typescript({ tsconfig: "./tsconfig.json" }),
];


/**
 * @type {import("rollup").RollupOptions}
 */
const config = [
	{
		// Regular build
		input: "./src/index.ts",
		output: [
			{
				file: "./dist/index.mjs",
				format: "esm",
			},
			{
				file: "./dist/index.js",
				format: "cjs",
				exports: "default"
			}
		],
		plugins,
	},
	{
		// Minified build
		input: "./src/index.ts",
		output: [
			{
				file: "./dist/index.min.mjs",
				format: "esm",
			},
			{
				file: "./dist/index.min.js",
				format: "cjs",
				exports: "default"
			}
		],
		plugins: [
			...plugins,
			terser({
				compress: {
					passes: 5,
					unsafe: true
				},
				format: {
					comments: false,
					quote_style: 1,
					wrap_iife: true,
					preamble: "// Get the latest version: https://github.com/Basssiiie/OpenRCT2-Mocks",

					beautify: isDev,
				},

				// Useful only for stacktraces:
				keep_fnames: isDev,
			}),
		],
	},
	{
		// Declaration file packaging
		input: "./src/index.ts",
		output: {
			file: "./dist/index.d.ts",
		},
		plugins: [
			typescript({ tsconfig: "./tsconfig.dts.json" }),
			dts()
		]
	}
];
export default config;
