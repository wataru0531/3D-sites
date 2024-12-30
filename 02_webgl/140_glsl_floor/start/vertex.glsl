
precision mediump float;

attribute vec2 aVertexPosition;

varying vec2 vVertexPosition;

void main(){

  vVertexPosition = aVertexPosition;

  gl_Position = vec4(aVertexPosition, 1., 1.);
}


// precision mediump float;

// // -1, -1  1, 0  -1, 1
// attribute vec2 aVertexPosition;
// varying vec2 vVertexPosition;

// 頂点１つ１つで実行
// void main() {
//     vVertexPosition = aVertexPosition;
    
//     gl_Position = vec4(aVertexPosition, 0.0, 1.0);
// }
