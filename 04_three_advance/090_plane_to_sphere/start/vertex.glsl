
precision mediump float;

#pragma glslify: rotate = require(glsl-rotate);
#pragma glslify: easeBack = require(glsl-easings/back-in-out);

attribute float aDelay;
attribute vec3 sphere;

varying vec2 vUv;
varying float vDelay;

uniform float uProgress;

// 頂点１つづつで実行
// uvの座標も頂点１つづつに紐づいている
void main(){
  vUv = uv;
  vDelay = aDelay;

  // 値がプラスになった頂点から動き始める。uv.yを引いた場合は下から動き始める
  // float delay = easeBack(clamp(uProgress * 2. - uv.y, 0., 1.));
  // float delay = easeBack(clamp(uProgress - (1. - uv.y), 0., 1.));
  float delay = easeBack(clamp(uProgress * 2. - ( 1. - uv.y ), 0., 1.));

  vec3 pos = mix(position, sphere, delay);

  gl_PointSize = 8.;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}



// precision mediump float;

// #pragma glslify: rotate = require(glsl-rotate)

// // position、uv ... 2つともplaneの座標

// varying vec2 vUv;
// varying float vDelay;

// attribute float aDelay; // 斜めの頂点(0〜1の値)
// attribute vec3 sphere;

// uniform float uProgress;


// void main() {
//     vUv = uv; 
//     vDelay = aDelay;

//     // delay...対角線上に遅延時間が設定
//     // (1 - uv.y) ... 上をゼロにしたいので。
// 		// uvのyは上から1、0.9...、0.8...と並んでいるので、逆の0...から引いてやる
//     // float delay = clamp(uProgress * 1.3 - (1. - uv.y) * .3, 0., 1.);
// 		float delay = clamp(uProgress * 2. - (1. - uv.y), 0., 1.);

//     // vec3 pos = mix(position, sphere, uProgress);
//     vec3 pos = mix(position, sphere, delay);

//     gl_PointSize = 8.;
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
// }
