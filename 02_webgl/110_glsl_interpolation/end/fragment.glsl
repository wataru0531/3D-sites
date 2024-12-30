precision mediump float;

uniform vec2 uColor;
varying vec2 vVertexPosition;

void main() {
    // vVertexPosition = (0, 0) => (1, 1)
    // 黒: rgb(0, 0, 0)
    vec2 colorTmp = vVertexPosition / 2.0 + 0.5;
    vec4 color = vec4(colorTmp, 0.0, 1.0);
    gl_FragColor = color;
}