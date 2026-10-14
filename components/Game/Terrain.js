"use client";

import { useEffect, useMemo } from "react";
import { RigidBody } from "@react-three/rapier";
import { useGameStore } from "@/hooks/useGameStore";
import { useStore } from "@/hooks/useStore";
import GrassPlane from "./GrassPlane";
import { createTerrainGeometry, DEFAULT_TERRAIN } from "./terrainGeometry";

export default function Terrain({
    terrain = DEFAULT_TERRAIN,
    size = terrain.size,
    interactive = true,
}) {
    const graphicsQuality = useStore((state) => state.graphicsQuality);
    const setTargetLocation = useGameStore((state) => state.setTargetLocation);
    const detail = graphicsQuality === "High" ? 0.5 : graphicsQuality === "Low" ? 2 : 1;
    const geometry = useMemo(
        () => createTerrainGeometry(size, terrain, { detail }),
        [size, terrain, detail],
    );
    useEffect(() => () => geometry.dispose(), [geometry]);

    return (
        <RigidBody key={geometry.uuid} type="fixed" colliders="trimesh" userData={{ isGround: true }} friction={0}>
            <GrassPlane
                geometry={geometry}
                terrain={terrain}
                size={size}
                onClick={(event) => {
                    if (!interactive || useStore.getState().debug || event.delta > 5) return;
                    if (useGameStore.getState().gameState.status === "Game Over") return;
                    const limit = terrain.fieldSize / 2 - 0.5;
                    if (Math.abs(event.point.x) > limit || Math.abs(event.point.z) > limit) return;
                    event.stopPropagation();
                    setTargetLocation([event.point.x, 0.5, event.point.z]);
                }}
            />
        </RigidBody>
    );
}
