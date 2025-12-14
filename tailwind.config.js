/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./utils/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Space Grotesk"', 'sans-serif'],
            },
            animation: {
                'nudge-right': 'nudge-right 1s infinite',
            },
            keyframes: {
                'nudge-right': {
                    '0%, 100%': {
                        transform: 'translateX(0)',
                        animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    },
                    '50%': {
                        transform: 'translateX(6px)',
                        animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    },
                },
            },
        },
    },
    plugins: [],
}
