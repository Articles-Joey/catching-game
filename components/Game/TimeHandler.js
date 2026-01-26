import { useGameStore } from "@/hooks/useGameStore";
import { useEffect } from "react";

export default function TimeHandler() {
    const timer = useGameStore((state) => state?.timer);
    const setTimer = useGameStore((state) => state?.setTimer);

    useEffect(() => {
        if (timer <= 0) {
            return;
        }
        const interval = setInterval(() => {
            setTimer(timer - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer, setTimer]);

    return null;
}