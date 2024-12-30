
precision mediump float;

#pragma glslify: noise2 = require(glsl-noise/simplex/2d);
#pragma glslify: noise3 = require(glsl-noise/simplex/3d);

varying vec2 vUv;
uniform sampler2D uTexCurrent;
uniform sampler2D uTexNext;
uniform float uTick;
uniform float uProgress;
uniform vec2 uNoiseScale;

// 各フラグメント１つ１つで実行
void main(){
  // そのフラグメントでのnの値を取得 -1 〜 1でとれてくる
  float n = noise2(vec2(vUv.x * uNoiseScale.x, vUv.y * uNoiseScale.y));

  n = n * .5 - .5; // -1 〜 0

  n = n + uProgress;

  n = step(0., n); // step()...第1引数の値を第2引数の値が超えれば1を返す

  vec4 texCurrent = texture(uTexCurrent, vUv);
  vec4 texNext    = texture(uTexNext, vUv);

  // nの値が 1 を超えたフラグメントから変化
  gl_FragColor = mix(texCurrent, texNext, n);
  // gl_FragColor = vec4(n, 0., 0., 1.);
}



// void main() {
//   // n ... -1 〜 1の範囲でノイズの値がとれる(小数値)
//   float n = noise2(vec2(vUv.x * uNoiseScale.x, vUv.y * uNoiseScale.y));

//   // nの値を-1〜0の範囲にする
//   n = n * 0.5 - 0.5;

//   // uProgress...0〜1の範囲で増減
//   // uProgressが１となったとき、必ずnの値の範囲は、0 〜 1の範囲
//   n = n + uProgress;

//   // 基本的に1の範囲で値を使いたい場合はstep()を使う
//   // step()...第1引数の値(0.0)を越えれば1が返り、越えなければ0が返る。
//   n = step(0.0, n);

//   vec4 texCurrent = texture(uTexCurrent, vUv);
//   vec4 texNext = texture(uTexNext, vUv);

//   // 0から1になった部分のフラグメントだけ画像が変化して次の画像に変化する
//   gl_FragColor = mix(texCurrent, texNext, n);
// } 
