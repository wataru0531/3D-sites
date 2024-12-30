precision mediump float;

uniform vec2 uColor;
varying vec2 vVertexPosition;

void main() {
    // vVertexPosition = (-1, 0) => (1, 1)
    // uv = (0, 0) => (1, 1)
    vec2 p = vVertexPosition;
    p.x = p.x * 2.0;
    p.y = p.y * 1.0;
    float len = length(p) * 2.0;
    float circle = 1. - smoothstep(.98, 1.0, len);
    vec2 uv = vVertexPosition / 2.0 + 0.5;
    uv *= circle;
    vec4 color = vec4(uv, 0.0, 1.0);
    gl_FragColor = color;
}