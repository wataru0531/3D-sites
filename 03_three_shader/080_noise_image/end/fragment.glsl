precision mediump float;

#pragma glslify: noise2 = require(glsl-noise/simplex/2d);
#pragma glslify: noise3 = require(glsl-noise/simplex/3d);

varying vec2 vUv;
uniform sampler2D uTex;
uniform float uTick;
uniform vec2 uNoiseScale;

void main() {

  // ヨコシマのノイズ
   float n = noise3(vec3(vUv.x * uNoiseScale.x, vUv.y * uNoiseScale.y, uTick * 0.01));

  vec4 tex = texture(uTex, vUv + n);
  gl_FragColor = tex;
}