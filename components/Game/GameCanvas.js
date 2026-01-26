"use client"
import { memo, useEffect, useMemo } from "react";

import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei";

import { NearestFilter, RepeatWrapping, TextureLoader, Vector3 } from "three";

import { Debug, Physics, useBox, usePlane, useSphere } from "@react-three/cannon";
import { degToRad } from "three/src/math/MathUtils";

// import { Model as SpacesuitModel } from "@/components/Games/Assets/Quaternius/men/Spacesuit";
import Player from "./Player";
import generateRandomInteger from "@/util/generateRandomInteger";

import Tree from "@/components/Models/Tree";
import WaterPlane from "./WaterPlane";
import { ModelQuaterniusAnimalsDeer } from "@/components/Models/Deer";
import { ModelQuaterniusAnimalsCow } from "@/components/Models/Cow";
import { ModelJToastieGrassPlatform } from "@/components/Models/Grass Platform";
import { ModelKennyNLNatureRockTallE } from "@/components/Models/rock_tallE";

import { Enemy } from "./Enemy";
import { useGameStore } from "@/hooks/useGameStore";
import { useStore } from "@/hooks/useStore";
import TimeHandler from "./TimeHandler";
import SquareOfTrees from "./SquareOfTrees";
import CameraManager from "./CameraManager";
import NPC from "./NPC";

const texture = new TextureLoader().load(`img/grass.webp`)
const textureOther = new TextureLoader().load(`img/grass.webp`)

// const GrassPlane = () => {

//     const width = 100; // Set the width of the plane
//     const height = 100; // Set the height of the plane

//     texture.magFilter = NearestFilter;
//     texture.wrapS = RepeatWrapping
//     texture.wrapT = RepeatWrapping
//     texture.repeat.set(5, 5)

//     return (
//         <>
//             <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
//                 <planeGeometry attach="geometry" args={[width, height]} />
//                 <meshStandardMaterial attach="material" map={texture} />
//             </mesh>
//         </>
//     );
// };

