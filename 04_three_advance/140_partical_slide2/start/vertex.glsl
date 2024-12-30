
precision lowp float;

#pragma glslify: easeExpo = require(glsl-easings/exponential-out);

attribute float aIntensity; // 0〜1500までの乱数(頂点に紐づく)

varying vec2 vUv;
varying float vProgress;
varying float vAlpha;

uniform float uProgress;

// 頂点１つ1つで実行
void main(){
  vUv = uv;
  const float cameraZ = 1000.;
  vec3 pos = position;

  // 0、1の時は0、0.5の時は1を返す
  float progress = vProgress = 1. - abs(2. * uProgress - 1.);
  progress = easeExpo(progress);

  pos.z = progress * aIntensity; // 最長で1500まで移動

  float xyIntensity = 1000.;

  // ここで使うuv座標は動かすための単なる数値でしかない
  vec2 xyDirection = (uv - .5) * 2.; // uv座表を -1 から 1に
  // vec2 xyDirection = uv;

  // x, y軸の広がり pos.zの値が上がるにつれて広がりが大きくなる 1500で1.5倍
  pos.xy += xyIntensity * xyDirection * pos.z / cameraZ;

  // z軸方向の奥行き mvPosition ... カメラ座標からの位置なので、この時点のz成分は-1000
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.);

  gl_PointSize = 2.2 * (cameraZ / - mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;

  // mvPositionの初期位置は-1000。
  // そこからワールド座標のz軸方向プラスに頂点が動くことで値がプラスされていく
  vAlpha = mix(.1, 1., - mvPosition.z / cameraZ);
}



// precision lowp float;

// // 粒子が手前側に来るとゆっくりになるようなeasing
// #pragma glslify: easeExpo  = require(glsl-easings/exponential-out)

// // aIntensity ... 0 〜 1500までのランダムな値
// attribute float aIntensity;

// varying vec2 vUv;
// varying float vProgress;
// varying float vAlpha;

// uniform float uProgress;

// void main() {
//   vUv = uv;
//   const float cameraZ = 1000.;

//   // 0の時は0、0.5の時は1、1の時は0
//   float progress = vProgress = 1. - abs(2. * uProgress - 1.);

//   // 粒子にeasingをつける(手前に来るとゆっくりになる)
//   progress = easeExpo(progress);

//   vec3 pos = position;

//   // uvの範囲を、-1 〜 1 の範囲に
//   vec2 xyDirection = (uv - .5) * 2.; 
//   // vec2 xyDirection = uv;
//   // vec2 xyDirection = pos.xy;

//   // 粒子の広がり
//   float xyIntensity = 1000.;

//   pos.z = progress * aIntensity; // progress...0.5が最大値1を取る。 aIntensity...0〜1500までの値

//   // 粒子の広がり
//   // pos.z / camaraZ(1000) ... pos.zは時間経過に伴って大きくなる値(0.5が最大値)
//   // pos.zの値が大きくなるほど拡散する値も大きくなっていく
//   pos.xy += xyDirection * xyIntensity * pos.z / cameraZ; 

//   // pos.z = 10.;

//   // modelViewMatrix ... オブジェクトの頂点の座標を視点座標に変換。
//   // 既にオブジェクトの頂点の位置は決定していて、そこにposの頂点の位置に操作を加えていくイメージで実装する
//   vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

//   gl_PointSize = 2.2 * (cameraZ / - mvPosition.z);

//   gl_Position = projectionMatrix * mvPosition;

//   // 手前の粒子を粒子を透明にする。
//   // mvPosition ... 0 〜 1500まで(ランダムな値の最大値が1500なので)
//   // mvPosition ... 手前に来れば来るほど数値が小さい
//   // mvPositionが1000の時?は、オブジェクトが原点にある状態
//   vAlpha = mix(0.1, 1.0, - mvPosition.z / cameraZ);
// }
