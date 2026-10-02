"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useGameStore } from "@/hooks/useGameStore";
import ArticlesButton from "./Button";

export default function DebugCard({ reloadScene }) {
    const score = useGameStore((state) => state.score);
    const playerLocation = useGameStore((state) => state.playerLocation);

    return (
        <Card sx={{ bgcolor: "game.card", backgroundImage: "none", fontSize: "0.875rem", border: 1, borderColor: "divider" }}>
            <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                <Box sx={{ fontSize: "0.875em", color: "text.secondary" }}>Debug Controls</Box>
                <Box sx={{ fontSize: "0.875em", border: 1, borderColor: "divider", p: 1 }}>
                    <Box>Score: {score}</Box>
                    <Box>
                        Position: {playerLocation?.x?.toFixed(2)} - {playerLocation?.y?.toFixed(2)} - {playerLocation?.z?.toFixed(2)}
                    </Box>
                </Box>
                <Box sx={{ display: "flex" }}>
                    <ArticlesButton small sx={{ width: "50%" }} onClick={reloadScene} startIcon={<RestartAltIcon />}>
                        Reload Game
                    </ArticlesButton>
                    <ArticlesButton small sx={{ width: "50%" }} onClick={reloadScene} startIcon={<RestartAltIcon />}>
                        Reset Camera
                    </ArticlesButton>
                </Box>
            </CardContent>
        </Card>
    );
}
