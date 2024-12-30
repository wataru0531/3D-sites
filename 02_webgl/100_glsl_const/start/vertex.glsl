


precision mediump float;

attribute vec2 aVertexPosition; // 1, 0, -1, -1, -1, 1
attribute vec3 aVertexColor; // 1, 0, 0, 0, 1, 0, 0, 0, 1

varying vec3 vVertexColor;
uniform float uTick;


void main() {
    vec2 p = aVertexPosition;
    vVertexColor = aVertexColor;
    
    gl_Position = vec4(aVertexColor.xy, 0.0, 1.0);
}

