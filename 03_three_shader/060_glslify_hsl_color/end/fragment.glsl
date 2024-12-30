varying vec2 vUv;
uniform sampler2D uTex;
uniform float uTick;

#pragma glslify: hsl = require(glsl-hsl2rgb)

void main() {
    float time = uTick * 0.01;
    vec3 rgb = hsl(fract(vUv.x - time), 1., 0.5);
    vec4 color = vec4(rgb, 1.0);
    gl_FragColor = color;
}