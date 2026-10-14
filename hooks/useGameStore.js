// import { create } from 'zustand'
import { createWithEqualityFn as create } from 'zustand/traditional'

export const GAME_DURATION_SECONDS = 60;

const initialGameState = () => ({
    sessionActive: false,
    playerLocation: false,
    score: 0,
    timer: GAME_DURATION_SECONDS,
    health: 5,
    maxHeight: 0,
    distance: 0,
    obstacles: [],
    shift: false,
    teleport: false,
    targetLocation: null,
    gameState: {},
});

export const useGameStore = create((set) => ({

    ...initialGameState(),
    beginGameSession: () => set({ ...initialGameState(), sessionActive: true }),
    resetGame: () => set(initialGameState()),

    setPlayerLocation: (newValue) => {
        set((prev) => ({
            playerLocation: newValue
        }))
    },

    setScore: (newValue) => {
        set((prev) => ({
            score: newValue
        }))
    },

    setTimer: (newValue) => {
        set((prev) => ({
            timer: newValue
        }))
    },

    subtractHealth: (amount) => {
        set((prev) => ({
            health: Math.max(0, prev.health - amount)
        }))
    },
    setHealth: (newValue) => {
        set((prev) => ({
            health: newValue
        }))
    },

    setMaxHeight: (newValue) => {
        set((prev) => ({
            maxHeight: newValue
        }))
    },

    setDistance: (newValue) => {
        set((prev) => ({
            distance: newValue
        }))
    },
    addDistance: (newValue) => {
        set((prev) => ({
            distance: (prev.distance + newValue)
        }))
    },

    setObstacles: (newValue) => {
        set((prev) => ({
            obstacles: newValue
        }))
    },

    setShift: (newValue) => {
        set((prev) => ({
            shift: newValue
        }))
    },

    setTeleport: (newValue) => {
        set((prev) => ({
            teleport: newValue
        }))
    },

    setTargetLocation: (newValue) => {
        set((prev) => ({
            targetLocation: newValue
        }))
    },

    setGameState: (newValue) => {
        // Ignore late socket updates after leaving the game.
        set((prev) => {
            if (!prev.sessionActive) return {};

            const localPlayer = newValue.players?.find((player) => player.id === "local");
            const playerDied = newValue.status === "In Progress" && localPlayer?.health <= 0;
            const gameState = playerDied ? { ...newValue, status: "Game Over", timer: 0 } : newValue;
            const previousEndedAt = prev.gameState.status === "Game Over" ? prev.gameState.endedAt : null;

            return {
                gameState: {
                    ...gameState,
                    endedAt: gameState.status === "Game Over"
                        ? previousEndedAt ?? gameState.endedAt ?? new Date().toISOString()
                        : null,
                },
            };
        })
    },

}))