function GameCanvas(props) {

    const debug = useGameStore((state) => state.debug);

    const darkMode = useStore((state) => state.darkMode)
    const toggleDarkMode = useStore((state) => state.toggleDarkMode)

    const graphicsQuality = useStore((state) => state.graphicsQuality)

    const timer = useGameStore((state) => state.timer)

    let gameContent = (
        <>
            <Player />

            <Ground
                args={[30, 30]}
            // args={[30, 0.5, 30]}
            />

            <FallingObjects

            />

            <Enemy

                // Sphere
                args={[1, 6, 6]}

                // Box
                // args={[2, 2, 2]}

                position={[0, 1.2, 0]}
            />

            {timer <= 40 &&
                <Enemy

                    // Sphere
                    args={[1, 6, 6]}

                    // Box
                    // args={[2, 2, 2]}

                    position={[0, 1.2, 0]}
                />
            }

            {timer <= 20 &&
                <Enemy

                    // Sphere
                    args={[1, 6, 6]}

                    // Box
                    // args={[2, 2, 2]}

                    position={[0, 1.2, 0]}
                />
            }

            
            {timer <= 40 && <NPC />}
            {timer <= 20 && <NPC />}

        </>
    )

    let physicsContent
    if (debug) {
        physicsContent = (
            <Debug>
                {gameContent}
            </Debug>
        )
    } else {
        physicsContent = (
            gameContent
        )
    }

    return (
        <Canvas shadows camera={{ position: [10, 10, 30], fov: 50 }}>

            <OrbitControls
            // autoRotate={gameState?.status == 'In Lobby'}
            />

            <CameraManager />

            <TimeHandler />

            {/* a */}

            <ambientLight intensity={0.2} />

            {/* <spotLight distance={500} castShadow intensity={10000} position={[0, 100, 0]} angle={1} penumbra={1} /> */}

            {darkMode ?
                <directionalLight
                    castShadow
                    position={[0, 10, -100]}
                    intensity={2}
                // shadow-camera-left={-20}
                // shadow-camera-right={20}
                // shadow-camera-top={20}
                // shadow-camera-bottom={-20}
                />
                :
                <directionalLight
                    castShadow
                    position={[0, 100, 0]}
                    intensity={10}
                    shadow-camera-left={-20}
                    shadow-camera-right={20}
                    shadow-camera-top={20}
                    shadow-camera-bottom={-20}
                />
            }

            <WaterPlane
                position={[0, 0, 0]}
            />

            {graphicsQuality !== "Low" &&
                <>
                    <ModelQuaterniusAnimalsDeer
                        position={[5, 0, -25]}
                        scale={[1, 1, 1]}
                        rotation={[0, degToRad(45), 0]}
                        action={"Eating"}
                    />

                    <ModelQuaterniusAnimalsDeer
                        position={[5, 0, -28]}
                        scale={1.2}
                        rotation={[0, degToRad(45), 0]}
                        action={"Idle"}
                    />

                    <ModelJToastieGrassPlatform
                        scale={50}
                        position={[-35, 10, -25]}
                        rotation={[degToRad(180), 0, 0]}
                    />

                    <ModelKennyNLNatureRockTallE
                        scale={20}
                        position={[30, 0, -25]}
                    />

                    <ModelQuaterniusAnimalsCow
                        position={[-23, 5, -23]}
                        scale={1.2}
                        rotation={[0, degToRad(20), 0]}
                        action={"Attack_Headbutt"}
                    />
                </>
            }

            <Tree
                position={[-15, 0, -25]}
            />
            <Tree
                position={[0, 0, -25]}
                scale={[1, 5, 1]}
            />
            <Tree
                position={[15, 0, -25]}
            />

            <Tree
                position={[25, 0, -0]}
            />
            <Tree
                position={[-25, 0, -0]}
            />

            <Grass
                position={[0, 0, -120]}
                args={[200, 200]}
            />
            <Grass
                position={[0, 0, 120]}
                args={[200, 200]}
            />
            <Grass
                position={[-120, 0, 0]}
                args={[200, 200]}
            />
            <Grass
                position={[120, 0, 0]}
                args={[200, 200]}
            />

            <SquareOfTrees
                count={20}
                areaSize={100}
                position={[0, 0, -100]}
                seed={42}
            />

            <Physics>

                {physicsContent}

            </Physics>

        </Canvas>
    )
}

export default memo(GameCanvas)

function FallingObjects() {
    return (
        <FallingObject
            args={[1, 6, 6]}
            position={[0, 40, 0]}
        />
    )
}

function FallingObject({ args, position, rotation }) {

    const [ref, api] = useSphere(() => ({
        mass: 1,
        // type: 'Dynamic',
        isTrigger: true,
        args: args,
        position: position,
        rotation: rotation,
        userData: {
            isPositiveObject: true,
        },
        onCollide: (e) => {
            console.log("FallingObject Collide")
        }
    }))

    useEffect(() => {

        api.position.subscribe((p) => {

            if (p[1] < 1.2) {

                api.position.set(
                    generateRandomInteger(-14, 14),
                    position[1],
                    generateRandomInteger(-14, 14),
                );

                api.velocity.set(0, 0, 0);

            }

        })

    }, [api.position])

    return (
        <mesh ref={ref} castShadow>
            <sphereGeometry args={args} />
            <meshStandardMaterial color="green" />
        </mesh>
    )

}

function Ground({ args }) {

    const [ref, api] = usePlane(() => ({
        // mass: 0,
        type: 'Static',
        args: args,
        position: [0, 0, 0],
        rotation: [-Math.PI / 2, 0, 0]
    }))

    texture.magFilter = NearestFilter;
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.repeat.set(1, 1)

    return (
        <mesh ref={ref} castShadow receiveShadow>

            <boxGeometry args={args} />

            {/* <meshStandardMaterial color="#08e8de" /> */}

            <meshStandardMaterial attach="material" map={texture} />

        </mesh>
    )

}

function Grass({ args, position }) {

    textureOther.magFilter = NearestFilter;
    textureOther.wrapS = RepeatWrapping
    textureOther.wrapT = RepeatWrapping
    textureOther.repeat.set(20, 20)

    return (
        <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>

            <boxGeometry args={args} />

            <meshStandardMaterial attach="material" map={textureOther} />

        </mesh>
    )

}

