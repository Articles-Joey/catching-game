import { memo } from "react";

import { useSphere } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";

import { Model as ModelKingMen } from "@/components/Models/King";
import { degToRad } from "three/src/math/MathUtils";
import { useGameStore } from "@/hooks/useGameStore";

function EnemyBase({ args, position, rotation }) {

    const debug = useGameStore((state) => state.debug);

    const [ref, api] = useSphere(() => ({
        mass: 0,
        type: 'Kinematic',
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

    const moveSpeed = 1.5; // Adjusted for seconds
    const amplitude = 15; // Max distance on X-axis

    // Oscillating position logic
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const oscillation = Math.sin(time * moveSpeed) * amplitude;
        api.position.set(oscillation, position[1], position[2]);
    });

    return (
        <group ref={ref}>
            <ModelKingMen
                scale={2}
                action={"Walk"}
                rotation={[0, degToRad(90), 0]}
            />

            {debug && (
                <mesh castShadow>
                    <sphereGeometry args={args} />
                    <meshStandardMaterial color="red" wireframe={true} opacity={0.5} transparent />
                </mesh>
            )}
        </group>
    )

}

export const Enemy = memo(EnemyBase)