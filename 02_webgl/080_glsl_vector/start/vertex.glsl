
precision mediump float;

attribute vec2 aVertexPosition;
attribute vec3 aVertexColor;

varying vec3 vVertexColor;
uniform float uTick;


void main() {
    
    gl_Position = vec4(aVertexPosition, 0.0, 1.0);
}
