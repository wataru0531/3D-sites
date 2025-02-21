

precision mediump float;

varying vec2 vUv;

uniform float progress;

float PI = 3.141529;

void main(){
  vec2 newUv = vUv;
  float bottom = 1. - progress;
  float curveStrength = 1.;
  float waveStrength = 1.;

  // 0から1までの範囲で波形(サイン波)を生成
  // xが0の時は0、.5の時に1、1の時に0が返る
  // 2π: 360°、π: 180°
  // float curve = progress + (sin(newUv.x * PI * waveStrength) * progress - progress) * bottom * curveStrength;
  float curve = progress + (sin(newUv.x * PI) * progress - progress) * bottom;
  float color = step(curve, newUv.y); // newUv.yがcurveを超えたら1を返す

  gl_FragColor = vec4(color, color, color, 1.);
}




// precision mediump float;

// varying vec2 vUv;

// // レンダーターゲット(フレームバッファオブジェクト)に格納した描画データ
// uniform sampler2D tDiffuse;

// // フラグメント毎に実行
// void main(){

//   vec4 texColor = texture(tDiffuse, vUv);

//   gl_FragColor = texColor;
// }