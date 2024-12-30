
precision mediump float;

#pragma glslify: noise2 = require(glsl-noise/simplex/2d);
#pragma glslify: noise3 = require(glsl-noise/simplex/3d);

varying vec2 vUv;

uniform sampler2D uTex;
uniform float uTick;
uniform vec2 uNoiseScale;

// フラグメント１つ１つで実行
void main(){
  float n = noise3(vec3(vUv.x * uNoiseScale.x, vUv.y * uNoiseScale.y, uTick * 0.01));

  vec4 tex = texture(uTex, vec2(vUv.x + n, vUv.y  + n));
  // vec4 tex = texture(uTex, vUv + n);

  gl_FragColor = tex;
}



// precision mediump float;

// #pragma glslify: noise2 = require(glsl-noise/simplex/2d);
// #pragma glslify: noise3 = require(glsl-noise/simplex/3d);


// // 0, 1, 1, 1, 0, 0, 1, 0
// varying vec2 vUv;
// uniform sampler2D uTex;
// uniform float uTick;

// // ノイズに関するx、yの値
// uniform vec2 uNoiseScale;


// void main() {
//   // uNoiseScaleのxとyを加えて調整
//   float n = noise3(vec3(vUv.x * uNoiseScale.x, vUv.y * uNoiseScale.y, uTick * 0.01));

//   // texture...4次元ベクトルを返す
//   // vUvにノイズの色情報を加える
//   vec4 tex = texture(uTex, vUv + n);
//   // vec4 tex = texture(uTex, vec2(vUv.x + n, vUv.y + n));

//   // gl_FragColor = vec4(n, 0., 0., 1.);
//   gl_FragColor = tex;
// }
