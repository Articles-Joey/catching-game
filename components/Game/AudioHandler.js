"use client";

import { useStore } from "@/hooks/useStore";
import { useEffect } from "react";

export default function AudioHandler() {



    const audioSettings = useStore((state) => state?.audioSettings);
    const setAudioSettings = useStore((state) => state?.setAudioSettings);

    let music

    if (typeof window !== 'undefined') {
        music = new Audio(`/audio/Maze Game, Catching Game, Ring Game, and Toon Tag.mp3`);
        music.volume = audioSettings?.enabled ? (audioSettings?.game_volume / 100) : 0; // Set volume based on initial state
    }

    useEffect(() => {

        if (audioSettings?.enabled) {
            music.currentTime = 0;
            music.play();

            music.onended = function () {
                console.log('audio ended');
                music.currentTime = 0;
                music.play();
            };
        }

        return () => {
            music.pause();
        };
    }, [audioSettings]);

    return null;

}