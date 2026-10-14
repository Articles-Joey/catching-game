import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";

export default function YAxisBillboard({ children, ...props }) {
    const groupRef = useRef();
    const positions = useMemo(() => ({ camera: new Vector3(), billboard: new Vector3() }), []);

    useFrame(({ camera }) => {
        const group = groupRef.current;
        if (!group) return;

        camera.getWorldPosition(positions.camera);
        group.getWorldPosition(positions.billboard);
        const dx = positions.camera.x - positions.billboard.x;
        const dz = positions.camera.z - positions.billboard.z;
        if (dx * dx + dz * dz < 1e-8) return;

        // Face the camera through a full turn while keeping the billboard upright.
        group.lookAt(positions.camera.x, positions.billboard.y, positions.camera.z);
    }, -0.5);

    return <group {...props} ref={groupRef}>{children}</group>;
}
