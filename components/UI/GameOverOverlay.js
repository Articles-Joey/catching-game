"use client"
import { useGameStore } from "@/hooks/useGameStore";
import ArticlesButton from "./Button";
import { useSearchParams } from "next/navigation";
import useGameHelpers from "@/hooks/useGameHelpers";
import Link from "next/link";
import { useScoreStore } from "@/hooks/useScoreStore";

export default function GameOverOverlay() {

    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server, server_type } = params

    const gameState = useGameStore(state => state.gameState)
    const status = gameState?.status

    const maxScore = useScoreStore(state => state.maxScore)

    const {
        startGame
    } = useGameHelpers()

    const playerScore = useMemo(() => {

        if (server_type === "single-player") {
            return gameState?.players?.[0]?.score || 0
        }

    }, [gameState])

    if (status !== "Game Over") return null;

    return (
        <div className='game-over-overlay'>

            <div className="card card-articles">

                <div className="card-header">
                    Game Over
                </div>

                <div className="card-body">

                    <div className='text-center'>
                        <h2>{`Time's Up!`}</h2>
                    </div>

                    {server_type === "single-player" || !server &&
                        <>
                            <div className='text-center'>
                                <div>You had a final score of {playerScore}!</div>
                                <div>Your highest score is {maxScore}!</div>
                            </div>

                            <hr />

                            <div className='text-center'>
                                <div>Recent Scores:</div>
                                <div>
                                    {recentScores.length === 0 && <div>No recent scores found.</div>}
                                    {recentScores.length > 0 && recentScores.map((score, index) => (
                                        <div key={index}>
                                            {score.nickname}: {score.score}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    }

                </div>

                <div className="card-footer">

                    <Link href={"/"}>
                        <ArticlesButton
                            className="w-50"
                        >
                            <i className="fas fa-times me-2"></i>
                            Close
                        </ArticlesButton>
                    </Link>

                    <ArticlesButton
                        className="w-50"
                        onClick={() => {
                            startGame("In Lobby")
                        }}
                    >
                        <i className="fas fa-play me-2"></i>
                        Play Again
                    </ArticlesButton>

                </div>

            </div>

        </div>
    )

}