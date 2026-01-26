import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ModelAcornMascot } from "../Models/ModelAcornMascot";

export default function RotatingMascot() {
    return (
        <div className="rotating-mascot-container w-100 h-100">
            <Canvas>

                <OrbitControls
                    autoRotate
                    enableZoom={false}
                    enablePan={false}
                    enableRotate={false}
                    autoRotateSpeed={10}
                />

                <ambientLight intensity={1} />

                <ModelAcornMascot
                    scale={3}
                />

            </Canvas>
        </div>
    );
}