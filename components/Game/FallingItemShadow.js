import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";

const INITIAL_OPACITY = 0.12;

const vertexShader = /* glsl */ `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = /* glsl */ `
    varying vec2 vUv;
    uniform float opacity;
    void main() {
        float radius = length((vUv - 0.5) * 2.0);
        float alpha = (1.0 - smoothstep(0.0, 1.0, radius)) * opacity;
        gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
    }
`;

export default function FallingItemShadow({ bodyRef, spawnHeight = 40 }) {
    const meshRef = useRef();
    const materialRef = useRef();
    const uniforms = useMemo(() => ({ opacity: { value: INITIAL_OPACITY } }), []);

    useFrame(() => {
        const body = bodyRef.current;
        const mesh = meshRef.current;
        const material = materialRef.current;
        if (!body || !mesh || !material) return;

        const position = body.translation();
        const closeness = 1 - MathUtils.clamp(position.y / spawnHeight, 0, 1);
        mesh.position.set(position.x, 0.025, position.z);
        mesh.scale.setScalar(MathUtils.lerp(2.2, 0.7, closeness));
        material.uniforms.opacity.value = MathUtils.lerp(INITIAL_OPACITY, 0.65, closeness * closeness);
    });

    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1} raycast={() => null}>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
                ref={materialRef}
                uniforms={uniforms}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                transparent
                depthWrite={false}
                polygonOffset
                polygonOffsetFactor={-1}
                polygonOffsetUnits={-1}
            />
        </mesh>
    );
}
