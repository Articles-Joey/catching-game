// import { create } from 'zustand'
import { createWithEqualityFn as create } from 'zustand/traditional'

export const useGameStore = create((set) => ({

    playerLocation: false,
    setPlayerLocation: (newValue) => {
        set((prev) => ({
            playerLocation: newValue
        }))
    },

    score: 0,
    setScore: (newValue) => {
        set((prev) => ({
            score: newValue
        }))
    },

    timer: 60,
    setTimer: (newValue) => {
        set((prev) => ({
            timer: newValue
        }))
    },

    health: 5,
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

    maxHeight: 0,
    setMaxHeight: (newValue) => {
        set((prev) => ({
            maxHeight: newValue
        }))
    },

    distance: 0,
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

    obstacles: [],
    setObstacles: (newValue) => {
        set((prev) => ({
            obstacles: newValue
        }))
    },

    shift: false,
    setShift: (newValue) => {
        set((prev) => ({
            shift: newValue
        }))
    },

    teleport: false,
    setTeleport: (newValue) => {
        set((prev) => ({
            teleport: newValue
        }))
    },

    targetLocation: null,
    setTargetLocation: (newValue) => {
        set((prev) => ({
            targetLocation: newValue
        }))
    },

    gameState: {},
    setGameState: (newValue) => {
        set((prev) => ({
            gameState: newValue
        }))
    },

}))