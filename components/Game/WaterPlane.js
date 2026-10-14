import * as THREE from 'three'
import { useRef, useMemo } from 'react'
import { extend, useLoader, useFrame } from '@react-three/fiber'
import { Water } from 'three-stdlib'
import { useStore } from '@/hooks/useStore'

extend({ Water })

const link = `${process.env.NEXT_PUBLIC_CDN}games/Race Game/waternormals.jpeg`

export default function WaterPlane(props) {

    const graphicsQuality = useStore((state) => state.graphicsQuality)
    const darkMode = useStore((state) => state.darkMode)
    
    const ref = useRef()

    const waterNormals = useLoader(THREE.TextureLoader, link)

    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping
    const geom = useMemo(() => new THREE.PlaneGeometry(250, 250), [])
    const config = useMemo(
        () => ({
            textureWidth: 512,
            textureHeight: 512,
            waterNormals,
            sunDirection: new THREE.Vector3(-45, 90, 40).normalize(),
            sunColor: darkMode ? 0x222222 : 0xffffff,
            waterColor: darkMode ? 0x011111 : 0x001e0f,
            distortionScale: 3.7,
            fog: false,
        }),
        [waterNormals, darkMode]
    )
    useFrame((state, delta) => {
        if (ref.current && ref.current.material.uniforms) {
            ref.current.material.uniforms.time.value += delta
        }
    })

    if (graphicsQuality === 'Low') {
        return (
            <mesh {...props} rotation-x={-Math.PI / 2} receiveShadow>
                <planeGeometry args={[250, 250]} />
                <meshStandardMaterial color="#001e0f" />
            </mesh>
        )
    }

    return <water ref={ref} args={[geom, config]} {...props} rotation-x={-Math.PI / 2} receiveShadow />
}
