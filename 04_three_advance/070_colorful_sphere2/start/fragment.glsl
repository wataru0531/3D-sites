
precision mediump float;

#pragma glslify: hsl2rgb = require(glsl-hsl2rgb);

varying vec2 vUv;
varying float vDelay;

uniform sampler2D uTex;
uniform float uProgress;
uniform float uTick;
uniform float uSaturation;
uniform float uLightness;
uniform float uColorDelay;
uniform float uColorTime;

// 各フラグメント１つ１つで実行(ここでは球1つ１つで実行)
void main(){
  if(length(gl_PointCoord - vec2(.5, .5)) > .5){
    discard;
  }
  
  // vDelay ... 対角線上に走る数値。
  // フラグメント１つ１つに紐づいているので、遅延を付けたvDelay(さらに遅延をつけたuColorDelayをかけて)を引くことでさまざまな色に変化する
  float hue = sin(uTick * uColorTime - vDelay * uColorDelay) * .5 + .5;
  // float hue = sin(uTick * 0.01) * .5 + .5;

  // float hue = vDelay;

  vec3 rgb = hsl2rgb(hue, uSaturation, uLightness);

  gl_FragColor = vec4(rgb, 1.);

  // デバッグ
  // gl_FragColor = vec4(0., uProgress - vDelay, 0., 1.);
  // gl_FragColor = vec4(vDelay, 0., 0., 1.);
}


// precision mediump float;

// varying vec2 vUv;
// varying float vDelay;

// uniform sampler2D uTex;
// uniform float uProgress;
// uniform float uTick;
// uniform float uSaturation;
// uniform float uLightness;
// uniform float uColorTime;
// uniform float uColorDelay;

// #pragma glslify: hsl2rgb = require(glsl-hsl2rgb)

// // gl_PointCoordについての説明
// // https://khronos.org/registry/OpenGL-Refpages/gl4/html/gl_PointCoord.xhtml

// void main() {

//   // gl_PointCoord...各Pointのこと
//   if(distance(gl_PointCoord, vec2(0.5, 0.5)) > 0.5) {

//     discard; // 各ポイントの0.5以上の部分を破棄
//   }
//   vec4 tex = texture(uTex, gl_PointCoord);

//   // 頂点の時間によって遅延時間が発生するsinカーブを作る
//   // vDelay...頂点の座標によって遅延時間を発生させる頂点
//   // * 0.5 + 0.5 ... 0 〜 1 の範囲にする(hslに推奨)
//   float hue = sin(uTick * uColorTime - vDelay * uColorDelay) * 0.5 + 0.5;
  
//   // HSLでrgb定義
//   // vec3 rgb = hsl2rgb(75.0 / 360.0, 0.5, 0.25);
//   vec3 rgb = hsl2rgb(hue, uSaturation, uLightness);

//   gl_FragColor = vec4(rgb, 1.0);
//   // gl_FragColor = vec4(vDelay, 0., 0., 1.);
//   // gl_FragColor = tex;
// }