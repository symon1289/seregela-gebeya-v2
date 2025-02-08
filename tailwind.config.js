/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        screens: {
            xs: '480px',
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px',
        },
        extend: {
            colors: {
                primary: '#e9a83a',
                secondary: '#fed874',
            },
            spacing: {
                72: '18rem',
                84: '21rem',
                96: '24rem',
            },
        },
    },
    plugins: [],
};
