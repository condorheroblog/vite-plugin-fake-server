/** @type {import('tailwindcss').Config} */
export default {
	darkMode: "class",
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			keyframes: {
				"loading-dash": {
					"0%": {
						"stroke-dasharray": "1,200",
						"stroke-dashoffset": 0,
					},
					"50%": {
						"stroke-dasharray": "90,150",
						"stroke-dashoffset": "-40px",
					},
					"100%": {
						"stroke-dasharray": "90,150",
						"stroke-dashoffset": "-120px",
					},
				},
				loading: {
					"50%": {
						transform: "rotate(180deg)",
					},
					"100%": {
						transform: "rotate(360deg)",
					},
				},
			},
		},
	},
	plugins: [],
};
