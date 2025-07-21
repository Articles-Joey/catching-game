import { memo, useEffect, useRef } from "react";

import { useBox, useSphere } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";

import { Model as ModelKingMen } from "@/components/Models/King";
import { degToRad } from "three/src/math/MathUtils";
import { useGameStore } from "@/hooks/useGameStore";

function EnemyBase({ args, position, rotation }) {

    const debug = useGameStore.getState().debug

    const [ref, api] = useSphere(() => ({
        mass: 0,
        // type: 'Dynamic',
        isTrigger: true,
        args: args,
        position: position,
        rotation: rotation,
        userData: {
            isEnemy: true,
        },
        onCollide: (e) => {
            console.log("Enemy Collide")
        }
    }))

    const playerModelRef = useRef()

    useEffect(() => {

        api.position.subscribe((p) => {

            if (playerModelRef.current) {
                playerModelRef.current.position.set(...p);
            }

        })

    }, [api.position])

    const moveSpeed = 0.001; // Change this value to adjust speed
    const amplitude = 15; // Max distance on X-axis

    // Oscillating position logic
    useFrame(() => {
        const time = performance.now();
        const oscillation = Math.sin(time * moveSpeed) * amplitude;
        api.position.set(oscillation, position[1], position[2]);
    });

    return (
        <group>

            <group ref={playerModelRef}>
                <ModelKingMen
                    scale={2}
                    action={"Walk"}
                    rotation={[0, degToRad(90), 0]}
                />
            </group>

            <mesh ref={ref} castShadow>
                {debug && <>
                    <sphereGeometry args={args} />
                    <meshStandardMaterial color="red" />
                </>}
            </mesh>
        </group>
    )

}

export const Enemy = memo(EnemyBase)