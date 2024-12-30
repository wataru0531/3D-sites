
precision mediump float;

varying vec2 vVertexPosition; // -1, -1,   1, 0,   -1, 1

void main(){
  vec2 uv = vVertexPosition * .5 + .5;

  vec4 rgba1 = vec4(1., 0., 0., 1.);
  vec4 rgba2 = vec4(1., 1., 0., 1.);

  uv = step(.3, uv);

  // vec4 color = mix(rgba1, rgba2, step(.1, uv.x));

  vec4 color = vec4(uv, 0., 1.);

  // gl_FragColor = color;
  gl_FragColor = color;
}



// precision mediump float;

// // -1, -1,   1, 0,   -1, 1
// varying vec2 vVertexPosition;

// void main() {
//   // uv (0, 0) => (1, 1)
//   vec2 uv = vVertexPosition / 2.0 + 0.5;
  
//   vec4 rgba1 = vec4(1.0, 0.0, 0.0, 1.0);
//   vec4 rgba2 = vec4(0.0, 1.0, 0.0, 1.0);

//   // uv.xの0.0から0.299...までを0.0にして返す
//   // uv.xの値が0.3を超えたら1.0を返す
//   // uv.x = step(0.3, uv.x);

//   // mix()...第3引数の方向に、2つの色を掛け合わせる。
//   // 第3引数には徐々に移り変わる色を設定
//   // uv.xが0の時はrgba1を取り、uv.xが1の時はrgba2を取る。
//   // uv.xが0.5の時は、rgbaの中間の値を取る。
//   vec4 color = mix(rgba1, rgba2, uv.x);

//   // vec4 color = mix(rgba1, rgba2, step(.2, uv.x));
//   // step ... uv.xが.2以下なら0を返す。.uv.xがga.2以上なら1を返す

//   gl_FragColor = color;
//   // gl_FragColor = vec4(uv, 0.0, 1.0);
// }
