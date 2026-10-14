"use client";

import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import { bootstrapCompatibilityTheme } from "@articles-media/articles-dev-box/bootstrapCompatibilityTheme";

const roboto = Roboto({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
});

export function createAppTheme(mode = "dark") {
    const cardBackground = mode === "dark" ? "#a0a56c" : "#faffc7";
    const cardBorder = mode === "dark" ? "#005300" : "#019f02";

    return createTheme({
        cssVariables: true,
        palette: {
            mode,
            primary: { main: "#f9edcd" },
            game: { card: cardBackground },
        },
        typography: {
            fontFamily: roboto.style.fontFamily,
        },
        components: {
            MuiCard: {
                styleOverrides: {
                    root: {
                        backgroundColor: cardBackground,
                        backgroundImage: "none",
                        color: "#000",
                        border: `2px solid ${cardBorder}`,
                        borderRadius: "10px",
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: { fontSize: "0.75rem" },
                },
            },
            MuiAlert: {
                styleOverrides: {
                    root: {
                        variants: [{
                            props: { severity: "info" },
                            style: { backgroundColor: "#60a5fa" },
                        }],
                    },
                },
            },
            MuiCssBaseline: {
                // Dev-box still uses these compatibility utilities internally.
                styleOverrides: (muiTheme) => ({
                    ...bootstrapCompatibilityTheme.MuiCssBaseline.styleOverrides(muiTheme),
                    ":root": {
                        "--card-background-override": cardBackground,
                        "--articles-card-font-color": "#000",
                        "--toontown-bg-color": cardBackground,
                        "--toontown-green-color": cardBorder,
                    },
                    ".landing-page .card, .landing-page .MuiCard-root": {
                        backgroundColor: cardBackground,
                        color: "#000",
                        border: `10px solid ${cardBorder}`,
                        borderRadius: "10px",
                        "--articles-button-background-color": "#ffd351",
                        "--articles-button-hover-background-color": "#ffe078",
                        "--articles-button-color": "#000",
                        "--articles-button-hover-color": "#000",
                        "--articles-card-font-color": "#000",
                    },
                    ".landing-page .card-header, .landing-page .card-footer, .landing-page .MuiCardHeader-root": {
                        backgroundColor: "rgba(1, 159, 2, 0.5)",
                        color: "#000",
                        borderColor: "rgba(1, 80, 2, 0.2)",
                    },
                    ".stats-overlay": {
                        position: "fixed",
                        top: 0,
                        right: "0 !important",
                        left: "initial !important",
                        zIndex: 4,
                    },
                    '[data-articles-dev-box-screenshot-mode="enabled"] .stats-overlay': {
                        display: "none !important",
                    },
                }),
            },
        },
    });
}

export default createAppTheme();
