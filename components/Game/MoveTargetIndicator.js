import { Line } from "@react-three/drei";
import { DoubleSide, Shape, Vector2 } from "three";
import YAxisBillboard from "./YAxisBillboard";

const arrowPoints = [
    [-0.15, 1.1],
    [0.15, 1.1],
    [0.15, 0.5],
    [0.45, 0.5],
    [0, 0],
    [-0.45, 0.5],
    [-0.15, 0.5],
    [-0.15, 1.1],
];
const arrowShape = new Shape(arrowPoints.map(([x, y]) => new Vector2(x, y)));
const outlinePoints = arrowPoints.map(([x, y]) => [x, y, 0.01]);

export default function MoveTargetIndicator(props) {
    return (
        <YAxisBillboard {...props}>
            <mesh raycast={() => null}>
                <shapeGeometry args={[arrowShape]} />
                <meshBasicMaterial color="#ffd447" side={DoubleSide} toneMapped={false} depthWrite={false} />
            </mesh>
            <Line
                points={outlinePoints}
                color="#d62d25"
                lineWidth={2}
                toneMapped={false}
                depthWrite={false}
                raycast={() => null}
            />
        </YAxisBillboard>
    );
}
