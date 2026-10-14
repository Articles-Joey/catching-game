import { memo } from "react";
import { RoundedBoxGeometry } from "@react-three/drei";
import { Addition, Base, Geometry, Subtraction } from "@react-three/csg";

function Anvil(props) {
    return (
        <group {...props}>
            <mesh>
                <meshStandardMaterial color="#566170" metalness={0.65} roughness={0.4} flatShading />
                <Geometry>
                    <Base position={[0, -0.04, 0]}>
                        <boxGeometry args={[1.05, 0.85, 0.72]} />
                    </Base>
                    {/* Carve the waist before adding the broad foot and striking face. */}
                    <Subtraction position={[-0.72, -0.1, 0]} scale={[1, 1, 1.5]}>
                        <sphereGeometry args={[0.52, 20, 12]} />
                    </Subtraction>
                    <Subtraction position={[0.72, -0.1, 0]} scale={[1, 1, 1.5]}>
                        <sphereGeometry args={[0.52, 20, 12]} />
                    </Subtraction>
                    <Addition position={[0, -0.48, 0]}>
                        <RoundedBoxGeometry args={[1.5, 0.22, 0.95]} radius={0.04} smoothness={2} bevelSegments={2} />
                    </Addition>
                    <Addition position={[0, 0.42, 0]}>
                        <RoundedBoxGeometry args={[1.6, 0.28, 0.84]} radius={0.04} smoothness={2} bevelSegments={2} />
                    </Addition>
                    <Addition position={[-0.99, 0.42, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.7, 1, 1]}>
                        <coneGeometry args={[0.32, 1, 20]} />
                    </Addition>
                    <Subtraction position={[-1.12, 0.96, 0]}>
                        <boxGeometry args={[1.1, 0.8, 1]} />
                    </Subtraction>
                    {/* The square hardy hole helps distinguish the flat heel from the horn. */}
                    <Subtraction position={[0.5, 0.44, 0.1]}>
                        <boxGeometry args={[0.13, 0.4, 0.13]} />
                    </Subtraction>
                </Geometry>
            </mesh>
        </group>
    );
}

export default memo(Anvil);
