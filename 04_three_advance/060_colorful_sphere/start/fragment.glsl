

precision mediump float;

varying vec2 vUv;
varying float vDelay;

uniform sampler2D uTex;
uniform float uProgress;

// フラグメント１つ１つで実行
void main(){
  if(length(gl_PointCoord - vec2(.5, .5)) > .5){
    discard;
  }

  // distance の場合
  // if(distance(gl_PointCoord, vec2(.5, .5)) > .5){
  //   discard;
  // }

  // vUvでマッピング
  // → メッシュ全体での0から1の座標で取得
  // vec4 tex = texture(uTex, vUv);

  // vUvでマッピングするのではなくて、gl_PointCoordでマッピング
  // → 各頂点での0から1で取得
  vec4 tex = texture(uTex, gl_PointCoord);

  // gl_FragColor = vec4(vDelay, 0., 0., 1.);

  // step ... uProgressの値を超えたらvDelayの色がつく
  // gl_FragColor = vec4(0., step(uProgress, vDelay), 0., 1.);
  gl_FragColor = tex;
}





// precision mediump float;

// varying vec2 vUv;
// varying float vDelay;

// uniform sampler2D uTex;
// uniform float uProgress;

// // gl_PointCoordについての説明
// // https://khronos.org/registry/OpenGL-Refpages/gl4/html/gl_PointCoord.xhtml

// void main() {

//   // 四角形を丸く(半径の外側を破棄する)
//   // gl_PointCoord...1つの四角形の 0 〜 1 の値(左下が0, 0 で右上は1, 1)。直径の長さが1。
//   if(length(gl_PointCoord - vec2(0.5, 0.5)) > 0.5){
//     // distance(gl_PointCoord, vec2(0.5, 0.5)) > 0.5 でもOK

//     // discard...フラグメントの色情報を破棄(中心から0.5以上の長さを持つフラグメントを破棄)
//     discard;
//   }

//   vec4 tex = texture(uTex, vUv);
  
//   gl_FragColor = vec4(vDelay, 0.0, 0.0, 1.0);
//   // gl_FragColor = tex;
// }
