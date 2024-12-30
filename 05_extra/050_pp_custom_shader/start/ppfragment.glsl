
varying vec2 vUv;

uniform sampler2D tDiffuse;
uniform float uDivide; // .5


void main() {
  // tDiffuse → composerに渡していたこれまでの描画データがテクスチャとして渡ってくる
  vec4 texel = texture2D(tDiffuse, vUv); 

  // テクスチャの色を取得 0 から 1
  // tDiffuseが全ての座標でrが1以上になるとは限らないが、ここでは確実に1以上の値が
  // 取得できるので、下記のようにしている。
  vec4 cYellow = vec4(texel.r, texel.r, 0., 1.);
  vec4 cSkyBlue = vec4(0., texel.r, texel.r, 1.);

  // uDivide(0.5)を越えれば1が返ってくる。超えなければ0が返る
  float stepX = step(uDivide, vUv.x);
  
  // gl_FragColor = vec4(texel.g, 0., 0., 1.);
  gl_FragColor = mix(cYellow, cSkyBlue, stepX);
}
