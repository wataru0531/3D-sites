
precision mediump float;

varying vec2 vVertexPosition;

// フラグメント１つ１つで実行
// 頂点の間は線形補間された値で実行

void main(){
  vec2 p = vVertexPosition * .5 + .5;

  gl_FragColor = vec4(p, 0., 1.);
}




// 頂点は左上から右にわたってくる。
// 頂点間の値は線形補間される

// vertexからフラグメントに渡された値は、0 〜 1に変換される
// マイナスの値は0に、1より大き値は1に。

// 各ピクセルで実行(ピクセル数分だけ実行される)
// 座標として渡された頂点の値は線形補間していくとその座標の値と一致する


// precision mediump float;

// // (-1, -1) (1, 0) (-1, 1)
// varying vec2 vVertexPosition;

// void main() {
//     // 0 〜 1 の範囲に
//     vec2 colorTmp = vVertexPosition / 2.0 + 0.5;

//     // -1などマイナスの値は0として認識される
//     //  (0, 0)  (1, 0.5)  (0, 1) となる
//     vec4 color = vec4(colorTmp, 0.0, 1.0);

//     // vec4 color = vec4(1, 0.5, 0.0, 1.0);
//     // vec4 color = vec4(0.0, 1.0, 0.0, 1.0);

//     gl_FragColor = color;
// }

