

precision mediump float;

varying vec2 vVertexPosition; // -1, -1  1, 0  -1, 1

void main(){
  vec2 uv = vVertexPosition * .5 + .5;

  uv = floor(uv * 10.) / 10.;

  gl_FragColor = vec4(uv, 0., 1.);

}



// precision mediump float;

// // -1, -1  1, 0  -1, 1
// varying vec2 vVertexPosition;

// void main(){
//      // uv...-1から1までを、0, 0 〜 1, 1 までの座標に切り替える
//     // (0, 0) (1, 0.5) (0, 1) とする(頂点座標)
//     vec2 uv = vVertexPosition / 2.0 + 0.5;

//     // floor()...小数点切り捨て。
//     // 10を掛ける...uvが0.1のときに1を反す。uvが1の時に10を反す。
//     // 10で割る...uvが1のときに1を反すようになる。
    
//     // 仮に(0.11, 0)が渡ってきた場合...x軸は1.1となり、小数点は切り捨てられて1となる
//     // 0.19まで同じ値が渡り、0.2になるときに数値が変わり段がつくようになる。
    
//     // uv = floor(uv * 10.0); // 20.0が入っても1.0と同じ扱い
//     uv = floor(uv * 10.) / 10.;
    
//     vec4 color = vec4(uv, 0.0, 1.0);
//     // vec4 color = vec4(0.5, 0.0, 0.0, 1.0);

//     gl_FragColor = color;
// }

