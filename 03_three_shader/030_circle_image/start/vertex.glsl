
precision mediump float;

varying vec2 vUv;
varying vec3 vPosition;

void main(){
  vUv = uv;
  vPosition = position;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}


// precision mediump float;

// varying vec3 vPosition;

// // uv座標...0, 1, 1, 1, 0, 0, 1, 0
// varying vec2 vUv;
  
// // position...-10, 10, 0, 10, 10, 0, -10, -10, 0, 10
// // →  座標変換で -1から1の範囲に正規化されてgl_Positionに
// void main() {
//   vUv = uv;
//   vPosition = position;

//   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// }
