import { useGameStore } from "@/hooks/useGameStore"
import ArticlesButton from "./Button"
import { useSearchParams } from "next/navigation"
import { useSocketStore } from "@/hooks/useSocketStore"
// import { useIceSlideStore } from "@/hooks/useIceSlideStore"

export default function GameDetailsPanel() {

    const players = useGameStore(state => state.gameState.players)
    const fallingItems = useGameStore(state => state.gameState.fallingItems)

    return (
        <div className="card game-details-panel">

            <div className="card-body">

                <div className="h6 mb-2 d-flex justify-content-between">
                    <RoundAndTimer />
                </div>

                <div>Players</div>

                {players?.length > 0 && players.map((player, index) => (
                    <div key={index} className="player-entry border p-2">

                        {/* <div className="player-color" style={{ backgroundColor: player.color }}></div> */}

                        <div className="" style={{ fontSize: "0.6rem" }}>ID: {player.id}</div>

                        <div className="player-name d-flex align-items-center">
                            <span
                                className={`badge ${player.ready ? 'bg-success' : 'bg-danger'} me-1`}
                                style={{
                                    fontSize: "0.6rem"
                                }}
                            >
                                {player.ready ? "Ready" : "Not Ready"}
                            </span>
                            {player.nickname || "?"}
                        </div>

                        {/* <div className="player-name">Ready: {player.ready ? "Yes" : "No"}</div> */}

                        <div className="d-flex justify-content-between">

                            <div>X: {player?.x?.toFixed(2) || 0} | Z: {player?.z?.toFixed(2) || 0}</div>

                            <div className="d-flex">
                                <div className="me-2">
                                    <i className="fad fa-rocket"></i>
                                    {player.hitPower}
                                </div>
                                <div>
                                    <i className="fad fa-undo"></i>
                                    {player.hitRotation}
                                </div>
                            </div>

                        </div>

                    </div>
                ))}

                <div>Falling Items</div>

                {fallingItems?.length > 0 && fallingItems.map((obj, index) => (
                    <div key={obj.id} className="player-entry border p-2">

                        <div className="" style={{ fontSize: "0.6rem" }}>ID: {obj.id}</div>

                        <div className="d-flex justify-content-between">

                            <div>X: {obj?.x?.toFixed(2) || 0} | Z: {obj?.z?.toFixed(2) || 0}</div>

                        </div>

                    </div>
                ))}

            </div>

        </div>
    )
}

function RoundAndTimer() {

    const timer = useGameStore(state => state.gameState.timer)
    const status = useGameStore(state => state.gameState.status)

    const startGame = useSocketStore(state => state.startGame)

    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    return (
        <div className="w-100">

            <div className="d-flex align-items-center w-100 justify-content-between">
                {/* <div>Round: {gameState?.round || 0}</div> */}
                <div>Time: {timer || 0}</div>
                <div>Status: {status || "N/A"}</div>
            </div>

            <ArticlesButton
                small
                className="w-100 mt-1"
                onClick={() => {
                    startGame(server)
                }}
            >
                Start Game
            </ArticlesButton>

        </div>
    )
}