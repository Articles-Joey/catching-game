import { useFrame, useThree } from "@react-three/fiber"
import { useSphere } from "@react-three/cannon"
import { useGLTF, useAnimations, Text } from '@react-three/drei'
import { memo, useEffect, useRef, useState } from "react"
import { Vector3 } from "three"
import * as THREE from 'three';
import { useKeyboard } from "@/hooks/useKeyboard"

import { useControllerStore } from '@/hooks/useControllerStore';
import { useGameStore } from "@/hooks/useGameStore";
// import { useTouchControlsStore } from "@/hooks/useTouchControlsStore";

// import ClownfishModel from "./PlayerModels/Clownfish"
// import BoneFishModel from "./PlayerModels/BoneFish"
// import { useLocalStorageNew } from "@/hooks/useLocalStorageNew"

import { Model as SpacesuitModel } from "@/components/Models/Spacesuit";
import { degToRad } from "three/src/math/MathUtils"

const JUMP_FORCE = 0;
const SPEED = 12;

let lastLocation

function myToFixed(i, digits) {
    var pow = Math.pow(10, digits);

    return Math.floor(i * pow) / pow;
}

function Player(props) {

    const playerModelRef = useRef()

    // const { setPlayerData, teleportPlayer, setTeleportPlayer } = props;

    // const {
    //     cameraMode, setCameraMode,
    //     teleport, setTeleport,
    //     setPlayerLocation,
    //     maxHeight, setMaxHeight,
    //     shift, setShift,
    //     addDistance,
    //     score, setScore,
    //     debug
    // } = useGameStore()
    // const cameraMode = useGameStore((state) => state.cameraMode)
    // const setCameraMode = useGameStore((state) => state.setCameraMode)
    const teleport = useGameStore((state) => state.teleport)
    const setTeleport = useGameStore((state) => state.setTeleport)
    const setPlayerLocation = useGameStore((state) => state.setPlayerLocation)
    const health = useGameStore((state) => state.health)
    const maxHeight = useGameStore((state) => state.maxHeight)
    const setMaxHeight = useGameStore((state) => state.setMaxHeight)
    const shift = useGameStore((state) => state.shift)
    const setShift = useGameStore((state) => state.setShift)
    const addDistance = useGameStore((state) => state.addDistance)
    // const score = useGameStore((state) => state.score)
    const setScore = useGameStore((state) => state.setScore)
    const debug = useGameStore((state) => state.debug)
    const subtractHealth = useGameStore((state) => state.subtractHealth)

    // const {
    //     touchControls, setTouchControls
    // } = useTouchControlsStore()

    const touchControls = {
        jump: false,
        left: false,
        right: false,
        up: false,
        down: false,
    }

    useEffect(() => {
        if (health <= 0) {
            console.log("Player is dead")
            setIsDead(true);
            setAction("Death");

            const audio = new Audio("/audio/Toontown_sad.ogg")
            audio.play()
        }
    }, [health]);

    const setTouchControls = (newValue) => {
        // useTouchControlsStore.setState({
        //     touchControls: newValue
        // })
    }

    const { controllerState, setControllerState } = useControllerStore()

    // const [character, setCharacter] = useLocalStorageNew("game:ocean-rings:character", {
    //     model: 'Clownfish',
    //     color: '#000000'
    // })

    // Attach event listeners when the component mounts
    useEffect(() => {

        // if (controllerState.axes && Math.abs(controllerState?.axes[0]) > 0.3) {

        //     if (controllerState?.axes[0] > 0) {
        //         api.position.set([-1, 5, 0]);
        //     } else {
        //         api.position.set([1, 5, 0]);
        //     }

        // }

    }, [controllerState]);

    useEffect(() => {

        if (teleport) {

            console.log("Teleport has been called!", teleport)
            api.position.set(teleport[0], teleport[1], teleport[2]);
            setTeleport(false)

        }

    }, [teleport]);

    const { moveBackward, moveForward, moveRight, moveLeft, jump, shift: isShifting, crouch } = useKeyboard()
    const [action, setAction] = useState("Idle")
    const [lastMove, setLastMove] = useState(0);
    const [isDead, setIsDead] = useState(false);
    const isDeadRef = useRef(false);

    useEffect(() => {
        isDeadRef.current = isDead;
    }, [isDead]);

    // Controller Logic
    const [controllerInput, setControllerInput] = useState({
        forward: false,
        backward: false,
        left: false,
        right: false,
        jump: false
    });

    useFrame(() => {
        const gamepads = navigator.getGamepads();
        const gp = gamepads[0];

        if (gp) {
            const axes = gp.axes;
            const buttons = gp.buttons;
            const threshold = 0.5;

            let forward = false;
            let backward = false;
            let left = false;
            let right = false;
            let jump = buttons[0].pressed; // A button

            // D-Pad
            if (buttons[12].pressed) forward = true; // Up
            if (buttons[13].pressed) backward = true; // Down
            if (buttons[14].pressed) left = true; // Left
            if (buttons[15].pressed) right = true; // Right

            // Left Stick
            if (axes[1] < -threshold) forward = true;
            if (axes[1] > threshold) backward = true;
            if (axes[0] < -threshold) left = true;
            if (axes[0] > threshold) right = true;

            setControllerInput({ forward, backward, left, right, jump });
        }
    });

    useEffect(() => {

        if (isDead) return;

        const isMoving = moveLeft || moveRight || moveBackward || moveForward ||
            controllerInput.left || controllerInput.right || controllerInput.backward || controllerInput.forward;

        if (isMoving) {
            setAction("Walk");
        }

        // Combine inputs
        const fwd = moveForward || controllerInput.forward;
        const bwd = moveBackward || controllerInput.backward;
        const lft = moveLeft || controllerInput.left;
        const rgt = moveRight || controllerInput.right;

        if (fwd && rgt) {
            setLastMove(135); // Forward + Right
        } else if (fwd && lft) {
            setLastMove(225); // Forward + Left
        } else if (bwd && rgt) {
            setLastMove(45); // Backward + Right
        } else if (bwd && lft) {
            setLastMove(-45); // Backward + Left
        } else if (rgt) {
            setLastMove(90); // Right
        } else if (lft) {
            setLastMove(-90); // Left
        } else if (fwd) {
            setLastMove(180); // Forward
        } else if (bwd) {
            setLastMove(0); // Backward
        }

        if (!isMoving) {
            setAction("Idle");
        }

    }, [moveBackward, moveForward, moveRight, moveLeft, controllerInput, isDead])

    const { camera } = useThree()

    const [startPosition] = useState(() => [
        (Math.random() * 29) - 14.5,
        1,
        (Math.random() * 29) - 14.5
    ])

    const [ref, api] = useSphere(() => ({
        mass: 10,
        args: [1],
        position: startPosition,
        onCollide: (e) => {
            console.log("Player Collide", e)

            if (e.body.userData.isEnemy) {
                if (!isDeadRef.current) {

                    // const currentScore = useGameStore.getState().score
                    // setScore(currentScore - 1)

                    subtractHealth(1)

                    setIsDead(true);
                    setAction("Death");
                    setTimeout(() => {
                        setIsDead(false);
                    }, 1000);

                    const audio = new Audio("/audio/surprise.mp3")
                    audio.play()

                }
            }

            if (e.body.userData.isPositiveObject) {
                const currentScore = useGameStore.getState().score
                setScore(currentScore + 1)
            }

        }
    }))

    const material = new THREE.MeshPhysicalMaterial({
        color: 'blue',
        opacity: debug ? 1 : 0,
        transparent: true
    });

    const vel = useRef([0, 0, 0])
    useEffect(() => {
        api.velocity.subscribe((v) => vel.current = v)
    }, [api.velocity])

    const pos = useRef([0, 0, 0])
    useEffect(() => {

        api.position.subscribe((p) => {

            pos.current = p

            // setPlayerLocation(p)

            if (playerModelRef.current) {
                playerModelRef.current.position.set(...p);
            }

        })

    }, [api.position])

    useEffect(() => {
        console.log("Shift", isShifting)
        setShift(isShifting)
    }, [isShifting])

    useFrame(() => {

        addDistance(0.1)

        // if (cameraMode == "Player") {
        //     camera.position.copy(new Vector3(0, pos.current[1], (pos.current[2] + 10)))
        //     camera.lookAt(new Vector3(0, pos.current[1], (pos.current[2] + 5)))
        // }

        let posX = 0
        if (pos.current[0]) {
            posX = myToFixed(pos.current[0], 2)
        }

        // console.log(pos.current[1])
        let posY = 0
        if (pos.current[1]) {
            posY = myToFixed(pos.current[1], 2)
        }

        let posZ = 0
        if (pos.current[2]) {
            posZ = myToFixed(pos.current[2], 2)
        }

        // console.log(posX)

        let newLocation = [posX, posY, posZ]

        if (JSON.stringify(lastLocation) !== JSON.stringify(newLocation)) {
            // console.log(newLocation, lastLocation)
            setPlayerLocation(newLocation)
            lastLocation = newLocation
        }
        // else {
        if (isDeadRef.current) {
            api.velocity.set(0, 0, 0);
            return;
        }

        //     console.log("location unchanged")
        // }

        if (pos.current[1] > maxHeight) {
            setMaxHeight(pos.current[1].toFixed(2))
        }

        const direction = new Vector3()

        const frontVector = new Vector3(
            0,
            0,
            (moveForward || touchControls.up || controllerInput.forward ? -1 : 0) - (moveBackward || touchControls.down || controllerInput.backward ? -1 : 0),
        )

        const sideVector = new Vector3(
            (moveLeft || touchControls.left || controllerInput.left ? 1 : 0) - (moveRight || touchControls.right || controllerInput.right ? 1 : 0),
            0,
            0,
        )

        direction
            .subVectors(frontVector, sideVector)
            .normalize()
            .multiplyScalar(SPEED * (shift ? 2 : 1))
        // .applyEuler(camera.rotation)

        api.velocity.set(direction.x, 0, direction.z)

        // Limit player movement to -15, -15 to 15, 15
        const LIMIT = 14.5
        if (Math.abs(pos.current[0]) > LIMIT || Math.abs(pos.current[2]) > LIMIT) {
            api.position.set(
                Math.max(-LIMIT, Math.min(LIMIT, pos.current[0])),
                pos.current[1],
                Math.max(-LIMIT, Math.min(LIMIT, pos.current[2]))
            )
        }

        if ((jump || touchControls.jump || controllerInput.jump) && Math.abs(vel.current[1]) < 0.05) {

            console.log("Jump understood")

            api.velocity.set(vel.current[0], JUMP_FORCE, vel.current[2])

            if (
                touchControls.jump
                // ||
                // touchControls.left
                // ||
                // touchControls.right
            ) {
                setTouchControls({
                    ...touchControls,
                    jump: false,
                    // left: false,
                    // right: false
                })
            }
        }

    })

    return (
        <group>

            <group
                ref={playerModelRef}
            >
                <SpacesuitModel
                    scale={2}
                    action={action}
                    rotation={[0, degToRad(lastMove), 0]}
                    position={[0, -0.5, 0]}
                />
            </group>

            <mesh
                ref={ref}
                // {...props}
                // position={position}
                material={material}
            >
                <sphereGeometry args={[1, 32, 32]} />

                {/* {character.model == 'Clownfish' && <ClownfishModel rotation={[0, Math.PI / 1, 0]} />}
                {character.model == 'Bone Fish' && <BoneFishModel rotation={[0, -Math.PI / 2, 0]} />} */}

                {/* <Text
                    color="black" position={[0, -0.7, 0]} scale={0.3} anchorX="center" anchorY="middle"
                >
                    Player ({character.model})
                </Text> */}

            </mesh>

        </group>
    )
}

export default Player