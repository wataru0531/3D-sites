// 座標
// {x, y, z, w}
// 色
// {r, g, b, a}
// テクスチャ座標
// {s, t, p, q}
precision mediump float;
varying vec3 vVertexColor;
uniform vec2 uColor;

#define PI 3.14
#define PI2 PI * 2.0

void main() {
    // const float PI = 3.14;
    // const float PI2 = PI * 2.0;
    vec4 color = vec4(1.0, 1.0 / (PI * 2.0), 0.5, 1.0);
    gl_FragColor = color;
}