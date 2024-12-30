precision mediump float;

uniform vec2 uColor;
varying vec2 vVertexPosition;

void main() {
    vec2 uv = vVertexPosition / 2.0 + 0.5;
    // uv (0, 0) => (1, 1)
    vec4 rgba1 = vec4(.2, .3, .4, 1.);
    vec4 rgba2 = vec4(.8, .3, .2, 1.);
    // mixの計算
    // uv.x = 0;
    // rgba1 * 1.0 + rgba2 * 0.0
    
    // uv.x = 0.5;
    // rgba1 * 0.5 + rgba2 * 0.5

    // uv.x = 1;
    // rgba1 * 0.0 + rgba2 * 1.0
    uv.x = step(0.3, uv.x);
    vec4 color = mix(rgba1, rgba2, uv.x);
    gl_FragColor = color;
}