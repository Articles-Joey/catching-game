import { useFrame } from "@react-three/fiber";
import { useGameStore } from "@/hooks/useGameStore";
import * as THREE from "three";

export default function CameraManager() {

    const timer = useGameStore((state) => state?.timer);

    useFrame((state) => {
        
        if (timer < 40 && timer > 0) {
            const time = state.clock.getElapsedTime();
            state.camera.position.x = Math.sin(time) * 10;
            state.camera.position.y = 10;
            state.camera.position.z = 30;
            state.camera.lookAt(0, 0, 0);
        }

    });

    return null;

}
