precision mediump float;

#pragma glslify: exponential = require(glsl-easings/exponential-in-out)
#pragma glslify: snoise = require(glsl-noise/simplex/3d)

varying vec2 vUv;
varying float vDelay;
attribute float aDelay;

uniform float uTick;
uniform float uProgress;

void main() {
    vUv = uv;
    vec3 pos = position;

    float n = snoise(vec3(position.xy, uTick * 0.01)) * 0.5 + 0.5;
    float delay = exponential(clamp(uProgress * 2. - aDelay, 0., 1.));
    vDelay = delay;

    pos.x += 100. * n * delay;
    pos.y += 100. * n * delay;
    pos.z += 200. * n * delay;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = 3. * (500. / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}