/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    fontFamily: {
        sans: ["Inter", "sans-serif"],
        cursive: ["'Dancing Script'", "cursive"],
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
    ],
}
