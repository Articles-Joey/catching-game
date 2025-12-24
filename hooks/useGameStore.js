// import { create } from 'zustand'
import { createWithEqualityFn as create } from 'zustand/traditional'

export const useGameStore = create((set) => ({

    darkMode: false,
    toggleDarkMode: () => {
        set((prev) => ({
            darkMode: !prev.darkMode
        }))
    },
    setDarkMode: (newValue) => {
        set((prev) => ({
            darkMode: newValue
        }))
    },

    showSettingsModal: false,
    setShowSettingsModal: (newValue) => {
        set((prev) => ({
            showSettingsModal: newValue
        }))
    },

    showInfoModal: false,
    setShowInfoModal: (newValue) => {
        set((prev) => ({
            showInfoModal: newValue
        }))
    },

    showCreditsModal: false,
    setShowCreditsModal: (newValue) => {
        set((prev) => ({
            showCreditsModal: newValue
        }))
    },

    cameraMode: 'Player',
    setCameraMode: (newValue) => {
        set((prev) => ({
            cameraMode: newValue
        }))
    },

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

    debug: 0,
    setDebug: (newValue) => {
        set((prev) => ({
            debug: newValue
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

    touchControls: {
        jump: false,
        left: false,
        right: false
    },
    setTouchControls: (newValue) => {
        set((prev) => ({
            touchControls: newValue
        }))
    },

    teleport: false,
    setTeleport: (newValue) => {
        set((prev) => ({
            teleport: newValue
        }))
    },

    gameState: {},
    setGameState: (newValue) => {
        set((prev) => ({
            gameState: newValue
        }))
    },

}))