"use client"
import { memo, Suspense } from "react";

import { Canvas } from "@react-three/fiber"
import { Sky, Stats } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { degToRad } from "three/src/math/MathUtils";

import Player from "./Player";

import WaterPlane from "./WaterPlane";
import { ModelQuaterniusAnimalsDeer } from "@/components/Models/Deer";
import { ModelQuaterniusAnimalsCow } from "@/components/Models/Cow";
import { ModelJToastieGrassPlatform } from "@/components/Models/Grass Platform";
import { ModelKennyNLNatureRockTallE } from "@/components/Models/rock_tallE";

import { Enemy } from "./Enemy";
import { useGameStore } from "@/hooks/useGameStore";
import { useStore } from "@/hooks/useStore";
import TreeArea from "./TreeArea";
import SceneryArea from "./SceneryArea";
import GrassArea from "./GrassArea";
import FenceSquare from "./FenceSquare";
import FenceImageRing from "./FenceImageRing";
import HillsImageRing, {
    HILL_RING_RADII,
    TOONTOWN_HILL_RADIUS,
} from "./HillsImageRing";
import { ModelToontownBetterSkybox } from "./ToontownBetterSkybox";
import { DEFAULT_TERRAIN as TERRAIN } from "./terrainGeometry";
import CameraManager from "./CameraManager";
import Terrain from "./Terrain";
import SocketPlayers from "./SocketPlayers";
import FallingItems from "./FallingItems";

const FENCE_BOUNDS = { minX: -30, maxX: 30, minZ: -30, maxZ: 30 };
const GRASS_OUTER_BOUNDS = { minX: -90, maxX: 90, minZ: -90, maxZ: 90 };
const OUTER_FENCE_RADIUS = 100;
// Keep the sky and clouds behind the outermost hill ring in either visual mode.
const SKY_RING_GAP = 25;

function GameCanvas({
    landingAnimationMode = false,
}) {

    const debug = useStore((state) => state.debug);

    const darkMode = useStore((state) => state.darkMode)

    const graphicsQuality = useStore((state) => state.graphicsQuality)
    const toontownMode = useStore((state) => state.toontownMode);
    const outerHillRadius = toontownMode
        ? TOONTOWN_HILL_RADIUS
        : Math.max(...Object.values(HILL_RING_RADII));
    const skyRingRadius = outerHillRadius + SKY_RING_GAP;

    const timer = useGameStore((state) => state.gameState.timer)
    const status = useGameStore((state) => state.gameState.status);
    const showStats = useStore((state) => state?.debugConfig?.showStats);
    const shadowMapSize = graphicsQuality === "High" ? 4096 : graphicsQuality === "Low" ? 1024 : 2048;

    return (
        <Canvas
            shadows="soft"
            camera={{
                position: [0, 30, 30],
                fov: 50,
                far: Math.max(1000, skyRingRadius * 4),
            }}
        >
            {showStats && <>
                <Stats className="stats-overlay" />
            </>}

            <CameraManager landingAnimationMode={landingAnimationMode} />
            <Sky sunPosition={darkMode ? [0, -10, 0] : [-45, 90, 40]} />

            <ambientLight intensity={darkMode ? 0.12 : 0.3} />
            <hemisphereLight args={[darkMode ? "#718bb9" : "#d9efff", "#42502c", darkMode ? 0.3 : 0.65]} />
            <directionalLight
                castShadow
                position={[-45, 90, 40]}
                color={darkMode ? "#a9c5ff" : "#fff3d6"}
                intensity={darkMode ? 0.8 : 2.4}
                shadow-mapSize-width={shadowMapSize}
                shadow-mapSize-height={shadowMapSize}
                shadow-camera-left={-200}
                shadow-camera-right={200}
                shadow-camera-top={200}
                shadow-camera-bottom={-200}
                shadow-camera-near={1}
                shadow-camera-far={350}
                shadow-bias={-0.00015}
                shadow-normalBias={0.04}
            />

            <Suspense fallback={null}>

            <group position={[0, TERRAIN.groundHeight, 0]}>
                <HillsImageRing
                    imageHeight={50}
                    layerHeightGrowth={0.08}
                    autoRotate={true}
                />
                <ModelToontownBetterSkybox
                    radius={skyRingRadius}
                    cloudsHeight={175}
                    skyDomeHeight={125}
                    followCamera={false}
                />
            </group>

            <WaterPlane
                position={[0, TERRAIN.waterHeight, 0]}
            />

            {graphicsQuality !== "Low" &&
                <>
                    <ModelQuaterniusAnimalsDeer
                        position={[5, TERRAIN.groundHeight, -TERRAIN.outerBank - 3]}
                        scale={[1, 1, 1]}
                        rotation={[0, degToRad(45), 0]}
                        action={"Eating"}
                    />

                    <ModelQuaterniusAnimalsDeer
                        position={[5, TERRAIN.groundHeight, -TERRAIN.outerBank - 6]}
                        scale={1.2}
                        rotation={[0, degToRad(45), 0]}
                        action={"Idle"}
                    />

                    <ModelJToastieGrassPlatform
                        scale={50}
                        position={[-35, 10, -35]}
                        rotation={[degToRad(180), 0, 0]}
                    />

                    <ModelKennyNLNatureRockTallE
                        scale={20}
                        position={[30, 0, -35]}
                        rotation={[0, degToRad(45), 0]}
                    />

                    <ModelQuaterniusAnimalsCow
                        position={[-31, 8.6, -31]}
                        scale={1.2}
                        rotation={[0, degToRad(20), 0]}
                        action={"Attack_Headbutt"}
                    />
                </>
            }

            <TreeArea
                minSafeArea={11}
                getTerrainHeight={TERRAIN.getHeight}
            />
            <FenceSquare
                size={60}
                getTerrainHeight={TERRAIN.getHeight}
            />
            <FenceImageRing
                radius={OUTER_FENCE_RADIUS}
                getTerrainHeight={TERRAIN.getHeight}
            />
            <SceneryArea
                seed="catching-forest-1"
                innerBounds={FENCE_BOUNDS}
                outerRadius={OUTER_FENCE_RADIUS}
                getTerrainHeight={TERRAIN.getHeight}
            />
            <GrassArea
                innerBounds={FENCE_BOUNDS}
                outerBounds={GRASS_OUTER_BOUNDS}
                groundHeight={TERRAIN.groundHeight}
                getTerrainHeight={TERRAIN.getHeight}
            />

            <Physics debug={debug} gravity={[0, -9.81, 0]}>
                <Terrain terrain={TERRAIN} interactive={!landingAnimationMode} />
                {!landingAnimationMode && <>
                    <Player />
                    <SocketPlayers />
                    <FallingItems />
                    {status === "In Progress" && <>
                        <Enemy args={[1, 6, 6]} />
                        {timer >= 20 && <Enemy args={[1, 6, 6]} />}
                        {timer >= 40 && <Enemy args={[1, 6, 6]} />}
                    </>}
                </>}
            </Physics>
            </Suspense>

        </Canvas>
    )
}

export default memo(GameCanvas)

