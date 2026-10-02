"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import { useSearchParams } from "next/navigation";
import { useGameStore } from "@/hooks/useGameStore";
import useGameFunctions from "@/hooks/useGameFunctions";
import ArticlesButton from "./Button";

export default function GameDetailsPanel() {
    const players = useGameStore((state) => state.gameState.players);
    const fallingItems = useGameStore((state) => state.gameState.fallingItems);

    return (
        <Card sx={{ bgcolor: "game.card", backgroundImage: "none", border: 1, borderColor: "divider" }}>
            <CardContent>
                <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between", fontSize: "1rem" }}>
                    <RoundAndTimer />
                </Box>
                <Box>Players</Box>
                {players?.map((player) => (
                    <Box key={player.id} sx={{ border: 1, borderColor: "divider", p: 1 }}>
                        <Box sx={{ fontSize: "0.6rem" }}>ID: {player.id}</Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <Chip
                                label={player.ready ? "Ready" : "Not Ready"}
                                color={player.ready ? "success" : "error"}
                                size="small"
                                sx={{ height: 20, fontSize: "0.6rem" }}
                            />
                            <Box component="span">{player.nickname || "?"} - {player.score || 0}</Box>
                        </Box>
                        <Box>X: {player?.position?.x?.toFixed(2) || 0} | Z: {player?.position?.z?.toFixed(2) || 0}</Box>
                    </Box>
                ))}
                <Box>Falling Items</Box>
                {fallingItems?.map((obj) => (
                    <Box key={obj.id} sx={{ border: 1, borderColor: "divider", p: 1 }}>
                        <Box sx={{ fontSize: "0.6rem" }}>ID: {obj.id}</Box>
                        <Box>X: {obj?.x?.toFixed(2) || 0} | Z: {obj?.z?.toFixed(2) || 0}</Box>
                    </Box>
                ))}
            </CardContent>
        </Card>
    );
}

function RoundAndTimer() {
    const timer = useGameStore((state) => state.gameState.timer);
    const status = useGameStore((state) => state.gameState.status);
    const { startGame } = useGameFunctions();
    const searchParams = useSearchParams();
    const server = searchParams.get("server");

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>Time: {timer || 0}</Box>
                <Box>Status: {status || "N/A"}</Box>
            </Box>
            <ArticlesButton
                small
                sx={{ width: "100%", mt: 0.5 }}
                disabled={status === "In Progress"}
                onClick={() => startGame(server, "In Progress")}
            >
                Start Game
            </ArticlesButton>
        </Box>
    );
}
