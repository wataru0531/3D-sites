

varying vec2 vUv;

 // delay → 対角線上に遅延する値
varying float vDelay;

uniform sampler2D uTex;


void main() {
  vec4 tex = texture(uTex, vUv);

  // vDelay 初期状態は0。
  // uProgressの値が1になると消えるようにしたいので、1. - vDelay とする
  gl_FragColor = vec4(tex.rgb, 1. - vDelay);

  // gl_FragColor = tex;
}
