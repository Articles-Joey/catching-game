import { BufferAttribute, BufferGeometry } from "three";
import createSeededRandom from "@/util/createSeededRandom";

const smoothstep = (value) => value * value * (3 - 2 * value);

export function createTerrain({
    size = 400,
    fieldSize = 30,
    bankWidth = 3,
    riverWidth = 3,
    riverDepth = 3,
    groundHeight = 0,
    waterHeight = -1,
    shorelineAmplitude = 1.6,
    shorelineCornerRadius = 5,
    shorelineSeed = "catching-coast-1",
} = {}) {
    const halfField = fieldSize / 2;
    const amplitude = Math.max(0, shorelineAmplitude);
    const cornerRadius = Math.max(0, shorelineCornerRadius);
    // Leave room for rounded corners and inward bends without cutting into the flat board.
    const shoreSetback = 0.75 + Math.max(
        amplitude,
        cornerRadius * (1 - 1 / Math.SQRT2) + amplitude / Math.SQRT2,
    );
    const shoreHalfSize = halfField + shoreSetback;
    const roundedCore = shoreHalfSize - cornerRadius;
    const outerBank = shoreHalfSize + amplitude + bankWidth * 2 + riverWidth;
    const random = createSeededRandom(shorelineSeed);
    const phases = Array.from({ length: 3 }, () => random() * Math.PI * 2);

    const getShoreDistance = (x, z) => {
        const dx = Math.abs(x) - roundedCore;
        const dz = Math.abs(z) - roundedCore;
        // Signed distance to a rounded square removes the four sharp right-angle turns.
        const roundedDistance = Math.hypot(Math.max(dx, 0), Math.max(dz, 0)) +
            Math.min(Math.max(dx, dz), 0) - cornerRadius;
        const angle = Math.atan2(z, x);
        // Integer angular frequencies close seamlessly around the whole island.
        // Unequal phases create large coves, smaller inlets, and protruding banks.
        const offset = amplitude * (
            Math.sin(angle * 3 + phases[0]) * 0.5 +
            Math.sin(angle * 5 + phases[1]) * 0.3 +
            Math.sin(angle * 9 + phases[2]) * 0.2
        );
        return roundedDistance - offset;
    };

    const getHeight = (x, z) => {
        if (Math.max(Math.abs(x), Math.abs(z)) <= halfField) return groundHeight;
        const distance = getShoreDistance(x, z);
        if (distance <= 0) return groundHeight;
        if (distance < bankWidth) return groundHeight - riverDepth * smoothstep(distance / bankWidth);
        if (distance <= bankWidth + riverWidth) return groundHeight - riverDepth;
        if (distance < bankWidth * 2 + riverWidth) {
            return groundHeight - riverDepth * (1 - smoothstep((distance - bankWidth - riverWidth) / bankWidth));
        }
        return groundHeight;
    };

    return {
        size, fieldSize, halfField, bankWidth, riverWidth, riverDepth,
        shoreHalfSize, outerBank, groundHeight, waterHeight,
        shorelineAmplitude: amplitude, shorelineCornerRadius: cornerRadius, shorelineSeed,
        getShoreDistance, getHeight,
    };
}

export const DEFAULT_TERRAIN = createTerrain();

export function createTerrainGeometry(size, terrain = DEFAULT_TERRAIN, { detail = 1 } = {}) {
    const halfSize = size / 2;
    const denseExtent = Math.min(halfSize, terrain.outerBank + 5);
    const coordinates = new Set([-halfSize, halfSize, 0]);

    // Keep subdivisions dense on both riverbanks and sparse on the distant land.
    for (let value = 0; value <= denseExtent; value += detail) {
        coordinates.add(value);
        coordinates.add(-value);
    }
    for (let value = denseExtent; value < halfSize; value += 10) {
        coordinates.add(value);
        coordinates.add(-value);
    }
    for (const value of [terrain.halfField, terrain.shoreHalfSize, terrain.shoreHalfSize + terrain.bankWidth, terrain.shoreHalfSize + terrain.bankWidth + terrain.riverWidth, terrain.outerBank]) {
        if (value > halfSize) continue;
        coordinates.add(value);
        coordinates.add(-value);
    }

    const axis = [...coordinates].sort((a, b) => a - b);
    const positions = [];
    const uvs = [];
    const indices = [];
    for (const z of axis) {
        for (const x of axis) {
            positions.push(x, terrain.getHeight(x, z), z);
            uvs.push(x / size + 0.5, 0.5 - z / size);
        }
    }
    for (let row = 0; row < axis.length - 1; row++) {
        for (let column = 0; column < axis.length - 1; column++) {
            const a = row * axis.length + column;
            const b = a + 1;
            const c = a + axis.length;
            const d = c + 1;
            indices.push(a, c, b, b, c, d);
        }
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
    geometry.setAttribute("uv", new BufferAttribute(new Float32Array(uvs), 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    return geometry;
}
