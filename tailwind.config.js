/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        screens: {
            xs: "480px",
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1536px",
        },
        extend: {
            colors: {
                primary: "#e9a83a",
                secondary: "#fed874",
                tertiary: "#e79734",
                quaternary: "#a26a24",
                quinary: "#e7df34",
                senary: "#a28324",
                septenary: "#e7a334",
            },
            spacing: {
                72: "18rem",
                84: "21rem",
                96: "24rem",
            },
        },
    },
    plugins: [],
};
