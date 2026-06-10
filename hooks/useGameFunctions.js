import { useSearchParams } from "next/navigation";
import { useSocketStore } from "./useSocketStore"
import { useGameStore } from "./useGameStore";

export default function useGameFunctions() {

    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    const socket = useSocketStore(state => state.socket)
    const socketStartGame = useSocketStore(state => state.startGame)

    const gameState = useGameStore(state => state.gameState)
    const setGameState = useGameStore(state => state.setGameState)

    function startGame(server, status) {

        if (server) {
            socketStartGame(server, status);
        } else {

            console.log("Starting local game with status:", status, server)

            const gameState = useGameStore.getState().gameState;
            setGameState({
                ...gameState,
                status: status || 'In Progress',
                timer: 0,
            })
        }

    }

    function playerScore() {

        if (server) {
            return 0
        } else {
            return gameState?.players?.[0]?.score || 0
        }

        return 420
    }

    function playerHealth() {

        if (server) {
            return 0
        } else {
            return gameState?.players?.[0]?.health || 0
        }

        return 420
    }

    function addScore(amount) {
        if (!server) {
            const gameState = useGameStore.getState().gameState;
            const currentScore = gameState?.players?.[0]?.score || 0
            setGameState({
                ...gameState,
                players: [{
                    ...gameState.players[0],
                    score: currentScore + amount,
                }]
            })
        } else {
            // In multiplayer mode, score is managed by the server, so we might want to emit an event here
            socket.emit('add-score', amount);
        }
    }

    function subtractScore(amount) {    
        if (!server) {
            const gameState = useGameStore.getState().gameState;
            const currentScore = gameState?.players?.[0]?.score || 0
            setGameState({
                ...gameState,
                players: [{
                    ...gameState.players[0],
                    score: Math.max(0, currentScore - amount),
                }]
            })
        } else {
            // In multiplayer mode, score is managed by the server, so we might want to emit an event here
            socket.emit('subtract-score', amount);
        }
    }

    function subtractHealth(amount) {
        if (!server) {
            const gameState = useGameStore.getState().gameState;
            const currentHealth = gameState?.players?.[0]?.health || 0
            setGameState({
                ...gameState,
                players: [{
                    ...gameState.players[0],
                    health: Math.max(0, currentHealth - amount),
                }]
            })
        } else {
            // In multiplayer mode, health is managed by the server, so we might want to emit an event here
            socket.emit('subtract-health', amount);
        }
    }

    return {
        startGame,
        playerScore,
        playerHealth,
        addScore,
        subtractScore,
        subtractHealth,
    }
}