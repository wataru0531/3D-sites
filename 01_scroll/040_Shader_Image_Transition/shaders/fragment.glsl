
precision mediump float;

#pragma glslify: noise2 = require(glsl-noise/simplex/2d); // 2次元のノイズ
#pragma glslify: noise3 = require(glsl-noise/simplex/3d); // 3次元のノイズ

varying vec2 vUv;
uniform float uProgress; // 0 → 1
uniform vec2 uSize; // vec2(width, height)
uniform sampler2D uTexture;

// #define PI 3.1415926538; // definesで定義


float noise(vec2 point) {
  float frequency = 1.0;
  float angle = atan(point.y,point.x) + uProgress * PI;

  float w0 = (cos(angle * frequency) + 1.0) / 2.0; // normalize [0 - 1]
  float w1 = (sin(2.*angle * frequency) + 1.0) / 2.0; // normalize [0 - 1]
  float w2 = (cos(3.*angle * frequency) + 1.0) / 2.0; // normalize [0 - 1]
  float wave = (w0 + w1 + w2) / 3.0; // normalize [0 - 1]
  return wave;
}

float softMax(float a, float b, float k) {
  return log(exp(k * a) + exp(k * b)) / k;
}

float softMin(float a, float b, float k) {
  return -softMax(-a, -b, k);
}

// 原点からの距離に、ノイズを絡めた値を取得
// pos → 画像の座標(0〜1。2次元)
// rad → 画像の半径(0〜2.5倍)
float circleSDF(vec2 pos, float rad) {
  // uProgressが0の時 → 0
  //            1の時 → かなり小さい値
  float a = sin(uProgress * 0.2) * 0.25; //  -0.25 〜 0.25

  float amt = 0.5 + a; // .25 〜 .75
  float circle = length(pos); // vUvの(0, 0)からの距離

  // ノイズ → 画像の半径(2次元。1に近づくほど値が大きくなる) * 0.5程度の値
  circle += noise(pos) * rad * amt;
  return circle;
}

// 画像の中心から放射状に並ぶ円を作る処理?
// p → 0〜1 → -.5〜.5 → 画像のサイズをかけて半分にした値
// o → 画像のx軸の値。これに.2など少数をかけている
// count → 3から5などのカウント
float radialCircles(vec2 p, float o, float count) {
  vec2 offset = vec2(o, o);

  float angle = (2. * PI) / count; // 360度をカウントで割った角度(ラジアン)

  // 座標(p.x, p.y) の点と原点 (0, 0) との間の角度
  // round() → 四捨五入で整数に 
  // atan → 長さの比から角度を出す。tanは角度から比を出す。
  float s = round(atan(p.y, p.x) / angle);
  float an = angle * s;
  vec2 q = vec2(offset.x * cos(an), offset.y * sin(an));
  vec2 pos = p - q;
  float circle = circleSDF(pos, 15.0);
  
  return circle;
}


void main() {
  vec4 bg = vec4(vec3(0.0), 0.0);
  vec4 texture = texture2D(uTexture, vUv);
  vec2 coords = vUv * uSize; // 0 〜 1を画像のサイズに。coordsは座標の意味
  vec2 o1 = vec2(0.5) * uSize; // 画像の半分のサイズ

  // pow(x, y) →　x の y乗
  // → なのでここでは、1に近づくほど加速するようなeasingとなる
  float t = pow(uProgress, 2.5); // easing
  float radius = uSize.x / 2.0; // x軸の長さの半分
  float rad = t * radius; // 最小で0、最大で2.5倍となる

  // circleSDF(画像の半分の大きさの2次元座標, 0から2.5倍になる半径)
  float c1 = circleSDF(coords - o1, rad);

  vec2 p = (vUv - 0.5) * uSize; // 0〜1 → -.5〜.5 → 画像のサイズをかけて半分に
  float r1 = radialCircles(p, 0.2 * uSize.x, 3.0);
  float r2 = radialCircles(p, 0.25 * uSize.x, 3.0);
  float r3 = radialCircles(p, 0.45 * uSize.x, 5.0);

  float k = 50.0 / uSize.x;
  float circle = softMin(c1, r1, k); 
  circle = softMin(circle, r2, k);
  circle = softMin(circle, r3, k);

  circle = step(circle, rad);
  vec4 color = mix(bg, texture, circle);

  gl_FragColor = color;
}