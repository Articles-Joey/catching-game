import { useFrame } from "@react-three/fiber"
import { BallCollider, RigidBody } from "@react-three/rapier"
import { Suspense, useEffect, useRef, useState } from "react"
import { Vector3 } from "three"
import * as THREE from 'three';
import { useKeyboard } from "@/hooks/useKeyboard"

import { useGameStore } from "@/hooks/useGameStore";

import { Model as SpacesuitModel } from "@/components/Models/Spacesuit";
import ModelToonCharacter from "@/components/Models/ModelToonCharacter";
import { degToRad } from "three/src/math/MathUtils"
import { useStore } from "@/hooks/useStore"
import { useAudioStore } from "@/hooks/useAudioStore"
import { useSocketStore } from "@/hooks/useSocketStore"
import { useSearchParams } from "next/navigation"
import useTouchControlsStore from "@/hooks/useTouchControlsStore"
import useGameFunctions from "@/hooks/useGameFunctions"
import useGameHelpers from "@/hooks/useGameHelpers"
import CharacterNickname from "./CharacterNickname";
import MoveTargetIndicator from "./MoveTargetIndicator";

const JUMP_FORCE = 0;
const SPEED = 12;

function myToFixed(i, digits) {
    var pow = Math.pow(10, digits);

    return Math.floor(i * pow) / pow;
}

