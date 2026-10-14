import { useEffect, useLayoutEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { MathUtils } from "three";
import { useStore } from "@/hooks/useStore";

export default function CameraManager({ landingAnimationMode = false }) {
    const debug = useStore((state) => state.debug);
    const controlsUnlocked = debug || process.env.NODE_ENV === "development";
    const { camera, size } = useThree();
    const controlsRef = useRef();
    const zoomRatioRef = useRef(1);
    const baseDistanceRef = useRef(1);
    const initializedRef = useRef(false);
    const aspect = Math.max(1, size.width) / Math.max(1, size.height);
    const halfFov = Math.tan(MathUtils.degToRad(camera.fov / 2));
    const baseDistance = Math.max(42, 45 / (2 * halfFov * aspect), 32 / (2 * halfFov));

    useLayoutEffect(() => {
        const controls = controlsRef.current;
        if (!controls) return;

        baseDistanceRef.current = baseDistance;
        // Restore the fixed game angle when controls lock, retaining the user's zoom.
        if (!initializedRef.current || (!controlsUnlocked && !landingAnimationMode)) {
            const distance = baseDistance * zoomRatioRef.current;
            camera.position.set(0, distance / Math.SQRT2, distance / Math.SQRT2);
            controls.target.set(0, 0, 0);
            camera.lookAt(controls.target);
        }
        controls.update();
        initializedRef.current = true;
    }, [baseDistance, camera, controlsUnlocked, landingAnimationMode]);

    useEffect(() => {
        if (landingAnimationMode) return;

        function resetCamera() {
            const controls = controlsRef.current;
            if (!controls) return;

            // Clear pending orbit/pan damping before restoring the starting view.
            const dampingEnabled = controls.enableDamping;
            controls.enableDamping = false;
            controls.update();

            const coordinate = baseDistanceRef.current / Math.SQRT2;
            controls.target0.set(0, 0, 0);
            controls.position0.set(0, coordinate, coordinate);
            controls.zoom0 = 1;
            zoomRatioRef.current = 1;
            controls.reset();
            controls.enableDamping = dampingEnabled;
        }

        useStore.setState({ resetCamera });
        return () => {
            if (useStore.getState().resetCamera === resetCamera) {
                useStore.setState({ resetCamera: null });
            }
        };
    }, [landingAnimationMode]);

    return (
        <OrbitControls
            key={controlsUnlocked ? "unlocked" : "locked"}
            ref={controlsRef}
            makeDefault
            enableZoom
            enablePan={controlsUnlocked}
            enableRotate={controlsUnlocked || landingAnimationMode}
            autoRotate={landingAnimationMode && !debug}
            enableDamping={controlsUnlocked || landingAnimationMode}
            minDistance={baseDistance * 0.35}
            maxDistance={baseDistance * 2.5}
            minPolarAngle={0.05}
            maxPolarAngle={Math.PI / 2 - 0.05}
            onChange={() => {
                const controls = controlsRef.current;
                if (controls) {
                    zoomRatioRef.current = MathUtils.clamp(controls.getDistance() / baseDistanceRef.current, 0.35, 2.5);
                }
            }}
        />
    );
}
