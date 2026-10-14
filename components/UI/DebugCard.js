"use client";

import Box from "@mui/material/Box";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useGameStore } from "@/hooks/useGameStore";
import { useStore } from "@/hooks/useStore";
import ArticlesButton from "./Button";
import MenuCard from "./MenuCard";

export default function DebugCard({ reloadScene }) {
    const score = useGameStore((state) => state.score);
    const playerLocation = useGameStore((state) => state.playerLocation);
    const resetCamera = useStore((state) => state.resetCamera);

    return (
        <MenuCard sx={{ p: 1 }}>
            <Box sx={{ fontSize: "0.875em" }}>Debug Controls</Box>
            <Box sx={{ fontSize: "0.875em", border: 1, borderColor: "var(--game-menu-divider-color)", p: 1 }}>
                <Box>Score: {score}</Box>
                <Box>
                    Position: {playerLocation?.x?.toFixed(2)} - {playerLocation?.y?.toFixed(2)} - {playerLocation?.z?.toFixed(2)}
                </Box>
            </Box>
            <Box sx={{ display: "flex" }}>
                <ArticlesButton small sx={{ width: "50%" }} onClick={reloadScene} startIcon={<RestartAltIcon />}>
                    Reload Game
                </ArticlesButton>
                <ArticlesButton small sx={{ width: "50%" }} onClick={resetCamera} disabled={!resetCamera} startIcon={<RestartAltIcon />}>
                    Reset Camera
                </ArticlesButton>
            </Box>
        </MenuCard>
    );
}
