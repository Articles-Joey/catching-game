import { useState, useRef, useEffect } from "react";
import { useSphere } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { Vector3, Quaternion, Matrix4 } from "three";
import { Model as SpacesuitModel } from "@/components/Models/Spacesuit";
import generateRandomInteger from "@/util/generateRandomInteger";

export default function NPC({ startPosition = [5, 1, 5] }) {

    const [action, setAction] = useState("Idle");
    const [rotation, setRotation] = useState([0, 0, 0]);
    
    // NPC state
    const destinationRef = useRef(null);
    const isWaitingRef = useRef(false);
    
    const [ref, api] = useSphere(() => ({
        mass: 2, // Slightly heavier to give a stable bump
        args: [1],
        position: startPosition,
        fixedRotation: true, // Prevent rolling
        linearDamping: 0.5, // Stop quickly when force is removed
        onCollide: (e) => {
            // console.log("NPC Collide", e.body.name)
        }
    }));

    const pos = useRef([0, 0, 0]);
    useEffect(() => {
        const unsubscribe = api.position.subscribe((v) => pos.current = v);
        return () => unsubscribe();
    }, [api.position]);

    const pickNewDestination = () => {
        const limit = 14.5;
        const x = (Math.random() * (limit * 2)) - limit;
        const z = (Math.random() * (limit * 2)) - limit;
        return new Vector3(x, 2, z);
    };

    useFrame((state, delta) => {
        if (!destinationRef.current) {
            destinationRef.current = pickNewDestination();
        }

        if (isWaitingRef.current) {
             api.velocity.set(0, 0, 0);
             return;
        }

        const currentPos = new Vector3(pos.current[0], pos.current[1], pos.current[2]);
        const dest = destinationRef.current;
        
        // Ignore Y axis for distance check to simpler 2D movement logic
        const dist = Math.sqrt(Math.pow(dest.x - currentPos.x, 2) + Math.pow(dest.z - currentPos.z, 2));

        if (dist < 1) {
            // Arrived
            isWaitingRef.current = true;
            setAction("Idle");
            api.velocity.set(0, 0, 0);

            const waitTime = generateRandomInteger(1000, 4000);
            
            setTimeout(() => {
                destinationRef.current = pickNewDestination();
                isWaitingRef.current = false;
                setAction("Walk");
            }, waitTime);

        } else {
            // Move towards destination
            const direction = new Vector3()
                .subVectors(dest, currentPos)
                .normalize();
                
            const SPEED = 6;
            api.velocity.set(direction.x * SPEED, 0, direction.z * SPEED);
            
            // Calculate rotation to face direction
            const angle = Math.atan2(direction.x, direction.z);
            setRotation([0, angle, 0]);
            
            if (action !== "Walk") setAction("Walk");
        }
    });

    return (
        <group ref={ref}>
             <SpacesuitModel
                scale={2}
                action={action}
                rotation={rotation} 
                position={[0, -0.5, 0]}
            />
            {/* Debug visual for destination */}
            {/* <mesh position={[destinationRef.current?.x || 0, 0.5, destinationRef.current?.z || 0]}>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color="green" />
            </mesh> */}
        </group>
    );
}
