

precision mediump float;

#pragma glslify: easeBack = require(glsl-easings/back-in-out)
#pragma glslify: easeCubic = require(glsl-easings/cubic-in-out)

#pragma glslify: rotate = require(glsl-rotate)

attribute float aDelay;

varying vec2 vUv;
varying float vDelay;

uniform float uProgress;


void main() {
    vUv = uv;
    vDelay = aDelay;

    vec3 pos = position;

    // aDelay => 0 ~ 1   aDelay * 0.3=> 0 ~ 0.3
    float delay = clamp(uProgress * 1.2 - aDelay * 0.2, 0., 1.);
    float progress = easeCubic(delay);

    gl_PointSize = 8.;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}