"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { useSearchParams } from "next/navigation";
import { useGameStore } from "@/hooks/useGameStore";
import useGameFunctions from "@/hooks/useGameFunctions";
import ArticlesButton from "./Button";
import MenuCard from "./MenuCard";

const sectionHeaderSx = {
    p: 1,
    bgcolor: "var(--game-menu-header-background-color)",
    borderBottom: 1,
    borderColor: "var(--game-menu-divider-color)",
};

export default function GameDetailsPanel({ debug }) {
    const players = useGameStore((state) => state.gameState.players);
    const fallingItems = useGameStore((state) => state.gameState.fallingItems);

    return (
        <>
            <MenuCard sx={{ p: 2 }}>
                <RoundAndTimer />
            </MenuCard>
            <MenuCard>
                <Box sx={sectionHeaderSx}>Players</Box>
                <Box sx={{ p: 1 }}>
                    {players?.map((player) => (
                        <Box key={player.id} sx={{ border: 1, borderColor: "var(--game-menu-divider-color)", p: 1 }}>
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
                </Box>
            </MenuCard>
            {debug && (
                <MenuCard>
                    <Box sx={sectionHeaderSx}>Falling Items</Box>
                    <Box sx={{ p: 1 }}>
                        {fallingItems?.map((obj) => (
                            <Box key={obj.id} sx={{ border: 1, borderColor: "var(--game-menu-divider-color)", p: 1 }}>
                                <Box sx={{ fontSize: "0.6rem" }}>ID: {obj.id}</Box>
                                <Box>X: {obj?.x?.toFixed(2) || 0} | Z: {obj?.z?.toFixed(2) || 0}</Box>
                            </Box>
                        ))}
                    </Box>
                </MenuCard>
            )}
        </>
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
                variant="success"
                sx={{ width: "100%", mt: 0.5 }}
                disabled={status === "In Progress"}
                onClick={() => startGame(server, "In Progress")}
            >
                Start Game
            </ArticlesButton>
        </Box>
    );
}
