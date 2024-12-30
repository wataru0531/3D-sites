
precision mediump float;

attribute vec2 aVertexPosition;

varying vec2 vVertexPosition;

void main(){
  vVertexPosition = aVertexPosition;

  gl_Position = vec4(aVertexPosition, 0., 1.);
}


// precision mediump float;

// // -5, -5, 5, 0, -5, 5
// attribute vec2 aVertexPosition;

// varying vec2 vVertexPosition;


// void main() {
//   vVertexPosition = aVertexPosition;

//   gl_Position = vec4(aVertexPosition, 0.0, 1.0);
// }
