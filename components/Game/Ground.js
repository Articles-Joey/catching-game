"use client";
import { usePlane } from "@react-three/cannon";
import { useGameStore } from "@/hooks/useGameStore";

import { NearestFilter, RepeatWrapping, TextureLoader, Vector3 } from "three";

export default function Ground({ args }) {

    const texture = new TextureLoader().load(`img/grass.webp`)

    const setTargetLocation = useGameStore((state) => state.setTargetLocation);

    const [ref, api] = usePlane(() => ({
        // mass: 0,
        type: 'Static',
        args: args,
        position: [0, 0, 0],
        rotation: [-Math.PI / 2, 0, 0]
    }))

    texture.magFilter = NearestFilter;
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.repeat.set(1, 1)

    return (
        <mesh 
            ref={ref} 
            castShadow 
            receiveShadow
            onClick={(e) => {
                e.stopPropagation();
                // setTargetLocation([e.point.x, e.point.y, e.point.z]);
                // Ensure we target the ground level basically, but preserve exact click
                setTargetLocation([e.point.x, 0.5, e.point.z]); 
                console.log("Clicked ground at", e.point);
            }}
        >

            <boxGeometry args={args} />

            {/* <meshStandardMaterial color="#08e8de" /> */}

            <meshStandardMaterial attach="material" map={texture} />

        </mesh>
    )

}