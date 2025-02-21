
precision mediump float;

float PI = 3.141592653589793;

uniform float uScrollVelocity; // 瞬間的なスクロール量
uniform vec2 uNaturalSize; // 元々の画像の大きさ。naturalWidth
uniform vec2 uRectSize; // ブラウザのサイズ

// #include './resources/utils.glsl';

#pragma glslify: getCoverUvVert = require(./shader-utils/getCoverUvVert.glsl);

out vec2 vUv;
out vec2 vUvCover;

// 
vec3 deformationCurve(vec3 position, vec2 uv) {
  // sin(uv.x * PI) → -1〜1。uv.xは0〜1。PIは3.14。ここでは0°から180まで格納することで、sin()から0 〜 .5 〜 0の値が返る
  // 　　　　　　　　　　uv.xが0.5の地点が最大の値1を返す。ux.x=0.5の時に90°となりsinは1が返る
  // min(abs(uScrollVelocity), 5.) → 5未満に制限
  // sign() →　入力値が正の場合は、1
  //            入力値が負の場合は、-1
  //         　入力値が0の場合は、0を返す
  position.y = position.y - (sin(uv.x * PI) * min(abs(uScrollVelocity), 5.) * sign(uScrollVelocity) * -.01);

  return position;
}

void main() {
  vUv = uv;
  vUvCover = getCoverUvVert(uv, uNaturalSize, uRectSize);

  vec3 deformedPosition = deformationCurve(position, vUvCover);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(deformedPosition, 1.0);
}
