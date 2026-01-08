// import { create } from 'zustand'
import { createWithEqualityFn as create } from 'zustand/traditional'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useStore = create()(
  persist(
    (set, get) => ({

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

    debug: 0,
    setDebug: (newValue) => {
        set((prev) => ({
            debug: newValue
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

    }),
    {
      name: 'catching-game-store', // name of the item in the storage (must be unique)
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => ![
            // Exclude list of keys to not persist
            // 'infoModal',
            // 'settingsModal',
            // 'creditsModal',
            // 'showMenu'
          ].includes(key))
        ),
    },
  ),
)