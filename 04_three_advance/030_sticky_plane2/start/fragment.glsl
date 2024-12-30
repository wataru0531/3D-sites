

precision mediump float;

varying vec2 vUv;
varying float vDelay;

// main関数は各フラグメントで実行
void main(){

  gl_FragColor = vec4(vDelay, 0., 0., 1.);
}
