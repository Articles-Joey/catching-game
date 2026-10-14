import { Suspense } from "react";
import { Billboard, Text } from "@react-three/drei";

export default function CharacterNickname({ nickname, ...props }) {
    if (!nickname) return null;

    return (
        <Billboard {...props} lockY lockZ>
            <Suspense fallback={null}>
                <Text
                    fontSize={0.55}
                    color="#fffbe2"
                    anchorX="center"
                    anchorY="bottom"
                    textAlign="center"
                    maxWidth={6}
                    outlineWidth={0.035}
                    outlineColor="#302418"
                    material-toneMapped={false}
                    material-depthWrite={false}
                    raycast={() => null}
                >
                    {nickname}
                </Text>
            </Suspense>
        </Billboard>
    );
}
