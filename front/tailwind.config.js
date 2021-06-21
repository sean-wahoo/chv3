module.exports = {
    purge: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "media", // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                pageBgLight: "#F4F4F4",
                pageBgDark: "#111111",
                purpleNav: "#8E49FF",
                headerDark: "#1A1A1A",
                lightBorder: "#C4C4C4",
                postBodyLight: "#7C7C7C",
                postBodyDark: "#D6D6D6",
                postBlockDark: "#1A1A1A",
                slideInMenuDark: "#3d3d3d",
            },
            spacing: {
                mobileMenuTranslate: "150%",
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