function Player() {

    const bodyRef = useRef()
    const lastLocationRef = useRef()
    const recoveryTimerRef = useRef()
    const [action, setAction] = useState("Idle")
    const [lastMove, setLastMove] = useState(0);
    const [isDead, setIsDead] = useState(false);
    const isDeadRef = useRef(false);
    const socket = useSocketStore((state) => state.socket)

    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    const {
        subtractHealth,
    } = useGameFunctions()
    const { decreasePlayerScore } = useGameHelpers();

    const teleport = useGameStore((state) => state.teleport)
    const setTeleport = useGameStore((state) => state.setTeleport)
    const setPlayerLocation = useGameStore((state) => state.setPlayerLocation)
    const health = useGameStore((state) => state.gameState.players?.find((player) =>
        server ? socket?.id && (player.id === socket.id || player.socketId === socket.id) : player.id === "local"
    )?.health ?? state.health)
    const maxHeight = useGameStore((state) => state.maxHeight)
    const setMaxHeight = useGameStore((state) => state.setMaxHeight)
    const shift = useGameStore((state) => state.shift)
    const setShift = useGameStore((state) => state.setShift)
    const addDistance = useGameStore((state) => state.addDistance)
    const debug = useStore((state) => state.debug);
    const toontownMode = useStore((state) => state.toontownMode);
    const nickname = useStore((state) => state.nickname);

    const touchControls = useTouchControlsStore((state) => state.touchControls)
    const setTouchControls = useTouchControlsStore((state) => state.setTouchControls)
    const targetLocation = useGameStore((state) => state.targetLocation)
    const setTargetLocation = useGameStore((state) => state.setTargetLocation)

    useEffect(() => {
        if (health <= 0) {
            clearTimeout(recoveryTimerRef.current);
            recoveryTimerRef.current = null;
            isDeadRef.current = true;
            setIsDead(true);
            setAction("Death");

            if (useAudioStore?.getState()?.audioSettings?.enabled) {
                const audio = new Audio("/audio/Toontown_sad.ogg")
                audio.play().catch(() => {})
            }

        } else if (!recoveryTimerRef.current) {
            isDeadRef.current = false;
            setIsDead(false);
            setAction("Idle");
        }
    }, [health]);

    useEffect(() => {

        if (teleport && bodyRef.current) {
            bodyRef.current.setTranslation({ x: teleport[0], y: teleport[1], z: teleport[2] }, true);
            bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
            setTeleport(false)

        }

    }, [teleport, setTeleport]);

    useEffect(() => () => clearTimeout(recoveryTimerRef.current), []);

    const { moveBackward, moveForward, moveRight, moveLeft, jump, shift: isShifting } = useKeyboard()

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
        const gamepads = navigator.getGamepads?.() || [];
        const gp = gamepads[0];

        const input = { forward: false, backward: false, left: false, right: false, jump: false };
        if (gp) {
            const axes = gp.axes;
            const buttons = gp.buttons;
            const threshold = 0.5;

            let forward = false;
            let backward = false;
            let left = false;
            let right = false;
            let jump = buttons[0]?.pressed || false; // A button

            // D-Pad
            if (buttons[12]?.pressed) forward = true; // Up
            if (buttons[13]?.pressed) backward = true; // Down
            if (buttons[14]?.pressed) left = true; // Left
            if (buttons[15]?.pressed) right = true; // Right

            // Left Stick
            if (axes[1] < -threshold) forward = true;
            if (axes[1] > threshold) backward = true;
            if (axes[0] < -threshold) left = true;
            if (axes[0] > threshold) right = true;

            Object.assign(input, { forward, backward, left, right, jump });
        }
        setControllerInput((previous) => Object.keys(input).every((key) => input[key] === previous[key]) ? previous : input);
    });

    useEffect(() => {

        if (isDead) return;

        const isMoving = moveLeft || moveRight || moveBackward || moveForward ||
            controllerInput.left || controllerInput.right || controllerInput.backward || controllerInput.forward ||
            touchControls?.left || touchControls?.right || touchControls?.down || touchControls?.up;

        if (isMoving) {
            setAction("Walk");
        } else {
            setAction("Idle");
        }

        // Combine inputs
        const fwd = moveForward || controllerInput.forward || touchControls?.up;
        const bwd = moveBackward || controllerInput.backward || touchControls?.down;
        const lft = moveLeft || controllerInput.left || touchControls?.left;
        const rgt = moveRight || controllerInput.right || touchControls?.right;

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

    }, [moveBackward, moveForward, moveRight, moveLeft, controllerInput, isDead, touchControls])

    const [startPosition] = useState(() => [
        (Math.random() * 29) - 14.5,
        1,
        (Math.random() * 29) - 14.5
    ])

    function beginHitReaction() {
        if (isDeadRef.current || useGameStore.getState().gameState.status !== "In Progress") return false;

        isDeadRef.current = true;
        setIsDead(true);
        setAction("Death");

        const body = bodyRef.current;
        if (body) body.setLinvel({ x: 0, y: body.linvel().y, z: 0 }, true);

        recoveryTimerRef.current = setTimeout(() => {
            recoveryTimerRef.current = null;
            const state = useGameStore.getState();
            const player = state.gameState.players?.find((player) =>
                server ? socket?.id && (player.id === socket.id || player.socketId === socket.id) : player.id === "local"
            );
            if ((player?.health ?? state.health) > 0) {
                isDeadRef.current = false;
                setIsDead(false);
                setAction("Idle");
            }
        }, 1000);

        if (useAudioStore.getState().audioSettings?.enabled) {
            new Audio("/audio/surprise.mp3").play().catch(() => {});
        }

        return true;
    }

    function handleEnemyHit({ other }) {
        if (!other.rigidBodyObject?.userData?.isEnemy || !beginHitReaction()) return;

        if (server) socket?.emit("game:catching-game:hit", { server });
        else subtractHealth(1);
    }

    function handlePenaltyHit() {
        if (!beginHitReaction()) return false;

        if (!server) {
            decreasePlayerScore(1);
            subtractHealth(1);
        }

        return true;
    }

    const vel = useRef([0, 0, 0])
    const pos = useRef(startPosition)

    useEffect(() => {
        setShift(isShifting)
    }, [isShifting, setShift])

    useFrame(() => {

        const body = bodyRef.current;
        if (!body) return;
        const position = body.translation();
        const velocity = body.linvel();
        pos.current = [position.x, position.y, position.z];
        vel.current = [velocity.x, velocity.y, velocity.z];

        addDistance(0.1)

        let posX = 0
        if (pos.current[0]) {
            posX = myToFixed(pos.current[0], 2)
        }

        let posY = 0
        if (pos.current[1]) {
            posY = myToFixed(pos.current[1], 2)
        }

        let posZ = 0
        if (pos.current[2]) {
            posZ = myToFixed(pos.current[2], 2)
        }

        let newLocation = new Vector3(posX, posY, posZ)

        const movement = { position: newLocation, action, lastMove };
        if (JSON.stringify(lastLocationRef.current) !== JSON.stringify(movement)) {
            setPlayerLocation(newLocation)

            if (socket && server) {
                socket.emit(`game:${process.env.NEXT_PUBLIC_GAME_KEY}:move`, {
                    server: server,
                    x: newLocation.x,
                    z: newLocation.z,
                    action: action,
                    rotation: [0, degToRad(lastMove), 0]
                })
            }

            lastLocationRef.current = movement
        }
        if (isDeadRef.current || useGameStore.getState().gameState.status === "Game Over") {
            body.setLinvel({ x: 0, y: velocity.y, z: 0 }, true);
            return;
        }

        if (pos.current[1] > maxHeight) {
            setMaxHeight(pos.current[1].toFixed(2))
        }

        const direction = new Vector3()

        const frontVector = new Vector3(
            0,
            0,
            (moveForward || touchControls?.up || controllerInput.forward ? -1 : 0) - (moveBackward || touchControls?.down || controllerInput.backward ? -1 : 0),
        )

        const sideVector = new Vector3(
            (moveLeft || touchControls?.left || controllerInput.left ? 1 : 0) - (moveRight || touchControls?.right || controllerInput.right ? 1 : 0),
            0,
            0,
        )

        direction
            .subVectors(frontVector, sideVector)
            .normalize()
            .multiplyScalar(SPEED * (shift ? 2 : 1))

        if ((frontVector.z !== 0 || sideVector.x !== 0) && targetLocation) {
            setTargetLocation(null);
        }

        if (targetLocation) {
            const dx = targetLocation[0] - pos.current[0];
            const dz = targetLocation[2] - pos.current[2];
            const dist = Math.sqrt(dx * dx + dz * dz);

            if (dist < 0.5) {
                setTargetLocation(null);
                setAction("Idle");
            } else {
                const targetDir = new Vector3(dx, 0, dz).normalize();
                direction.copy(targetDir).multiplyScalar(SPEED * (shift ? 2 : 1));

                const angle = Math.atan2(direction.x, direction.z);
                setLastMove(THREE.MathUtils.radToDeg(angle));
                setAction("Walk");
            }
        }

        body.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true)

        // Limit player movement to -15, -15 to 15, 15
        const LIMIT = 14.5
        if (Math.abs(pos.current[0]) > LIMIT || Math.abs(pos.current[2]) > LIMIT) {
            body.setTranslation({
                x: Math.max(-LIMIT, Math.min(LIMIT, pos.current[0])),
                y: pos.current[1],
                z: Math.max(-LIMIT, Math.min(LIMIT, pos.current[2])),
            }, true)
        }

        if ((jump || touchControls?.jump || controllerInput.jump) && Math.abs(vel.current[1]) < 0.05) {

            body.setLinvel({ x: direction.x, y: JUMP_FORCE, z: direction.z }, true)

            if (
                touchControls?.jump
            ) {
                setTouchControls({
                    ...touchControls,
                    jump: false,
                })
            }
        }

    })

    return (
        <group>

            <RigidBody
                ref={bodyRef}
                position={startPosition}
                colliders={false}
                lockRotations
                friction={0}
                userData={{ isPlayer: true, playerId: server ? socket?.id : "local", onPenaltyHit: handlePenaltyHit }}
                onIntersectionEnter={handleEnemyHit}
            >
                <BallCollider args={[1]} mass={10} />

                <CharacterNickname nickname={nickname} position={[0, 2.8, 0]} />
                {/* TODO - Add AMCOT Characters package */}

                <Suspense fallback={null}>
                    {toontownMode ? <ModelToonCharacter
                        action={action}
                        isWalking={action === "Walk"}
                        isSprinting={action === "Walk" && shift}
                        rotation={[0, degToRad(lastMove), 0]}
                        position={[0, -1, 0]}
                    /> : <SpacesuitModel
                        scale={2}
                        action={action}
                        rotation={[0, degToRad(lastMove), 0]}
                        position={[0, -0.5, 0]}
                    />}
                </Suspense>
                {debug && <mesh>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshBasicMaterial color="blue" wireframe opacity={0.5} transparent />
                </mesh>}
            </RigidBody>

            {targetLocation && (
                <MoveTargetIndicator position={[targetLocation[0], targetLocation[1] - 0.35, targetLocation[2]]} />
            )}

        </group>
    )
}

export default Player
