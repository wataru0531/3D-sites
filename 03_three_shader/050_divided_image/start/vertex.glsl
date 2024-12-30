
precision mediump float;

varying vec2 vUv;

// 各頂点で実行
void main(){
  vUv = uv;

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.);
}
