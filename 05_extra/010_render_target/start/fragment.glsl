


precision mediump float;

varying vec2 vUv;

// レンダーターゲット(フレームバッファオブジェクト)に格納した描画データ
uniform sampler2D tDiffuse;

// フラグメント毎に実行
void main(){

  vec4 texColor = texture(tDiffuse, vUv);

  gl_FragColor = texColor;
}