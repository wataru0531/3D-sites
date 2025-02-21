
precision mediump float;



varying vec2 vUv;
uniform sampler2D uTexture;
// pointermoveでのtargetの値からthis.offset.x(現在の値)を引いた値に.0005をかけた値が渡ってくる
uniform vec2 uOffset;

float PI = 3.141529;

// x, y軸の中央の値をより歪ませる処理
vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset){
  // uv.y 　　→ 0 〜 1まで返し、0°から57.2958°までしか返さない
  // uv.y * π →　0 〜 180°まで返す

  // 画像の一番下 → uv.yが0なので、0を返す。
  // 画像の中央   → uv.yが.5なので、1を返す。もっとも変化が大きい
  // 画像の一番上 → uv.yが1なので、sin(1 * PI)で0を返す。

  // 横軸のx座標をy座標の値で歪ませる
  position.x = position.x + (sin(uv.y * PI) * offset.x);

  position.y = position.y + (sin(uv.x * PI) * offset.y); // 縦軸のy座標をx座標の値で歪ませる
  
  return position;
}

void main(){
  vUv = uv;
  vec3 newPosition = deformationCurve(position, uv, uOffset);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}