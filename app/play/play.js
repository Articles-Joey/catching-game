"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import classNames from "classnames";
import useFullscreen from "@articles-media/articles-dev-box/useFullscreen";
import GameMenu from "@articles-media/articles-dev-box/GameMenu";
import LeftPanelContent from "@/components/UI/LeftPanel";
import { useStore } from "@/hooks/useStore";
import { useGameStore } from "@/hooks/useGameStore";
import UiOverlay from "@/components/UI/UiOverlay";
import SinglePlayerHandler from "@/components/Handlers/SinglePlayerHandler";
import GameOverOverlay from "@/components/UI/GameOverOverlay";
import useTouchControlsStore from "@/hooks/useTouchControlsStore";

const TouchControls = dynamic(() => import("@/components/UI/TouchControls"), { ssr: false });
const GameCanvas = dynamic(() => import("@/components/Game/GameCanvas"), { ssr: false });

export default function GamePage() {
    const sidebar = useStore((state) => state.sidebar);
    const showMenu = useStore((state) => state.showMenu);
    const sceneKey = useStore((state) => state.sceneKey);
    const beginGameSession = useGameStore((state) => state.beginGameSession);
    const resetGame = useGameStore((state) => state.resetGame);
    const setShowGameOverModal = useStore((state) => state.setShowGameOverModal);
    const [sessionReady, setSessionReady] = useState(false);
    const { isFullscreen } = useFullscreen();

    useEffect(() => {
        beginGameSession();
        setShowGameOverModal(false);
        setSessionReady(true);

        return () => {
            resetGame();
            setShowGameOverModal(false);
            useTouchControlsStore.getState().setTouchControls({
                jump: false, left: false, right: false, up: false, down: false,
            });
        };
    }, [beginGameSession, resetGame, setShowGameOverModal]);

    if (!sessionReady) return null;

    return (
        <Box
            className={classNames(`${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`, {
                "menu-open": showMenu,
                fullscreen: isFullscreen,
                "show-sidebar": sidebar,
            })}
            id={`${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`}
            sx={(theme) => ({
                position: "relative",
                display: "flex",
                "--toontown-bg-color": theme.palette.mode === "dark" ? "#a0a56c" : "#faffc7",
                "--toontown-green-color": theme.palette.mode === "dark" ? "#005300" : "#019f02",
                "--game-menu-header-background-color": "rgba(1, 159, 2, 0.5)",
                "--game-menu-divider-color": "rgba(1, 80, 2, 0.2)",
                // Match Cannon's menu skin on desktop and inside the mobile menu.
                "& .panel-left, & .menu-bar, & .mobile-menu-container": {
                    bgcolor: "var(--toontown-bg-color)",
                    color: "#000",
                    border: "2px solid var(--toontown-green-color)",
                    borderRadius: "10px",
                    "--card-background-override": "transparent",
                    "--articles-button-background-color": "#ffd351",
                    "--articles-button-hover-background-color": "#ffe078",
                    "--articles-button-color": "#000",
                    "--articles-button-hover-color": "#000",
                    "--articles-card-font-color": "#000",
                    "--articles-card-background-color": "transparent",
                },
                "& .panel-left, & .mobile-menu-container": { borderWidth: "10px" },
            })}
        >
            <GameMenu
                useStore={useStore}
                LeftPanelContent={LeftPanelContent}
                menuBarConfig={{ style: "Corner Button", menuBarButtonPosition: "Left" }}
                sidebarConfig={{ style: "Static Panel" }}
            />
            <SinglePlayerHandler />
            <Box
                className="canvas-wrap"
                sx={{
                    position: "relative",
                    width: "100vw",
                    height: "100vh",
                    "& canvas": {
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        left: 0,
                        top: 0,
                    },
                }}
            >
                <TouchControls />
                <UiOverlay />
                <GameOverOverlay />
                <GameCanvas key={sceneKey} />
            </Box>
        </Box>
    );
}
