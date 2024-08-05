import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                paper: "#F8FAFC",
                highlighted: "#E4E4E7",
                highlighted_2: "#E4E4E7",
                dustyPaperEvenDarker: "#D6D1C9",
                dustyPaperDarkest: "#776B5D",
            },
            fontFamily: {
                poetsen: ["Poetsen One", "sans-serif"],
            },
            // backgroundImage: {
            //   "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
            //   "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            // },
        },
    },
    plugins: [],
};
export default config;
