

precision mediump float;

varying vec2 vUv;

uniform sampler2D uTexCurrent;
uniform sampler2D uTexNext;
uniform sampler2D uTexDisp;
uniform float uTick;
uniform float uProgress;
uniform vec2 uNoiseSclale;

float parabola(float x, float k){
  return pow(4. * x * ( 1. - x ), k);
}

// フラグメント１つ１つで実行
void main(){
  vec4 texDisp = texture(uTexDisp, vUv);
  float disp   = texDisp.r; // 画像のrの部分を取得。白なら1、黒なら0が取れてくる

  // 勾配をつける。0、1のときに0を返す。0.5で1を返す。
  disp = disp * parabola(uProgress, 1.);

  vec2 dispUv  = vec2(vUv.x, vUv.y + disp); // 上から引っ張り元に戻す
  vec2 dispUv2 = vec2(vUv.x, vUv.y - disp); // 下から引っ張り元に戻す

  vec4 texCurrent = texture(uTexCurrent, dispUv);
  vec4 texNext    = texture(uTexNext, dispUv2);

  gl_FragColor = mix(texCurrent, texNext, uProgress);
  // gl_FragColor = vec4(texDisp.r, 0., 0., 1.);
  // gl_FragColor = texCurrent;
  // gl_FragColor = texNext;
}



// precision mediump float;

// varying vec2 vUv;

// uniform sampler2D uTexCurrent;
// uniform sampler2D uTexNext;
// uniform sampler2D uTexDisp;
// uniform float uTick;
// uniform float uProgress;
// uniform vec2 uNoiseScale;

// float parabola( float x, float k ) {
//   return pow( 4. * x * ( 1. - x ), k );
// }

// void main() {
//   // 画像を歪ませるためにtexDispを使う。
//   vec4 texDisp = texture(uTexDisp, vUv);
//   float disp = texDisp.r;  // rの部分...要するに白の部分のみを取得

//   // parabola()...第2引数の値で勾配をつける。
//   // 第1引数のuProgressが、0と1の時は0が返る。0.5の時に1が返る(一番歪む)
//   disp = disp * parabola(uProgress, 1.0);

//   // 縦方向のuv座表のみ変化させる
//   vec2 dispUv = vec2(vUv.x, vUv.y + disp);

//   vec2 dispUv2 = vec2(vUv.x, vUv.y - disp); // uProgressが1になるまでここの変化は見えない？

//   // 取得したdispをを追加することで画像を歪ませる。
//   vec4 texCurrent = texture(uTexCurrent, dispUv);
//   vec4 texNext = texture(uTexNext, dispUv2);

//   gl_FragColor = mix(texCurrent, texNext, uProgress);
// }
