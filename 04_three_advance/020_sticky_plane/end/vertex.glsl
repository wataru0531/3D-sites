precision mediump float;

varying vec2 vUv;
varying float vDelay;
attribute float aDelay;

void main() {
    vUv = uv;
    vDelay = aDelay;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}