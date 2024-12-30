
precision mediump float;

uniform vec3 uDepthColor;   // 深い部分の色
uniform vec3 uSurfaceColor; // 表面の色
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;

// フラグメント１つ１つで実行
void main(){
  // vElevation ... -1 から 1
  // uColorOffset ... .03。   offset...初期値の意味で使う
  // uColorMultiplier ... 9.  multiply...掛け算

  float mixStrengthColor = ( vElevation + uColorOffset ) * uColorMultiplier;

  // mix()... 0 uDepthColor、1 uSurfaceColor となる。
  vec3 color = mix(uDepthColor, uSurfaceColor, mixStrengthColor);
  // vec3 color = mix(uSurfaceColor, uDepthColor, mixStrengthColor);
  
  gl_FragColor = vec4(color, 1.0);
}
