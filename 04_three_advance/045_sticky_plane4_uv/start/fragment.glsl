

precision mediump float;

varying vec2 vUv;
varying float vDelay;

uniform sampler2D uTex;
uniform float uProgress;

// フラグメント１つ１つで実行
void main() {
  // vec4 tex = texture(uTex, vUv);

  // gl_FragColor = tex;
  // gl_FragColor = vec4(1., 0., 0., 1.);
  gl_FragColor = vec4(vDelay, 0., 0., 1.);

  // デバッグ方法
  // uProgressがvDelayより小さい場合は0, 大きい場合は1を返す
  // gl_FragColor = vec4(step(vDelay, uProgress), 0., 0., 1.);
}