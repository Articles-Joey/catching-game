
import { useGameStore } from "@/hooks/useGameStore";
import { useSphere } from "@react-three/cannon";
import { useRef, useState } from "react";

export default function FallingItems() {

    const fallingItems = useGameStore(state => state.gameState.fallingItems)

    return (
        <group>
            {fallingItems?.length > 0 && fallingItems.map((obj, index) => {

                return (
                    <FallingItem
                        key={obj.id}
                        obj={obj}
                    />
                )
            })}
        </group>
    )
}

function FallingItem({ obj }) {
    const { type } = obj;
    const setScore = useGameStore((state) => state.setScore);
    const score = useGameStore((state) => state.score);
    const ref = useRef();

    const [despawned, setDespawned] = useState(false);

    // Color by type
    function objTypeToColor(type) {
        switch (type) {
            case "Point":
                return "green";
            case "Penalty":
                return "red";
            case "PowerUp":
                return "blue";
            default:
                return "gray";
        }
    }

    // Physics sphere
    const [sphereRef] = useSphere(() => ({
        mass: 1,
        args: [1, 1, 6],
        position: [obj.x, 40, obj.z] || [0, 40, 0],
        userData: { 
            isFallingItem: true, 
            type 
        },
        onCollide: (e) => {

            // Detect collision with player
            if (e.body?.userData?.isPlayer) {

                if (despawned) return;
                
                if (type === "Point") setScore(score + 1);

            }

            if (e.body?.userData?.isGround) {
                setDespawned(true);
            }

        },
    }));

    return (
        <mesh ref={sphereRef} castShadow>
            <sphereGeometry args={[0.5, 6, 6]} />
            <meshStandardMaterial attach="material" color={objTypeToColor(type)} />
        </mesh>
    );
}