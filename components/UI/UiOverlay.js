import { useGameStore } from "@/hooks/useGameStore"

export default function UiOverlay() {

    const score = useGameStore((state) => state.score)
    const health = useGameStore((state) => state.health)
    // const timer = useGameStore((state) => state.timer)

    const timer = useGameStore((state) => state.gameState.timer)

    return (
        <div className='game-ui-overlay'>

            <div className='score'>
                Timer: {timer || 0} - Score: {score}
            </div>

            <div>
                {[...Array(health)].map((_, index) =>
                    <img
                        key={index}
                        src={"/img/heart.png"}
                        width={30}
                    ></img>
                )}
            </div>

        </div>
    )
}