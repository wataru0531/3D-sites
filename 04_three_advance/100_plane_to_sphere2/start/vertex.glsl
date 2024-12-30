
// ポイントの奥行きまで考慮する
// → カメラに近ければ大きく、遠ければ小さい

precision mediump float;

#pragma glslify: easeBack = require(glsl-easings/back-in-out);

attribute float aDelay;
attribute vec3 sphere;

varying vec2 vUv;
varying float vDelay;

uniform float uProgress;

// 頂点１つ１つで実行される。
// クリップ座標だけでなく、uv座標も
void main(){
  vUv = uv;
  vDelay = aDelay;

  float x = clamp(uProgress * 2. - (1. -uv.y), 0., 1.);
  float delay = easeBack(x);

  vec3 pos = mix(position, sphere, delay);

  // object座標から視点座標にシフト。視点からなのでマイナスに(ここでは-1000)
  // 各position１つづつが入ってくる
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.);

  gl_PointSize = 8. * ( 1000. / - mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}




// precision mediump float;

// #pragma glslify: easeBack = require(glsl-easings/back-in-out)
// #pragma glslify: easeCubic = require(glsl-easings/cubic-in-out)
// #pragma glslify: rotate = require(glsl-rotate)

// varying vec2 vUv;
// varying float vDelay;

// attribute float aDelay;
// // attribute vec3 plane;
// attribute vec3 sphere;

// uniform float uProgress;
// uniform float uScaleDelay;
// uniform float uScaleTime;

// void main() {
//     vUv = uv;
//     vDelay = aDelay;
    
//     // 既にuv座標も配置されている。
//     // uProgressが増加していき、プラスになった頂点から動いていくので小さい値であるuv座標から変化していく
//     float delay = easeBack(clamp(uProgress * 2. - (1. - uv.y ), 0., 1.));
//     // float delay = easeBack(clamp(uProgress * 2. - uv.y, 0., 1.));

//     vec3 pos = mix(position, sphere, delay);

//     // PointSizeの遠近感を出す
//     // 視点座標になるとカメラから見た座標になるのでz軸がマイナスに
//     // mvPosition...この時点では、視点座標(オブジェクト座標が視点座標まで変換された座表)
//     // 多分posの値が大きくなれば、modelViewMatrixのz軸にかける値である-1000が小さくなるかうまくやっている？
//     vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

//     // 視点座標におけるpositionの位置を取得してPointSizseの大きさを決定する
//     // mvPosition.zは全てマイナスで渡ってくる。それにマイナスとしているのでプラスとなる。
//     // 1000から割るので手前の頂点は大きくなり、遠くの頂点は小さくなる。
//     // 例　1000 / 700の位置の点 = 1.42。1000 / 800の位置の点 = 1.25。遠くにある点ほど小さくなる
//     gl_PointSize = 7. * (1000. / - mvPosition.z); 

//     gl_Position = projectionMatrix * mvPosition;
// }
