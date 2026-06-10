import useGameFunctions from "@/hooks/useGameFunctions"
import { useGameStore } from "@/hooks/useGameStore"

export default function UiOverlay() {

    const score = useGameStore((state) => state.score)
    const health = useGameStore((state) => state.health)
    // const timer = useGameStore((state) => state.timer)

    const gameState = useGameStore((state) => state.gameState)
    const timer = gameState.timer
    const status = gameState.status

    const {
        playerHealth,
        playerScore,
    } = useGameFunctions()

    return (
        <div className='game-ui-overlay'>

            <div className='score'>
                Timer: {timer || 0} - Score: {playerScore()}
            </div>

            <div>
                {[...Array(playerHealth())].map((_, index) =>
                    <img
                        key={index}
                        src={"/img/heart.png"}
                        width={30}
                    ></img>
                )}
            </div>

            {/* {status == "Game Over" && 
            
            } */}

        </div>
    )
}