/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0f0f0f",
                card: "#1a1a1a",
                primary: "#ff3b30",
                secondary: "#2c2c2e",
                accent: "#0a84ff",
            },
        },
    },
    plugins: [],
    darkMode: 'class',
}
