precision mediump float;

#pragma glslify: easeBack = require(glsl-easings/back-in-out)
#pragma glslify: easeCubic = require(glsl-easings/cubic-in-out)

#pragma glslify: rotate = require(glsl-rotate)

varying vec2 vUv;
varying float vDelay;
attribute float aDelay;
// attribute vec3 plane;
attribute vec3 sphere;

uniform float uProgress;
uniform float uScaleDelay;
uniform float uScaleTime;

void main() {
    vUv = uv;
    vDelay = aDelay;
    float delay = easeBack(clamp(uProgress * 2. - (1. - uv.y ), 0., 1.));
    vec3 pos = mix(position, sphere, delay);
    // float delta = sin(uTick * uScaleTime - uv.y * uScaleDelay) * 0.5 + 0.5;
    // pos += 40. * normal * delta;


    gl_PointSize = 10.;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}