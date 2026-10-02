"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useGameStore } from "@/hooks/useGameStore";
import { useScoreStore } from "@/hooks/useScoreStore";
import useGameHelpers from "@/hooks/useGameHelpers";
import ArticlesButton from "./Button";

export default function GameOverOverlay() {
    const searchParams = useSearchParams();
    const server = searchParams.get("server");
    const serverType = searchParams.get("server_type");
    const gameState = useGameStore((state) => state.gameState);
    const maxScore = useScoreStore((state) => state.maxScore);
    const recentScores = useScoreStore((state) => state.recentScores);
    const { startGame } = useGameHelpers();
    const isSinglePlayer = serverType === "single-player" || !server;
    const playerScore = gameState?.players?.[0]?.score || 0;

    if (gameState?.status !== "Game Over") return null;

    return (
        <Box
            className="game-over-overlay"
            data-hide-in-screenshot-mode="true"
            sx={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 3,
                width: 300,
                maxWidth: "calc(100vw - 32px)",
                maxHeight: "calc(100dvh - 32px)",
                overflowY: "auto",
            }}
        >
            <Card sx={{ bgcolor: "game.card", backgroundImage: "none", border: 1, borderColor: "divider" }}>
                <Box sx={{ px: 2, py: 1, bgcolor: "rgba(0,0,0,0.03)", borderBottom: 1, borderColor: "divider" }}>
                    Game Over
                </Box>
                <CardContent sx={{ textAlign: "center" }}>
                    <Typography component="h2" variant="h5" sx={{ mb: 1 }}>Time&apos;s Up!</Typography>
                    {isSinglePlayer && (
                        <>
                            <Box>You had a final score of {playerScore}!</Box>
                            <Box>Your highest score is {maxScore}!</Box>
                            <Divider sx={{ my: 2 }} />
                            <Box>Recent Scores:</Box>
                            {recentScores.length === 0 && <Box>No recent scores found.</Box>}
                            {recentScores.map((score, index) => (
                                <Box key={index}>{score.nickname}: {score.score}</Box>
                            ))}
                        </>
                    )}
                </CardContent>
                <CardActions sx={{ px: 2, py: 1, gap: 1, borderTop: 1, borderColor: "divider", "& > :not(style) ~ :not(style)": { ml: 0 } }}>
                    <ArticlesButton component={Link} href="/" startIcon={<CloseIcon />} sx={{ flex: 1 }}>
                        Close
                    </ArticlesButton>
                    <ArticlesButton onClick={() => startGame("In Lobby")} startIcon={<PlayArrowIcon />} sx={{ flex: 1 }}>
                        Play Again
                    </ArticlesButton>
                </CardActions>
            </Card>
        </Box>
    );
}
