import { useGLTF } from "@react-three/drei";
import { getTreeResources } from "./treeResources";
import { useStore } from "@/hooks/useStore";
import ToontownTree from "./ToontownTree";

const TREE_MODEL = "/models/Tree-transformed.glb";

function RealisticTree(props) {
    const { nodes } = useGLTF(TREE_MODEL);
    const { trunk, foliage, barkMaterial, foliageMaterial } = getTreeResources(
        nodes["tree-spruce"].geometry,
    );

    // Resources are shared with every tree using this cached GLTF geometry.
    return (
        <group
            {...props}
            dispose={null}
        >
            <mesh
                castShadow
                receiveShadow
                name="tree-trunk"
                userData={{ cameraObstacle: true }}
                geometry={trunk}
                material={barkMaterial}
            />
            <mesh
                name="tree-foliage"
                userData={{ cameraObstacle: true }}
                castShadow
                receiveShadow
                geometry={foliage}
                material={foliageMaterial}
            />
        </group>
    );
}

export default function Tree(props) {
    const toontownMode = useStore((state) => state.toontownMode);
    return toontownMode ? <ToontownTree {...props} /> : <RealisticTree {...props} />;
}

useGLTF.preload(TREE_MODEL);
