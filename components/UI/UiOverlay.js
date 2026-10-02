"use client";

import Box from "@mui/material/Box";
import useGameFunctions from "@/hooks/useGameFunctions";
import { useGameStore } from "@/hooks/useGameStore";

export default function UiOverlay() {
    const timer = useGameStore((state) => state.gameState.timer);
    const { playerHealth, playerScore } = useGameFunctions();

    return (
        <Box
            className="game-ui-overlay"
            data-hide-in-screenshot-mode="true"
            sx={{
                position: "absolute",
                top: 10,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "rgba(0,100,17,0.5)",
                borderRadius: "20px",
                p: "0.5rem",
                width: 350,
                maxWidth: "calc(100vw - 20px)",
                pointerEvents: "none",
            }}
        >
            <Box sx={{
                mr: "1rem",
                display: "flex",
                flexWrap: "nowrap",
                fontSize: "1rem",
                color: "#fff",
                textShadow: "2px 2px 3px rgba(0,0,0,0.7)",
            }}>
                Timer: {timer || 0} - Score: {playerScore()}
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap" }} aria-label={`${playerHealth()} health remaining`}>
                {Array.from({ length: playerHealth() }, (_, index) => (
                    <Box component="img" key={index} src="/img/heart.png" alt="" sx={{ width: 30 }} />
                ))}
            </Box>
        </Box>
    );
}
