import Tree from "@/components/Models/Tree";
import generateRandomInteger from "@/util/generateRandomInteger";
import { useMemo } from "react";

// Simple seeded random generator
function seededRandom(seed) {
    let value = seed;
    return function () {
        value = (value * 9301 + 49297) % 233280;
        return value / 233280;
    }
}

function SquareOfTrees({ count = 10, areaSize = 50, position = [0, 0, 0], seed = null }) {

    const trees = useMemo(() => {
        const _trees = [];
        
        let randomGen;
        if (seed !== null) {
            randomGen = seededRandom(seed);
        }

        const getRandom = (min, max) => {
            if (seed !== null) {
                return Math.floor(min + randomGen() * (max - min + 1));
            } else {
                return generateRandomInteger(min, max);
            }
        };

        for (let i = 0; i < count; i++) {
            const x = position[0] + getRandom(-areaSize / 1, areaSize / 1);
            const z = position[2] + getRandom(-areaSize / 2, areaSize / 2);
            const scale = getRandom(10, 50) / 10; // 1 to 3

            _trees.push({
                position: [x, position[1], z],
                scale: [scale, scale, scale]
            })
        }
        return _trees;
    }, [count, areaSize, position, seed]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <group>
            {trees.map((tree, i) => (
                <Tree
                    key={i}
                    position={tree.position}
                    scale={tree.scale}
                />
            ))}
        </group>
    )
}

export default SquareOfTrees;