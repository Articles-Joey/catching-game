import { memo, useEffect, useRef, useState } from "react";

import { BallCollider, RigidBody, useBeforePhysicsStep } from "@react-three/rapier";
import { Euler, MathUtils, Quaternion, Vector3 } from "three";

import { Model as ModelKingMen } from "@/components/Models/King";
import { degToRad } from "three/src/math/MathUtils";
import { useGameStore } from "@/hooks/useGameStore";
import generateRandomInteger from "@/util/generateRandomInteger";
import { useStore } from "@/hooks/useStore";
import { ModelCogFixed } from "../Models/CogFixed";

function generateEnemySpawn() {
    const playerLocation = useGameStore.getState().playerLocation;
    const edge = 14;

    for (let attempt = 0; attempt < 8; attempt++) {
        const side = generateRandomInteger(0, 3);
        const alongEdge = (Math.random() * edge * 2) - edge;
        const x = side < 2 ? (side === 0 ? -edge : edge) : alongEdge;
        const z = side < 2 ? alongEdge : (side === 2 ? -edge : edge);

        if (!playerLocation || Math.hypot(x - playerLocation.x, z - playerLocation.z) >= 4) {
            return [x, 1.2, z];
        }
    }

    return [playerLocation.x >= 0 ? -edge : edge, 1.2, playerLocation.z >= 0 ? -edge : edge];
}

function EnemyBase({ args, position, rotation }) {

    const debug = useStore((state) => state.debug);
    const toontownMode = useStore((state) => state.toontownMode);

    const bodyRef = useRef();
    const facingRef = useRef(new Quaternion());
    const eulerRef = useRef(new Euler());

    const moveSpeed = 8; // Adjusted for linear movement
    const amplitude = 15; // Max distance on X-axis

    const [spawnPosition] = useState(() => position ?? generateEnemySpawn());
    const positionRef = useRef(new Vector3(...spawnPosition));
    const targetRef = useRef(null);
    const initialZRef = useRef(spawnPosition[2]);

    useEffect(() => useGameStore.subscribe((state, previousState) => {
        if (state.gameState.status !== "In Progress" || previousState.gameState.status === "In Progress") return;

        const nextSpawn = position ?? generateEnemySpawn();
        positionRef.current.set(...nextSpawn);
        initialZRef.current = nextSpawn[2];
        targetRef.current = null;
        bodyRef.current?.setTranslation(positionRef.current, true);
        bodyRef.current?.setNextKinematicTranslation(positionRef.current);
    }), [position]);

    // Linear movement logic
    useBeforePhysicsStep((world) => {
        const body = bodyRef.current;
        if (!body) return;

        const status = useGameStore.getState().gameState.status;
        if (status !== "In Progress") {
            body.setNextKinematicTranslation(positionRef.current);
            return;
        }

        // Initialize or validate target
        if (!targetRef.current) {
            // Pick a side opposite to current position
            // If roughly at 0, default to right.
            const targetX = positionRef.current.x > 0 ? -amplitude : amplitude;
            const targetZ = MathUtils.clamp(initialZRef.current + generateRandomInteger(-10, 10), -amplitude, amplitude);
            targetRef.current = new Vector3(targetX, positionRef.current.y, targetZ);
        }

        const direction = new Vector3().subVectors(targetRef.current, positionRef.current);
        const distance = direction.length();

        // Check if reached target (threshold)
        if (distance < 0.2) {
            // Set new target on the OTHER side
            // If we just arrived at X = 15, current is 15, target should be -15.
            const targetX = targetRef.current.x > 0 ? -amplitude : amplitude;
            const targetZ = MathUtils.clamp(initialZRef.current + generateRandomInteger(-10, 10), -amplitude, amplitude);

            targetRef.current.set(targetX, positionRef.current.y, targetZ);
        } else {
            // Move towards target
            direction.normalize()

            const angle = Math.atan2(direction.x, direction.z);
            facingRef.current.setFromEuler(eulerRef.current.set(0, angle - Math.PI / 2, 0));
            body.setNextKinematicRotation(facingRef.current);

            direction.multiplyScalar(Math.min(distance, moveSpeed * world.timestep));
            positionRef.current.add(direction);
            body.setNextKinematicTranslation(positionRef.current);
        }
    });

    return (
        <RigidBody
            ref={bodyRef}
            type="kinematicPosition"
            colliders={false}
            position={spawnPosition}
            rotation={rotation}
            userData={{ isEnemy: true }}
        >
            <BallCollider args={[args[0]]} sensor />

            {toontownMode ?
                <ModelCogFixed
                    scale={1}
                    action={"suitC|walk"}
                    rotation={[0, degToRad(90), 0]}
                    position={[0, -0.5, 0]}
                />
                :
                <ModelKingMen
                    scale={2}
                    action={"Walk"}
                    rotation={[0, degToRad(90), 0]}
                    position={[0, -0.5, 0]}
                />
            }

            {debug && (
                <mesh>
                    <sphereGeometry args={args} />
                    <meshStandardMaterial color="red" wireframe={true} opacity={0.5} transparent />
                </mesh>
            )}
        </RigidBody>
    )

}

export const Enemy = memo(EnemyBase)
