precision mediump float;

#pragma glslify: easeBack = require(glsl-easings/back-in-out)
#pragma glslify: easeCubic = require(glsl-easings/cubic-in-out)

#pragma glslify: rotate = require(glsl-rotate)

varying vec2 vUv;
varying float vDelay;
attribute float aDelay;

uniform float uTick;
uniform float uScaleDelay;
uniform float uScaleTime;

void main() {
    vUv = uv;
    vDelay = aDelay;
    vec3 pos = position;

    float delta = sin(uTick * uScaleTime - uv.y * uScaleDelay) * 0.5 + 0.5;
    pos += 40. * normal * delta;

    gl_PointSize = 10. * delta;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}