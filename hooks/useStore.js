// import { create } from 'zustand'
import { createWithEqualityFn as create } from 'zustand/traditional'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useStore = create()(
    persist(
        (set, get) => ({

            _hasHydrated: false,
            setHasHydrated: (state) => {
                set({
                    _hasHydrated: state
                });
            },

            nickname: '',
            setNickname: (newValue) => {
                set((prev) => ({
                    nickname: newValue
                }))
            },
            nicknameKeyboard: false,
            setNicknameKeyboard: (newValue) => {
                set((prev) => ({
                    nicknameKeyboard: newValue
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

            showSidebar: true,
            setShowSidebar: (newValue) => {
                set((prev) => ({
                    showSidebar: newValue
                }))
            },
            toggleShowSidebar: () => {
                set((prev) => ({
                    showSidebar: !prev.showSidebar
                }))
            },

            touchControls: {
                jump: false,
                left: false,
                right: false,
                up: false,
                down: false,
            },
            setTouchControls: (newValue) => {
                set((prev) => ({
                    touchControls: newValue
                }))
            },
            touchControlsEnabled: false,
            toggleTouchControlsEnabled: () => {
                set((prev) => ({
                    touchControlsEnabled: !prev.touchControlsEnabled
                }))
            },
            setTouchControlsEnabled: (newValue) => {
                set((prev) => ({
                    touchControlsEnabled: newValue
                }))
            },

            graphicsQuality: 'High',
            setGraphicsQuality: (newValue) => {
                set((prev) => ({
                    graphicsQuality: newValue
                }))
            },

            friendsModal: false,
            setFriendsModal: (newValue) => {
                set((prev) => ({
                    friendsModal: newValue
                }))
            },

            audioSettings: {
                enabled: true,
                game_volume: 50,
                music_volume: 50,
                sfx_volume: 50
            },
            setAudioSettings: (newValue) => {
                set((prev) => ({
                    audioSettings: newValue
                }))
            },

        }),
        {
            name: 'catching-game-store', // name of the item in the storage (must be unique)
            onRehydrateStorage: (state) => {
                return () => state.setHasHydrated(true)
            },
            // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
            partialize: (state) =>
                Object.fromEntries(
                    Object.entries(state).filter(([key]) => ![
                        'friendsModal',
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