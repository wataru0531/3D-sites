
precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uOffset; // (x: .0, -(target - current) * .0003)
                      // 下スクロールでマイナスな値
varying vec2 vUv;

#define PI 3.1415926535897932384626433832795

vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset) {
  // sin(uv.y * PI) ... -1 〜 1の範囲に
  // position.xは変化なし
  position.x = position.x + (sin(uv.y * PI) * offset.x);

  // uv.x が.5の部分 → .5 * PIは90°で1が返る → offset.yが最も大きい値をとる
  position.y = position.y + (sin(uv.x * PI) * offset.y);

  return position;
}

void main() {
  vUv = uv;
  vec3 newPosition = deformationCurve(position, uv, uOffset);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
