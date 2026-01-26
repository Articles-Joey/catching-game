import { useGameStore } from "@/hooks/useGameStore"
import ArticlesButton from "./Button"

export default function DebugCard({
    reloadScene
}) {

    const score = useGameStore((state) => state.score)
    const playerLocation = useGameStore((state) => state.playerLocation)

    return (
        <div
            className="card card-articles card-sm"
        >
            <div className="card-body">

                <div className="small text-muted">Debug Controls</div>

                <div className="small border p-2">
                    <div>Score: {score}</div>
                    <div>
                        <span>Position: </span>
                        <span>
                            {playerLocation[0]?.toFixed(2)}
                            <span> - </span>
                            {playerLocation[1]?.toFixed(2)}
                            <span> - </span>
                            {playerLocation[2]?.toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className='d-flex flex-column'>

                    <div>
                        <ArticlesButton
                            size="sm"
                            className="w-50"
                            onClick={reloadScene}
                        >
                            <i className="fad fa-redo"></i>
                            Reload Game
                        </ArticlesButton>

                        <ArticlesButton
                            size="sm"
                            className="w-50"
                            onClick={reloadScene}
                        >
                            <i className="fad fa-redo"></i>
                            Reset Camera
                        </ArticlesButton>
                    </div>

                </div>

            </div>
        </div>
    )

}