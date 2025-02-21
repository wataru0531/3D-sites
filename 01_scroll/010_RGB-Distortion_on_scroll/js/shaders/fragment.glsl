
precision mediump float;

uniform sampler2D uTexture;
uniform float uAlpha;
uniform vec2 uOffset; // (x: .0, -(target - current) * .0003)
                      // 下スクロールでマイナスな値
varying vec2 vUv;

vec3 rgbShift(sampler2D textureImage, vec2 uv, vec2 offset) {
  // uvのx → 変化なし
  // uvのy → 変化あり

  // 白い部分 → 下にスクロールした場合は、黒い部分の値を引くことになる。
  //           そのrを取得して付与huyo
  // → 青くなるのは白い部分の(1, 1, 1, 1)から、offsetの値を少し引くので青く見える(下スクロール時)
  float r = texture(textureImage, uv + offset).r;

  vec2 gb = texture(textureImage, uv).gb; // 通常のgbの値をとる

  return vec3(r, gb);
}

void main() {
  vec3 color = rgbShift(uTexture, vUv, uOffset);

  gl_FragColor = vec4(color, uAlpha);
  // gl_FragColor = vec4(1, 0. ,0., 1.);
}
