precision lowp float;

#pragma glslify: easeBack = require(glsl-easings/back-in-out)
#pragma glslify: easeCubic = require(glsl-easings/cubic-in-out)

attribute float aDelay;

varying vec2 vUv;
varying float vDelay;
varying float vProgress;

uniform float uProgress;

void main() {
    vUv = uv;
    vDelay = aDelay;
    float progress = vProgress = 1. - abs(2. * uProgress - 1.);
    vec3 pos = position;
    // float delay = easeBack(clamp(uProgress * 2. - (1. - uv.y ), 0., 1.));
    // vec3 pos = mix(position, sphere, delay);
    pos.z += progress * 1000.;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = 2.2 * (1000. / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}