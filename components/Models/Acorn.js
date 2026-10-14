import { memo } from "react";
import { Cylinder, Lathe, Torus } from "@react-three/drei";
import { Vector2 } from "three";

const nutProfile = [
    [0, -0.64],
    [0.08, -0.58],
    [0.2, -0.48],
    [0.34, -0.3],
    [0.43, -0.08],
    [0.45, 0.12],
    [0.4, 0.24],
    [0, 0.24],
].map(([radius, height]) => new Vector2(radius, height));

function Acorn(props) {
    return (
        <group {...props}>
            <Lathe args={[nutProfile, 24]}>
                <meshStandardMaterial color="#ce8b3c" roughness={0.72} />
            </Lathe>
            <mesh position={[0, 0.13, 0]} scale={[1, 0.6, 1]}>
                <sphereGeometry args={[0.5, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#705030" roughness={1} flatShading />
            </mesh>
            <Torus args={[0.47, 0.035, 8, 24]} position={[0, 0.14, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#593a22" roughness={1} />
            </Torus>
            <Torus args={[0.39, 0.018, 6, 24]} position={[0, 0.32, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#8a633a" roughness={1} />
            </Torus>
            <Cylinder args={[0.045, 0.06, 0.26, 8]} position={[0.04, 0.51, 0]} rotation={[0, 0, -0.3]}>
                <meshStandardMaterial color="#593a22" roughness={1} />
            </Cylinder>
        </group>
    );
}

export default memo(Acorn);
