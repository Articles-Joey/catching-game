import useGameHelpers from "@/hooks/useGameHelpers";
import { useGameStore } from "@/hooks/useGameStore";
import { useSocketStore } from "@/hooks/useSocketStore";
import { BallCollider, RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import FallingItemShadow from "./FallingItemShadow";
import Acorn from "@/components/Models/Acorn";
import Anvil from "@/components/Models/Anvil";

const itemColors = { Point: "green", Penalty: "red", PowerUp: "blue" };

export default function FallingItems() {
    const fallingItems = useGameStore((state) => state.gameState.fallingItems);

    return (
        <group>
            {fallingItems?.map((obj) => <FallingItem key={obj.id} obj={obj} />)}
        </group>
    );
}

function FallingItem({ obj }) {
    const server = useSearchParams().get("server");
    const socket = useSocketStore((state) => state.socket);
    const status = useGameStore((state) => state.gameState.status);
    const { increasePlayerScore } = useGameHelpers();
    const bodyRef = useRef();
    const despawnedRef = useRef(false);
    const [despawned, setDespawned] = useState(false);

    function despawn() {
        despawnedRef.current = true;
        setDespawned(true);
    }

    function handleIntersection({ other }) {
        if (despawnedRef.current || obj.pickedUp || useGameStore.getState().gameState.status !== "In Progress") return;
        const data = other.rigidBodyObject?.userData;

        if (data?.isPlayer) {
            // Mark immediately so multiple intersections cannot award the same item twice.
            despawn();
            if (obj.type === "Penalty" && !data.onPenaltyHit?.()) return;

            if (server) {
                socket?.emit("game:catching-game:collision", {
                    server,
                    fallingItem_id: obj.id,
                    type: obj.type,
                });
            } else {
                if (obj.type === "Point") increasePlayerScore(1);
            }
        } else if (data?.isGround) {
            despawn();
        }
    }

    useFrame(() => {
        const body = bodyRef.current;
        if (!body || despawnedRef.current) return;

        if (useGameStore.getState().gameState.status !== "In Progress") {
            if (body.linvel().y !== 0) body.setLinvel({ x: 0, y: 0, z: 0 }, true);
            return;
        }

        // Sensors fall through the ground; keep a height fallback for missed intersections.
        if (body.translation().y <= 0.5) despawn();
    });

    if (despawned || obj.pickedUp) return null;

    return (
        <group>
            <RigidBody
                ref={bodyRef}
                colliders={false}
                position={[obj.x ?? 0, 40, obj.z ?? 0]}
                gravityScale={status === "In Progress" ? (obj.type === "Penalty" ? 0.9 : 1) : 0}
                linearDamping={0.5}
                lockRotations
                ccd
                userData={{ isFallingItem: true, type: obj.type }}
                onIntersectionEnter={handleIntersection}
            >
                <BallCollider args={[1]} sensor />
                {obj.type === "Point" ? <Acorn /> : obj.type === "Penalty" ? <Anvil scale={0.7} /> : (
                    <mesh>
                        <sphereGeometry args={[0.5, 6, 6]} />
                        <meshStandardMaterial color={itemColors[obj.type] || "gray"} />
                    </mesh>
                )}
            </RigidBody>
            <FallingItemShadow bodyRef={bodyRef} />
        </group>
    );
}
