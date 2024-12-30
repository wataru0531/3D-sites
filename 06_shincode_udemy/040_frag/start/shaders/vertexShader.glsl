
precision mediump float;

varying vec2 vUv;
varying float vElevation;

uniform vec2 uFrequency;
uniform float uTime;


// 頂点ごとに実行
void main(){
  vUv = uv;

  // ワールド座標に変換
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // 頂点に動きをつける
  // modelPosition.xとy ... 各頂点で値が異なる
  float elevation = sin(modelPosition.x * uFrequency.x + uTime) * .1;
  // float elevation = sin(modelPosition.y * uFrequency.y + uTime) * .1;

  // = ではなく += とする。= は再代入となるので注意
  elevation += sin(modelPosition.y * uFrequency.y + uTime) * .1;

  // z成分に各頂点のx, y成分を加えることで、各頂点で違う動きとなる
  modelPosition.z += elevation;

  // 縦軸に縮小をかける...メッシュの大きさを変更できる
  // modelPosition.y *= 0.6;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_Position = projectionPosition;

  // elevationををフラグメントに渡してテクスチャに影を付けていく
  // 波に合わせて影をつける
  vElevation = elevation;
}