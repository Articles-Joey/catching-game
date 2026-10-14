"use client";

import Box from "@mui/material/Box";
import useGameFunctions from "@/hooks/useGameFunctions";
import { GAME_DURATION_SECONDS, useGameStore } from "@/hooks/useGameStore";

export default function UiOverlay() {
    const timer = useGameStore((state) => state.gameState.timer);
    const status = useGameStore((state) => state.gameState.status);
    const { playerHealth, playerScore } = useGameFunctions();
    const remainingSeconds = status === "Game Over"
        ? 0
        : Math.max(0, Math.ceil(GAME_DURATION_SECONDS - (timer ?? 0)));
    const remainingTime = `${Math.floor(remainingSeconds / 60)}:${String(remainingSeconds % 60).padStart(2, "0")}`;

    return (
        <Box
            className="game-ui-overlay"
            data-hide-in-screenshot-mode="true"
            sx={{
                position: "absolute",
                top: "calc(10px + env(safe-area-inset-top, 0px))",
                left: "calc(10px + env(safe-area-inset-left, 0px))",
                right: "calc(10px + env(safe-area-inset-right, 0px))",
                zIndex: 2,
                display: "grid",
                gridTemplateColumns: { xs: "minmax(0, 1fr) auto", md: "1fr auto 1fr" },
                alignItems: "start",
                gap: 1,
                pointerEvents: "none",
            }}
        >
            <Box sx={{
                gridColumn: { xs: 1, md: 2 },
                justifySelf: "center",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
                bgcolor: "rgba(0,100,17,0.5)",
                borderRadius: "20px",
                p: "0.5rem",
                width: 350,
                maxWidth: "100%",
            }}>
                <Box sx={{
                    fontSize: "1rem",
                    color: "#fff",
                    textShadow: "2px 2px 3px rgba(0,0,0,0.7)",
                }}>
                    Score: {playerScore()}
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap" }} aria-label={`${playerHealth()} health remaining`}>
                    {Array.from({ length: playerHealth() }, (_, index) => (
                        <Box component="img" key={index} src="/img/heart.png" alt="" sx={{ width: 30 }} />
                    ))}
                </Box>
            </Box>
            <Box
                role="timer"
                aria-label={`${remainingSeconds} seconds remaining`}
                sx={{
                    gridColumn: { xs: 2, md: 3 },
                    justifySelf: "end",
                    position: "relative",
                    width: { xs: 96, sm: 120 },
                    aspectRatio: "1",
                }}
            >
                <Box
                    component="img"
                    src="/img/toontown/alarm-clock-filled.webp"
                    alt=""
                    draggable={false}
                    sx={{ display: "block", width: "100%", height: "100%", objectFit: "contain" }}
                />
                <Box component="span" sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: { xs: "1.2rem", sm: "1.5rem" },
                    fontWeight: 900,
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: 1,
                    color: remainingSeconds <= 10 ? "#c62828" : "#162b61",
                }}>
                    {remainingTime}
                </Box>
            </Box>
        </Box>
    );
}
