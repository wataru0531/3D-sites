precision mediump float;

#pragma glslify: noise2 = require(glsl-noise/simplex/2d);
#pragma glslify: noise3 = require(glsl-noise/simplex/3d);

varying vec2 vUv;
uniform sampler2D uTex;
uniform float uTick;

void main() {

  // 通常のノイズ
  float n = noise2(vUv);

  // より細かく
  n = noise2(vUv * 100.);

  // 時間が経つにつれて細かく
  n = noise2(vUv * uTick * 0.1);

  // ノイズを移動
  n = noise2(vUv * 10. - uTick * 0.01);

  // x方向に移動
  n = noise2(vec2(vUv.x * 10. - uTick * 0.01, vUv.y * 10.));

  // 波のように揺れる
  n = noise2(vec2(vUv.x * 100. - sin(vUv.y + uTick / 100.), vUv.y * 10. - sin(vUv.x + uTick / 100.)));

  // 模様を変化させる
  n = noise3(vec3(vUv * 10., uTick * 0.01));

  // ヨコシマのノイズ
    n = noise3(vec3(vUv.x * 10., vUv.y * 50., uTick * 0.01));

  gl_FragColor = vec4(n, 0., 0., 1.);
}