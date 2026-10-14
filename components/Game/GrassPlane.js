import { useEffect, useMemo } from "react";
import { useTexture } from "@react-three/drei";
import { RigidBody, TrimeshCollider } from "@react-three/rapier";
import {
    LinearFilter,
    MeshStandardMaterial,
    NoColorSpace,
    RepeatWrapping,
    SRGBColorSpace,
} from "three";
import { useStore } from "@/hooks/useStore";
import { createTerrainGeometry, DEFAULT_TERRAIN } from "./terrainGeometry";
import { createToonGrassMaterial } from "./toonGrassMaterial";
import { addShorelineBlend } from "./shorelineMaterial";

export default function GrassPlane({
    terrain = DEFAULT_TERRAIN,
    radius = 200,
    geometry: suppliedGeometry,
    size: suppliedSize,
    ...props
}) {
    const graphicsQuality = useStore((state) => state.graphicsQuality);
    const toontownMode = useStore((state) => state.toontownMode);

    const size = suppliedSize ?? (
        graphicsQuality === "Low"
            ? radius * 2
            : graphicsQuality === "Medium"
              ? radius * 3
              : radius * 4);

    const geometry = useMemo(
        () => suppliedGeometry ?? createTerrainGeometry(size, terrain),
        [suppliedGeometry, size, terrain],
    );
    useEffect(() => () => {
        if (!suppliedGeometry) geometry.dispose();
    }, [geometry, suppliedGeometry]);

    return (
        <mesh
            geometry={geometry}
            castShadow
            receiveShadow
            {...props}
        >
            {toontownMode ? (
                <ToonGrassMaterial terrain={terrain} />
            ) : (
                <RealisticGrassMaterial size={size} terrain={terrain} />
            )}
        </mesh>
    );
}

function ToonGrassMaterial({ terrain }) {
    const material = useMemo(() => addShorelineBlend(createToonGrassMaterial(), terrain, true), [terrain]);
    useEffect(
        () => () => {
            material.userData.sketchTexture.dispose();
            material.dispose();
        },
        [material],
    );
    return (
        <primitive
            object={material}
            attach="material"
        />
    );
}

function RealisticGrassMaterial({ size, terrain }) {
    const [colorSource, normalSource] = useTexture([
        "/textures/Grass/Poliigon_GrassPatchyGround_4585_BaseColor.jpg",
        "/textures/Grass/Poliigon_GrassPatchyGround_4585_Normal.png",
    ]);
    const maps = useMemo(() => {
        const colorMap = colorSource.clone();
        const normalMap = normalSource.clone();
        colorMap.colorSpace = SRGBColorSpace;
        normalMap.colorSpace = NoColorSpace;
        for (const texture of [colorMap, normalMap]) {
            texture.magFilter = LinearFilter;
            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;
            texture.repeat.set(size / 10, size / 10);
            texture.needsUpdate = true;
        }
        return { colorMap, normalMap };
    }, [colorSource, normalSource, size]);
    const material = useMemo(() => addShorelineBlend(new MeshStandardMaterial({
        map: maps.colorMap,
        normalMap: maps.normalMap,
        roughness: 0.95,
    }), terrain), [maps, terrain]);
    useEffect(() => () => material.dispose(), [material]);

    useEffect(
        () => () => {
            maps.colorMap.dispose();
            maps.normalMap.dispose();
        },
        [maps],
    );

    return (
        <primitive object={material} attach="material" />
    );
}

export function TerrainGround({ terrain = DEFAULT_TERRAIN, size = 102 }) {
    // A standalone collider for consumers that render GrassPlane outside Terrain.
    const geometry = useMemo(
        () => createTerrainGeometry(size, terrain),
        [size, terrain],
    );
    const args = useMemo(
        () => [geometry.attributes.position.array, geometry.index.array],
        [geometry],
    );
    useEffect(() => () => geometry.dispose(), [geometry]);

    return (
        <RigidBody
            type="fixed"
            colliders={false}
            userData={{ isGround: true }}
        >
            <TrimeshCollider
                args={args}
                friction={0}
                restitution={0}
            />
        </RigidBody>
    );
}
