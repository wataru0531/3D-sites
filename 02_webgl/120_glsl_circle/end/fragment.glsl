precision mediump float;

uniform vec2 uColor;
varying vec2 vVertexPosition;

void main() {
    // vVertexPosition = (-1, 0) => (1, 1)
    // colorTmp = (0, 0) => (1, 1)
    vec2 p = vVertexPosition;
    p.x = p.x * 2.0;
    p.y = p.y * 1.0;
    float len = length(p) * 2.0;
    float circle = 1. - smoothstep(.98, 1.0, len);
    vec4 color = vec4(circle, 0.0, 0.0, 1.0);
    gl_FragColor = color;
}