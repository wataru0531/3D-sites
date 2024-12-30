
precision mediump float;

varying vec2 vUv;
varying float vElevation;

uniform vec3 uColor;
uniform sampler2D uTexture;


// フラグメントごとに実行
void main(){
  // vUv...オブジェクトを包む包み紙のようなイメージ
  vec4 textureColor = texture2D(uTexture, vUv);

  // gl_FragColor = vec4(uColor, 1.0);

  // vElevation...-1から1の範囲?。
  // 多分1を超えるピクセルには色がつく。そうではないピクセルは黒くなる
  textureColor.rgb *= vElevation * 3.0 + 0.7;
  // textureColor.rgb *= vElevation;
  
  gl_FragColor = textureColor;
  // gl_FragColor = vec4(vUv, 0., 1.);
}