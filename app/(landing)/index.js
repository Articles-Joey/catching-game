"use client";

import { Suspense, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoIcon from "@mui/icons-material/Info";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import PaletteIcon from "@mui/icons-material/Palette";
import { GamepadKeyboard, PieMenu } from "@articles-media/articles-gamepad-helper";
import PageTemplateLandingPage from "@articles-media/articles-dev-box/PageTemplateLandingPage";
import { useLandingNavigation } from "@/hooks/useLandingNavigation";
import { useSocketStore } from "@/hooks/useSocketStore";
import { useStore } from "@/hooks/useStore";

const LandingBackgroundAnimation = dynamic(
    () => import("@/components/Game/LandingBackgroundAnimation"),
    { ssr: false },
);

// PieMenu renders its label as a React node; its icon field is not rendered.
function menuLabel(Icon, text) {
    return (
        <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
            <Icon fontSize="small" />
            {text}
        </Box>
    );
}

export default function LobbyPage() {
    const darkMode = useStore((state) => state.darkMode);
    const toggleDarkMode = useStore((state) => state.toggleDarkMode);
    const nicknameKeyboard = useStore((state) => state.nicknameKeyboard);
    const setShowSettingsModal = useStore((state) => state.setShowSettingsModal);
    const setShowCreditsModal = useStore((state) => state.setShowCreditsModal);

    const elementsRef = useRef([]);
    useLandingNavigation(elementsRef);

    const pieOptions = [
        {
            label: "Settings",
            Icon: SettingsIcon,
            callback: () => useStore.getState().setShowSettingsModal(true),
        },
        {
            label: "Go Back",
            Icon: ArrowBackIcon,
            callback: () => window.history.back(),
        },
        {
            label: "Credits",
            Icon: InfoIcon,
            callback: () => useStore.getState().setShowCreditsModal(true),
        },
        {
            label: "Game Launcher",
            Icon: SportsEsportsIcon,
            callback: () => {
                window.location.href = "https://games.articles.media";
            },
        },
        {
            label: `${darkMode ? "Light" : "Dark"} Mode`,
            Icon: PaletteIcon,
            callback: () => useStore.getState().toggleDarkMode(),
        },
    ];

    return (
        <Box
            sx={{
                position: "relative",
                isolation: "isolate",
                "--articles-button-background-color": "#5ba030",
                "--articles-button-color": "#000",
                "& .landing-page": {
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "calc(100vh - 100px)",
                },
                "& .card": { "--articles-card-font-color": "#000" },
                "& .MuiInputBase-root": { bgcolor: "#2e2b2c", color: "#fff" },
                // NicknameInput supplies its own important colors in dev-box.
                "& #nickname": { color: "#fff !important", WebkitTextFillColor: "#fff !important", caretColor: "#fff" },
                "& #nickname::placeholder": {
                    color: "rgba(255,255,255,0.5) !important",
                    WebkitTextFillColor: "rgba(255,255,255,0.5) !important",
                    opacity: 1,
                },
                "& .servers": { display: "grid", gap: "5px", gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
                "& .server": {
                    p: "0.5rem",
                    border: "1px solid rgba(0,0,0,0.25)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                },
                "& .ad-wrap": {
                    mt: "1rem",
                    "@media (min-width: 992px)": {
                        mt: 0,
                        display: "block",
                        position: "absolute",
                        right: "1rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                    },
                },
                "& .background-wrap": {
                    position: "fixed",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: -1,
                    "& img": { filter: "blur(2px)" },
                },
                "& button:focus, & input:focus, & a:focus": {
                    outline: "3px solid #fff",
                    outlineOffset: 2,
                    boxShadow: "0 0 15px rgba(255,255,255,0.8)",
                    zIndex: 10,
                    position: "relative",
                },
            }}
        >
            <Suspense>
                <Box data-hide-in-screenshot-mode="true">
                    <GamepadKeyboard
                        disableToggle
                        active={nicknameKeyboard}
                        onFinish={(text) => {
                            useStore.getState().setNickname(text);
                            useStore.getState().setNicknameKeyboard(false);
                        }}
                        onCancel={() => useStore.getState().setNicknameKeyboard(false)}
                    />
                    <PieMenu
                        options={pieOptions.map(({ label, Icon, callback }) => ({
                            label: (
                                <Box
                                    component="span"
                                    sx={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 0.5,
                                    }}
                                >
                                    <Icon fontSize="small" />
                                    {label}
                                </Box>
                            ),
                            callback,
                        }))}
                        onFinish={(event) => event.callback?.()}
                    />
                </Box>
            </Suspense>

            <PageTemplateLandingPage
                useSocketStore={useSocketStore}
                useStore={useStore}
                Link={Link}
                useRouter={useRouter}
                LandingBackgroundAnimation={<LandingBackgroundAnimation />}
                heroOverride={
                    <Box component="img" src="/img/temp_logo.webp" alt="Catching Game" sx={{ width: "100%" }} />
                }
                backgroundImage={darkMode ? "/img/dark-preview.webp" : "/img/preview.webp"}
                singlePlayerConfig={{
                    attachServerType: "single-player",
                }}
                multiplayerConfig={{
                    type: "WebSocket",
                    defaultServers: 2,
                    onlinePlayersTemplate: "2.0",
                }}
            />
        </Box>
    );
}
