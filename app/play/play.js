"use client";

import { useEffect } from "react";
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

const TouchControls = dynamic(() => import("@/components/UI/TouchControls"), { ssr: false });
const GameCanvas = dynamic(() => import("@/components/Game/GameCanvas"), { ssr: false });

export default function GamePage() {
    const sidebar = useStore((state) => state.sidebar);
    const showMenu = useStore((state) => state.showMenu);
    const sceneKey = useStore((state) => state.sceneKey);
    const setScore = useGameStore((state) => state.setScore);
    const setHealth = useGameStore((state) => state.setHealth);
    const setTimer = useGameStore((state) => state.setTimer);
    const { isFullscreen } = useFullscreen();

    useEffect(() => {
        setHealth(5);
        setScore(0);
        setTimer(60);
    }, [sceneKey, setHealth, setScore, setTimer]);

    return (
        <Box
            className={classNames(`${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`, {
                "menu-open": showMenu,
                fullscreen: isFullscreen,
                "show-sidebar": sidebar,
            })}
            id={`${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`}
            sx={{ position: "relative", display: "flex" }}
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
