import { memo, useRef } from "react";

import { useSphere } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";

import { Model as ModelKingMen } from "@/components/Models/King";
import { degToRad } from "three/src/math/MathUtils";
import { useGameStore } from "@/hooks/useGameStore";
import generateRandomInteger from "@/util/generateRandomInteger";

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

    const moveSpeed = 8; // Adjusted for linear movement
    const amplitude = 15; // Max distance on X-axis
    
    const positionRef = useRef(new Vector3(position[0], position[1], position[2]));
    const targetRef = useRef(null);
    const initialZ = position[2]; // Remember starting Z lane

    // Linear movement logic
    useFrame((state, delta) => {
        
        // Initialize or validate target
        if (!targetRef.current) {
            // Pick a side opposite to current position
            // If roughly at 0, default to right.
            const targetX = positionRef.current.x > 0 ? -amplitude : amplitude;
            const targetZ = initialZ + generateRandomInteger(-10, 10);
            targetRef.current = new Vector3(targetX, position[1], targetZ);
        }

        const direction = new Vector3().subVectors(targetRef.current, positionRef.current);
        const distance = direction.length();
        
        // Check if reached target (threshold)
        if (distance < 0.2) {
            // Set new target on the OTHER side
            // If we just arrived at X = 15, current is 15, target should be -15.
            const targetX = targetRef.current.x > 0 ? -amplitude : amplitude;
            const targetZ = initialZ + generateRandomInteger(-10, 10);
            
            targetRef.current.set(targetX, position[1], targetZ);
        } else {
            // Move towards target
            direction.normalize().multiplyScalar(moveSpeed * delta);
            positionRef.current.add(direction);
            api.position.set(positionRef.current.x, positionRef.current.y, positionRef.current.z);
        }
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