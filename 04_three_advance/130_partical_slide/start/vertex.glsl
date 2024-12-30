
precision lowp float;

#pragma glslify: easeBack = require(glsl-easings/back-in-out);
#pragma glslify: easeCubic = require(glsl-easings/cubic-in-out);

attribute float aDelay;

varying vec2 vUv;
varying float vDelay;
varying float vProgress;

uniform float uProgress;

// パラボラを使った場合
float parabola(float x, float k){
  return pow(4. * x * ( 1. - x), k);
}

void main(){
  vUv = uv;
  vDelay = aDelay;

  // uProgress ... 0、1の時は0、0.5の時は1 を返す
  float progress = vProgress = 1. - abs(2. * uProgress - 1.);
  // float progress = vProgress = parabola(uProgress, 1.);

  vec3 pos = position;

  pos.z += progress * 1000.;

  // この時点でposは0の位置にいるが、カメラ座標から見た座標なので、-1000の位置にいることになる。
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.);

  gl_PointSize = 2.2 * ( 1000. / - mvPosition.z );
  gl_Position = projectionMatrix * mvPosition;
}





// precision lowp float;

// #pragma glslify: easeBack = require(glsl-easings/back-in-out)
// #pragma glslify: easeCubic = require(glsl-easings/cubic-in-out)

// attribute float aDelay;

// varying vec2 vUv;
// varying float vDelay;
// varying float vProgress;

// uniform float uProgress;

// void main() {
//   vUv = uv;
//   vDelay = aDelay;

//   // abs()...絶対値を返す
//   // uProgressの値が、0の時は0、0.5の時は1、1の時は0を返す
//   float progress = vProgress = 1. - abs(2. * uProgress - 1.);

//   vec3 pos = position;

//   // pos.zの初期値は0だが、カメラからの距離は1000。
//   pos.z += progress * 1000.;

//   // オブジェクト座標...オブジェクトが0、カメラが1000の位置
//   // 視点座標       ...カメラが0     、オブジェクトが-1000の位置
//   // moelViewMatrixをかけると視点座標に切り替わり、視点からの距離になる。
//   // カメラからオブジェクトも見るので、オブジェクトはマイナスになる。
//   vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

//   // mvPositionの初期位置 ... カメラから見て -1000
//   // これに、progress * 1000 のプラスの値がプラスされていく
//   gl_PointSize = 2.2 * (1000. / -mvPosition.z);
//   gl_Position = projectionMatrix * mvPosition;
// }
