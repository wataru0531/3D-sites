
precision mediump float;

// composerに渡されてきたこれまでの描画結果の画面全体のuv座標
// → ここでいうuvも通常のuvと変わりなく、画面全体を覆う座標系で、左下が (0, 0)、右上が (1, 1) となるUV空間
varying vec2 vUv;

// tDiffuse → RenderPassで読み込んだ通常のシーンから、
// これまで追加してきたエフェクトがテクスチャとして渡ってくる
uniform sampler2D tDiffuse; 
uniform sampler2D texRipple;

void main(){
  // → rtCameraでrtSceneを写した全体をテクスチャとして取得
  vec4 ripple = texture(texRipple, vUv);

  // 波紋が立っているところの座標をずらす
  // ripple.rとしているのは色のついている部分のみ取得。黒い部分は無視する
  // * .1 → 色のついている部分は歪むので範囲を小さくする
  // rippleは画面全体をテクスチャとして取得してくるので、rippleの紋様以外は0になる  
  vec2 rippleUv = vec2(vUv.x + ripple.r * .1, vUv.y + ripple.r * .1);

  // tDiffuseはcomposerに渡してきた通常のシーンからこれまでレンダリングしてきたエフェクトが１つとなりテクスチャ
  // として渡ってきたもの。
  // 波紋によって変位したrippleUvを使い、シーン全体のレンダリング結果tDiffuseから色をサンプリング
  // → この操作により、波紋エフェクトを適用した最終的な色が計算され、フラグメントの色として設定さる
  vec4 color = texture(tDiffuse, rippleUv);
  vec4 tD = texture(tDiffuse, vUv);

  gl_FragColor = color;
  // gl_FragColor = ripple; // rippleだけが表示される
  // gl_FragColor = tD; // これまでレンダリングしてきた画面
}
