"use client";

import { useAudioStore } from "@/hooks/useAudioStore";
import { useStore } from "@/hooks/useStore";
import { useEffect, useRef } from "react";

export default function AudioHandler() {

    const audioSettings = useAudioStore((state) => state?.audioSettings);
    const setAudioSettings = useAudioStore((state) => state?.setAudioSettings);

    const musicRef = useRef(null);
    const interactedRef = useRef(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const music = new Audio(`/audio/Maze Game, Catching Game, Ring Game, and Toon Tag.mp3`);
        music.volume = audioSettings?.enabled ? (audioSettings?.game_volume / 100) : 0;
        musicRef.current = music;

        music.onended = function () {
            music.currentTime = 0;
            music.play();
        };

        const tryPlay = () => {
            if (!interactedRef.current && audioSettings?.enabled) {
                interactedRef.current = true;
                music.currentTime = 0;
                music.play();
            }
        };

        if (audioSettings?.enabled) {
            if (interactedRef.current) {
                music.currentTime = 0;
                music.play();
            } else {
                const events = ['click', 'keydown', 'touchstart', 'pointerdown'];
                events.forEach((e) => document.addEventListener(e, tryPlay, { once: true }));

                return () => {
                    events.forEach((e) => document.removeEventListener(e, tryPlay));
                    music.pause();
                };
            }
        }

        return () => {
            music.pause();
        };
    }, [audioSettings]);

    return null;

}