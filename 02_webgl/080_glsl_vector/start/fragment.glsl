
precision mediump float;

varying vec3 vVertexColor;
uniform vec2 uColor;

void main() {
    float floatVal = 0.5;

    vec4 v1 = vec4(1.0, 1.0, 0.0, 0.0);
    vec4 v2 = vec4(0.0, 0.0, 1.0, 1.0);

    vec4 color = v1 + v2;

    // gl_FragColor = vec4(0.83, 0.35, 0.92, 1.0);
    gl_FlagColor = color;
}