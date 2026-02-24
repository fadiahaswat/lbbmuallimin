/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './js/**/*.js',
    ],
    theme: {
        extend: {
            colors: {
                'lbb-red':  '#8B0000',
                'lbb-gold': '#FFD700',
                'lbb-dark': '#111111',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
