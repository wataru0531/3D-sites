varying vec2 vUv;
uniform sampler2D uTex;

void main() {
    // vVertexPosition = (-1, 0) => (1, 1)
    // colorTmp = (0, 0) => (1, 1)
    vec2 center = vec2(0.5 * 2.0, 0.5);
    vec2 p = vUv;
    p.x = p.x * 2.0;
    // p.y = p.y * 1.0;
    float len = distance(p, center) * 4.0;
    float circle = 1. - smoothstep(.98, 1.0, len);
    vec4 texColor = texture(uTex, vUv);
    vec4 color = texColor * circle;

    gl_FragColor = color;
    // gl_FragColor = texColor;
}