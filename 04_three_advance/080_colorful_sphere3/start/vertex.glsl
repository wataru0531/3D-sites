
precision mediump float;

attribute float aDelay;

varying vec2 vUv;
varying float vDelay;

uniform float uTick;
uniform float uScaleTime;
uniform float uScaleDelay;

// 頂点１つ１つで実行
void main(){
  vUv = uv;
  vDelay = aDelay;

  vec3 pos = position;

  // uvのy軸に時差をつける(aDelayの頂点は変更しない)  delta...差分
  // uvの頂点もその頂点で１つづつ実行
  float delta = sin(uTick * uScaleTime - uv.y * uScaleDelay) * .5 + .5;

  pos += normal * delta * 40.;

  gl_PointSize = 10. * delta;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}


// precision mediump float;

// attribute float aDelay;

// varying vec2 vUv;
// varying float vDelay;

// uniform float uTick;
// uniform float uScaleTime;
// uniform float uScaleDelay;

// void main() {
//     vUv = uv;
//     vDelay = aDelay;
//     vec3 pos = position;
    
//     // 時間軸に応じてdelayがかかる。
//     // 上から下に波を伝えたいのでuv.yに波の時差をつけるようにする
//     float delta = sin(uTick * uScaleTime - uv.y * uScaleDelay) * .5 + .5;
//     // float delta = sin(uTick * uScaleTime - aDelay * uScaleDelay) * .5 + .5; // 頂点を引いている

//     // normal...球面に対して直行するベクトル
//     pos += 40. * normal * delta;
    
//     gl_PointSize = 10.0 * delta;

//     gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
// }