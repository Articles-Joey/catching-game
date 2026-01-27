// import { create } from 'zustand'
import { subtract } from 'lodash'
import { createWithEqualityFn as create } from 'zustand/traditional'

export const useGameStore = create((set) => ({

    nickname: '',
    setNickname: (newValue) => {
        set((prev) => ({
            nickname: newValue
        }))
    },

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

    timer: 60,
    setTimer: (newValue) => {
        set((prev) => ({
            timer: newValue
        }))
    },

    debug: 0,
    setDebug: (newValue) => {
        set((prev) => ({
            debug: newValue
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