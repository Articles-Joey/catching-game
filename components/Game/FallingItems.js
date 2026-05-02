
import { useGameStore } from "@/hooks/useGameStore";
import { useSocketStore } from "@/hooks/useSocketStore";
import { useSphere } from "@react-three/cannon";
import { useSearchParams } from "next/navigation";
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

    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    const socket = useSocketStore(state => state.socket)

    const { type, pickedUp } = obj;
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
    const [sphereRef, api] = useSphere(() => ({
        mass: 1,
        linearDamping: 0.5,
        args: [1],
        // args: [1, 1, 6],
        position: [obj.x, 40, obj.z] || [0, 40, 0],
        userData: {
            isFallingItem: true,
            type
        },
        onCollide: (e) => {

            // console.log("Falling item collision detected with body:", e.body?.userData)

            // Detect collision with player
            if (e.body?.userData?.isPlayer) {

                if (despawned || pickedUp) return;

                console.log("Active falling item hit a player!")

                if (type === "Point") setScore(score + 1);

                if (type === "Penalty") setScore(score - 1);

                if (socket) {
                    socket.emit('game:catching-game:collision', {
                        server: server,
                        fallingItem_id: obj.id,
                        type: type,
                    })
                }

            }

            if (e.body?.userData?.isGround) {
                console.log("Falling item has hit the ground and will be despawned.")
                setDespawned(true);
            }

        },
    }));


    // Disable collider if despawned or pickedUp
    if (despawned || pickedUp) {
        if (api) {
            api.mass.set(0);
            api.position.set(0, -9999, 0); // Move far away
            api.collisionFilterMask.set(0); // Disable collisions
        }
        return null;
    }

    return (
        <mesh ref={sphereRef} castShadow>
            <sphereGeometry args={[0.5, 6, 6]} />
            <meshStandardMaterial attach="material" color={objTypeToColor(type)} />
        </mesh>
    );
}