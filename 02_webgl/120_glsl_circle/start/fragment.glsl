
precision mediump float;

//  -5, -5, 5, 0, -5, 5,
//  -1, -1, 1, 0, -1, 1,
varying vec2 vVertexPosition;


void main(){
  vec2 p = vVertexPosition;
  p.x = p.x * 2.;

  float len = length(p);

  float circle = smoothstep(0.98, 1., len);

  gl_FragColor = vec4(circle, 0., 0., 1.);
}


// precision mediump float;

// // vVertexPosition...線形補完されたピクセルに合う-1から1までの座標が渡ってくる
// // -1, -1, 1, 0, -1, 1,
// varying vec2 vVertexPosition;

// // フラグメントには-1から1までの値がわたってきて、実行場所とそれが同じである。
// void main() {
//   // -1, -1, 1, 0, -1, 1を頂点に線形補間された値が無数に渡ってくる。
//   vec2 p = vVertexPosition;
//   // クリップ座標のx軸の-1から1までの範囲を-2から2までの範囲とする。
//   // -75px時点が-1になり、-150px時点が-2になる
//   p.x = p.x * 2.0;

//   // length(p)の値が0.98になると、一気に値が増加し始めて１になると一定。
//   // 0.98までは切り捨てで0.0が返り、1.0になると1を返し続ける
//   float len = smoothstep(0.98, 1.0, length(p));
  
//   // step...こちらは0.98を超えたら一気にlengthの値となる。
//   // float len = step(0.98, length(p));
  
//   // length...原点からの距離距離を返す
//   // float circle = length(p) * 2.0;

//   vec4 color = vec4(len, 0.0, 0.0, 1.0);

//   gl_FragColor = color;
// }
