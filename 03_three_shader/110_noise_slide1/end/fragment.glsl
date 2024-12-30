precision mediump float;

#pragma glslify: noise2 = require(glsl-noise/simplex/2d);
#pragma glslify: noise3 = require(glsl-noise/simplex/3d);

varying vec2 vUv;
uniform sampler2D uTexCurrent;
uniform sampler2D uTexNext;
uniform float uTick;
uniform float uProgress;
uniform vec2 uNoiseScale;

void main() {

  // ヨコシマのノイズ
   float n = noise3(vec3(vUv.x * uNoiseScale.x, vUv.y * uNoiseScale.y, uTick * 0.01));

  vec4 texCurrent = texture(uTexCurrent, vUv);
  vec4 texNext = texture(uTexNext, vUv);
  gl_FragColor = mix(texCurrent, texNext, uProgress);
}