

precision mediump float;

#pragma glslify: easeBack = require(glsl-easings/back-in-out);
#pragma glslify: easeBounce = require(glsl-easings/bounce-in-out);

attribute float aDelay;

varying vec2 vUv;
varying float vDelay;

uniform float uProgress;

// main関数は各頂点で実行される
void main(){
  vUv = uv;
  vDelay = aDelay;

  vec3 pos = position;

  // aDelayの値を超えた時に頂点が動き出す。
  // aDelayの値が小さければ小さいほど、傾きが緩やかになる。
  
  // float progress = uProgress - aDelay;
  // float progress = clamp(uProgress - aDelay, 0., 1.);
  float progress = clamp(uProgress * 1.3 - aDelay * .3, 0., 1.);

  pos.z = progress * 250.;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}




// // easing読み込み 緩急をつける
// // 注 JavaScript側ではuniformの値に対してはeasingをつけるのはいいが、
// // glslの頂点自体にはGPUを使った方が効率的なのでここでつける。

// // https://github.com/glslify/glsl-easings
// #pragma glslify: easeBack = require(glsl-easings/back-in-out)
// // bounce-in-out  circular-in-out  sine-in-out などがある

// // #pragma glslify: easeBack = require(glsl-easings/bounce-in-out)

// attribute float aDelay;

// varying vec2 vUv;
// varying float vDelay;

// uniform float uProgress;

// void main() {
//     vUv = uv;
//     vDelay = aDelay;

//     vec3 pos = position;

//     // uProgress... 0 〜 1、 aDelay... 0 〜 1、 aDelay * 0.3 ... 0 〜 0.3の値に

//     // clamp()...0〜1の範囲で値を返すようにする。最小値は0、最大値を1とする
//     // float progress = uProgress - aDelay;
//     // float progress = clamp(uProgress - aDelay, 0., 1.);
//     // float progress = clamp(uProgress - aDelay * .3, 0., 1.);

//     // を0から1の範囲にすることで真っ直ぐに並ぶ
//     float progress = clamp(uProgress * 1.3 - aDelay * .3, 0., 1.);
    
//     // float progress = easeBack(clamp(uProgress * 1.3 - aDelay * .3, 0., 1.));

// 		pos.z += progress * 250.;

//     gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
// }
