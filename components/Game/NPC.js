import { Suspense, useState, useRef } from "react";
import { BallCollider, RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { Model as SpacesuitModel } from "@/components/Models/Spacesuit";
import generateRandomInteger from "@/util/generateRandomInteger";
import { useGameStore } from "@/hooks/useGameStore";
import { useStore } from "@/hooks/useStore";
import ModelToonCharacter from "@/components/Models/ModelToonCharacter";

export default function NPC({ startPosition = [5, 1, 5] }) {
    const toontownMode = useStore((state) => state.toontownMode);

    const [action, setAction] = useState("Idle");
    const [rotation, setRotation] = useState([0, 0, 0]);

    const status = useGameStore(state => state.gameState.status)
    
    // NPC state
    const destinationRef = useRef(null);
    const waitRemainingRef = useRef(0);
    
    const bodyRef = useRef();

    const pickNewDestination = () => {
        const limit = 14.5;
        const x = (Math.random() * (limit * 2)) - limit;
        const z = (Math.random() * (limit * 2)) - limit;
        return new Vector3(x, 2, z);
    };

    useFrame((state, delta) => {
        const body = bodyRef.current;
        if (!body) return;
        const velocityY = body.linvel().y;
        if (status !== "In Progress") {
            body.setLinvel({ x: 0, y: velocityY, z: 0 }, true);
            if (action !== "Idle") {
                setAction("Idle");
            }
            return;
        }

        if (!destinationRef.current) {
            destinationRef.current = pickNewDestination();
        }

        if (waitRemainingRef.current > 0) {
            waitRemainingRef.current -= delta;
            body.setLinvel({ x: 0, y: velocityY, z: 0 }, true);
            if (waitRemainingRef.current <= 0) destinationRef.current = pickNewDestination();
            return;
        }

        const translation = body.translation();
        const currentPos = new Vector3(translation.x, translation.y, translation.z);
        const dest = destinationRef.current;
        
        // Ignore Y axis for distance check to simpler 2D movement logic
        const dist = Math.sqrt(Math.pow(dest.x - currentPos.x, 2) + Math.pow(dest.z - currentPos.z, 2));

        if (dist < 1) {
            // Arrived
            waitRemainingRef.current = generateRandomInteger(1000, 4000) / 1000;
            setAction("Idle");
            body.setLinvel({ x: 0, y: velocityY, z: 0 }, true);

        } else {
            // Move towards destination
            const direction = new Vector3()
                .set(dest.x - currentPos.x, 0, dest.z - currentPos.z)
                .normalize();
                
            const SPEED = 6;
            body.setLinvel({ x: direction.x * SPEED, y: velocityY, z: direction.z * SPEED }, true);
            
            // Calculate rotation to face direction
            const angle = Math.atan2(direction.x, direction.z);
            setRotation([0, angle, 0]);
            
            if (action !== "Walk") setAction("Walk");
        }
    });

    return (
        <RigidBody ref={bodyRef} colliders={false} position={startPosition} lockRotations linearDamping={0.5}>
            <BallCollider args={[1]} mass={2} />
            <Suspense fallback={null}>
                {toontownMode ? <ModelToonCharacter
                    action={action}
                    isWalking={action === "Walk"}
                    rotation={rotation}
                    position={[0, -1, 0]}
                /> : <SpacesuitModel
                    scale={2}
                    action={action}
                    rotation={rotation}
                    position={[0, -0.5, 0]}
                />}
            </Suspense>
            {/* Debug visual for destination */}
            {/* <mesh position={[destinationRef.current?.x || 0, 0.5, destinationRef.current?.z || 0]}>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color="green" />
            </mesh> */}
        </RigidBody>
    );
}
