// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    '50': '#fffefc',
                    '100': '#fffbf5',
                    '200': '#fff4e5',
                    '300': '#ffe9cd',
                    '400': '#ffd1a2',
                    '500': '#ffb56b', // Cor de destaque principal (similar a amber/orange)
                    '600': '#ed943f',
                    '700': '#d47321', // Cor mais escura para texto/destaque (similar a amber-700)
                    '800': '#b45a1c',
                    '900': '#94481b',
                    '950': '#52210a',
                },
                stone: { // Mantendo os tons de stone do Tailwind
                    50: '#fafaf9',
                    100: '#f5f5f4',
                    200: '#e7e5e4',
                    300: '#d6d3d1',
                    400: '#a8a29e',
                    500: '#78716c',
                    600: '#57534e',
                    700: '#44403c',
                    800: '#292524',
                    900: '#1c1917',
                    950: '#0c0a09',
                }
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'],
                serif: ['Merriweather', 'ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
            },
        },
    },
    plugins: [],
}
