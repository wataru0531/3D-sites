



precision mediump float;

varying vec2 vUv;

// 頂点１つ１つで実行
void main(){
  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}

