import { Color } from "three";

const shorelineShader = /* glsl */ `
    varying vec3 vShorePosition;
    uniform float shoreGroundHeight;
    uniform float shoreWaterHeight;
    uniform float shoreStylized;
    uniform vec3 shoreSandColor;
    uniform vec3 shoreGravelColor;

    float shoreHash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float shorePebbles(vec2 p) {
        vec2 cell = floor(p);
        vec2 f = fract(p);
        float nearest = 10.0;
        float tint = 0.5;
        for (int y = -1; y <= 1; y++) {
            for (int x = -1; x <= 1; x++) {
                vec2 neighbor = vec2(float(x), float(y));
                vec2 seed = cell + neighbor;
                vec2 center = vec2(shoreHash(seed), shoreHash(seed + 17.3)) * 0.6 + 0.2;
                float distanceToStone = length(neighbor + center - f);
                if (distanceToStone < nearest) {
                    nearest = distanceToStone;
                    tint = shoreHash(seed + 41.7);
                }
            }
        }
        return 0.72 + tint * 0.4 - smoothstep(0.32, 0.64, nearest) * 0.18;
    }
`;

// Extend both imported grass materials, retaining their lights and shadow handling.
export function addShorelineBlend(material, terrain, stylized = false) {
    const compileGrass = material.onBeforeCompile;
    const grassCacheKey = material.customProgramCacheKey();
    const uniforms = {
        shoreGroundHeight: { value: terrain.groundHeight },
        shoreWaterHeight: { value: terrain.waterHeight },
        shoreStylized: { value: stylized ? 1 : 0 },
        shoreSandColor: { value: new Color("#d9c087") },
        shoreGravelColor: { value: new Color("#86827a") },
    };

    material.onBeforeCompile = (shader, renderer) => {
        compileGrass.call(material, shader, renderer);
        Object.assign(shader.uniforms, uniforms);
        shader.vertexShader = shader.vertexShader
            .replace("#include <common>", "#include <common>\nvarying vec3 vShorePosition;")
            .replace("#include <begin_vertex>", "#include <begin_vertex>\nvShorePosition = (modelMatrix * vec4(transformed, 1.0)).xyz;");
        shader.fragmentShader = shader.fragmentShader
            .replace("#include <common>", `#include <common>\n${shorelineShader}`)
            .replace("#include <roughnessmap_fragment>", /* glsl */ `
                // Height makes the same fade run down each bank toward the water.
                // Finish the gravel transition above the waterline, so it remains visible.
                float shoreDepth = max(shoreGroundHeight - shoreWaterHeight, 0.001);
                float shoreProgress = clamp((shoreGroundHeight - vShorePosition.y) / shoreDepth, 0.0, 1.0);
                float shoreSandBlend = smoothstep(0.04, 0.38, shoreProgress);
                float shoreGravelBlend = smoothstep(0.52, 0.92, shoreProgress);
                // Avoid the pebble lookup on the much larger grassy part of the terrain.
                if (shoreSandBlend > 0.0) {
                    vec2 shoreUV = vShorePosition.xz;
                    float shoreDetailFade = 1.0 - smoothstep(35.0, 100.0, length(vViewPosition));
                    float sandGrain = shoreHash(floor(shoreUV * 90.0)) - 0.5;
                    vec3 sand = shoreSandColor * (1.0 + sandGrain * mix(0.2, 0.08, shoreStylized) * shoreDetailFade);
                    diffuseColor.rgb = mix(diffuseColor.rgb, sand, shoreSandBlend);
                    if (shoreGravelBlend > 0.0) {
                        float pebbles = shorePebbles(shoreUV * mix(10.0, 6.0, shoreStylized));
                        vec3 gravel = shoreGravelColor * mix(1.0, pebbles, shoreDetailFade);
                        diffuseColor.rgb = mix(diffuseColor.rgb, gravel, shoreGravelBlend);
                    }
                }
                #include <roughnessmap_fragment>
                roughnessFactor = mix(roughnessFactor, 1.0, shoreSandBlend);
            `)
            .replace("#include <normal_fragment_maps>", /* glsl */ `
                #include <normal_fragment_maps>
                // The realistic grass normal map fades out with the grass itself.
                normal = normalize(mix(normal, nonPerturbedNormal, shoreSandBlend));
            `);
    };
    material.customProgramCacheKey = () => `${grassCacheKey}:catching-shoreline-v1:${stylized}`;
    return material;
}
