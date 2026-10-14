import { Suspense } from "react";
import { useGameStore } from "@/hooks/useGameStore";
import { useSocketStore } from "@/hooks/useSocketStore";
import { useStore } from "@/hooks/useStore";
import { Model as SpacesuitModel } from "@/components/Models/Spacesuit";
import ModelToonCharacter from "@/components/Models/ModelToonCharacter";
import CharacterNickname from "./CharacterNickname";

export default function SocketPlayers() {
    const players = useGameStore((state) => state.gameState.players);
    const socket = useSocketStore((state) => state.socket);
    const toontownMode = useStore((state) => state.toontownMode);

    return (
        <group>
            {players?.map((player) => {
                if (player.id === "local" || (socket?.id && (player.id === socket.id || player.socketId === socket.id))) return null;
                const action = player.action || "Idle";
                const rotation = player.rotation || [0, 0, 0];
                const position = [
                    player.position?.x ?? player.x ?? 0,
                    player.position?.y ?? 1,
                    player.position?.z ?? player.z ?? 0,
                ];

                return (
                    <group key={player.id || player.socketId} position={position}>
                        <CharacterNickname nickname={player.nickname} position={[0, 2.8, 0]} />
                        <Suspense fallback={null}>
                            {toontownMode ? <ModelToonCharacter
                                action={action}
                                isWalking={action === "Walk"}
                                isSprinting={action === "Run"}
                                rotation={rotation}
                                position={[0, -1, 0]}
                            /> : <SpacesuitModel
                                scale={2}
                                action={action}
                                rotation={rotation}
                                position={[0, -0.5, 0]}
                            />}
                        </Suspense>
                    </group>
                );
            })}
        </group>
    );
}
