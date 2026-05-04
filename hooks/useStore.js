// import { create } from 'zustand'
import { createWithEqualityFn as create } from 'zustand/traditional'
import { persist, createJSONStorage } from 'zustand/middleware'

import typicalZustandStoreExcludes from '@articles-media/articles-dev-box/typicalZustandStoreExcludes';
import typicalZustandStoreStateSlice from '@articles-media/articles-dev-box/typicalZustandStoreStateSlice';

import generateRandomNickname from '@/util/generateRandomNickname';

export const useStore = create()(
    persist(
        (set, get) => ({

            ...typicalZustandStoreStateSlice(set, get, generateRandomNickname),

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

            // friendsModal: false,
            // setFriendsModal: (newValue) => {
            //     set((prev) => ({
            //         friendsModal: newValue
            //     }))
            // },

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

            // Fixed or Orbit
            cameraMode: 'Fixed',
            setCameraMode: (newValue) => {
                set((prev) => ({
                    cameraMode: newValue
                }))
            },

        }),
        {
            name: 'catching-game-store', // name of the item in the storage (must be unique)
            version: 1,
            onRehydrateStorage: (state) => {
                return () => state.setHasHydrated(true)
            },
            partialize: (state) =>
                Object.fromEntries(
                    Object.entries(state).filter(([key]) => ![
                        ...typicalZustandStoreExcludes,
                        'friendsModal',
                    ].includes(key))
                ),
        },
    ),
)