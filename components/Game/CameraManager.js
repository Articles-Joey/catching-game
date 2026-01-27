import { useFrame, useThree } from "@react-three/fiber";
import { useGameStore } from "@/hooks/useGameStore";
import { useEffect } from "react";
import * as THREE from "three";

export default function CameraManager() {

    const timer = useGameStore((state) => state?.timer);
    const { camera, size } = useThree();

    useEffect(() => {
        
        const aspect = size.width / size.height;

        // Base distance calculation
        // Board size approx 30.
        // We want to fit width 30 into the view.
        // VisibleWidth = 2 * dist * tan(FOV/2) * aspect (if FOV is vertical)
        // dist = 30 / (2 * tan(25deg) * aspect)
        // tan(25) ~ 0.466
        
        // Add some padding (e.g. 40 width)
        const targetWidth = 45; 
        const dist = targetWidth / (2 * Math.tan(THREE.MathUtils.degToRad(50 / 2)) * aspect);

        // Clamp or set distance
        // Standard Desktop dist is around 30.
        // On mobile (aspect 0.5), dist would be ~96.
        
        // Only apply if it's significantly different or on mobile to avoid overriding user interaction too aggressively?
        // But user asked for "Always fit".
        
        // We set the Z position. We keep Y relative or constant?
        // Let's keep the angle somewhat similar. 
        // Original: Y=10, Z=30. Ratio Z/Y = 3.
        
        // But simply moving Z is easiest.
        
        // Let's only enforce minimum distance for fit.
        if (camera.position.z < dist) {
             camera.position.z = Math.max(30, dist);
             camera.position.y = Math.max(10, dist / 3); // Adjust height to keep angle
             camera.lookAt(0,0,0);
        }

    }, [size, camera]);

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
