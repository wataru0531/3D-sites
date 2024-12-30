precision mediump float;

attribute vec2 aVertexPosition;
varying vec2 vVertexPosition;
// attribute vec3 aVertexColor;
uniform float uTick;

void main() {
    vVertexPosition = aVertexPosition;
    gl_Position = vec4(aVertexPosition, 0.0, 1.0);
}