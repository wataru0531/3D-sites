
precision mediump float;

#pragma glslify: noise2 = require(glsl-noise/simplex/2d); // 2次元のノイズ
#pragma glslify: noise3 = require(glsl-noise/simplex/3d); // 3次元のノイズ

varying vec2 vUv;
uniform float uProgress; // 0 → 1
uniform vec2 uSize; // vec2(width, height)。画像の大きさ
uniform sampler2D uTexture;

// ⭐️ノイズ
// → 各フラグメントの角度によってランダムな値を算出
float noise(vec2 point) { // 画像(中央が(0, 0))
  float frequency = 1.0;

  // 全てのフラグメントの中央からの角度を取得
  // uProgress が 1になれば、π(180度)プラス
  float angle = atan(point.y, point.x) + uProgress * PI;

  // cos, sin → -1〜1を返す 
  // → + 1で、0から2を返す
  // → 2で割って、0〜1にする
  float w0 = (cos(angle * frequency) + 1.0) / 2.0; // normalize [0 - 1]
  float w1 = (sin(2.*angle * frequency) + 1.0) / 2.0; 
  float w2 = (cos(3.*angle * frequency) + 1.0) / 2.0; 
  float wave = (w0 + w1 + w2) / 3.0; // ここも3で割って0から1の値に正規化

  return wave;
}



// 各フラグメントの原点からの距離を測り、ノイズを絡める
// pos → 画像の座標 ここでは中央が(0, 0)で画像の大きさの数値が入る。2次元
// rad → 画像の半分を半径にしている(0〜画像の半径)
float circleSDF(vec2 pos, float rad) {
  // uProgressが0の時 → 0
  //            1の時 → かなり小さい値
  float a = sin(uProgress * 0.2) * 0.25;

  float amt = 0.5 + a; // 0 〜 .5より少し大きい値
  float circle = length(pos); // 中央からの距離(ここでは中央が(0, 0))

  // ノイズを乗せる → 画像の半径(2次元。1に近づくほど値が大きくなる) * 0.5程度の値
  circle += noise(pos) * rad * amt;
  return circle;
}

// 画像の中心を基準にして、放射状（円形の配置）に並ぶ円を生成する関数
// 各フラグメントの座標を使って、その位置に応じた円の配置を計算し、ノイズを加えて形状を変化させる仕組み
// p → 0〜1 → -.5〜.5 * 画像のサイズ → -半径 * 半径
// o → 画像のx軸の長さに、.2など少数をかけている
// count → 3から5などのカウント
float radialCircles(vec2 p, float o, float count) {
  vec2 offset = vec2(o, o); // vec2(x軸の値 * .2, x軸の値 * .2)

  // 円の間隔(分割数)。360度をカウントで割った角度(ラジアン) 120
  // → 仮に count = 3.0 の場合、angle = (2. * PI) / 3.0 となるので、円は120度間隔で配置
  //   円が中心を囲うイメージ 
  float angle = (2. * PI) / count; 

  // 座標(p.x, p.y) の点と原点 (0, 0) との間の角度
  // round() → 四捨五入で整数に 
  // atan → 長さの比から角度を出す。tanは角度から比を出す。
  // 各フラグメントの角度 / 120 → 少数を整数に
  // ⭐️ここでは全てのフラグメントが120度の位置にないと小数が返り、結果として1が返る
  float s = round(atan(p.y, p.x) / angle);

  // ⭐️その整数にangle(ここでは120とすると)をかけると、すべての値が120度ごとの値になる
  float an = angle * s; // 角度をセクション単位に調整

  // 元の座標pを、そのan(120度ごと)の角度分のずらす
  // vec2(offset.x * cos(an), offset.y * sin(an)) →　ずらすための角度を生成
  // 円を適切な位置に並べるため、オフセットを計算
  vec2 q = vec2(offset.x * cos(an), offset.y * sin(an));
  vec2 pos = p - q; // オフセットを適用してずらす

  // その位置を基準に circleSDF() を適用して円を作る値を取得
  float circle = circleSDF(pos, 15.0);
  
  return circle;
}

// 滑らかな最大値を計算
// exp() → 指数関数 ... exp(x) = e^x（e は約 2.718）
//         exp(1)は1、exp(2)は2.718、exp(3)は7.389、exp(4)は20.085
//         → このように引数が大きくなると爆発的に増えていく
// log() → 自然対数。 exp(x) の逆の計算をおこなう
//         log(1)は0、log(2.718)は1、log(7.389)は2、log(20.085)は3
//         → このように引数が増えるとゆっくり値が増えていく

// k → なめらかさのパラメータ
float softMax(float a, float b, float k) {
  return log(exp(k * a) + exp(k * b)) / k;
}

// 滑らかな最小値を取得
// a → 各フラグメントにノイズを乗せた円にする値
// b → 各フラグメントの位置をずらしてノイズを乗せた円にする値
// k → 
float softMin(float a, float b, float k) {
  return -softMax(-a, -b, k);
}


// 各ピクセルで実行される
void main() {
  vec4 bg = vec4(vec3(0.0), 0.0);
  vec4 texture = texture2D(uTexture, vUv);
  vec2 coords = vUv * uSize; // 0 〜 1を画像のサイズに。coordsは座標の意味
  vec2 o1 = vec2(0.5) * uSize; // 画像の半分のサイズの2次元ベクトル

  // pow(x, y) →　x の y乗
  float t = pow(uProgress, 2.5); // 1に近づくほど加速するようなeasing
  float radius = uSize.x / 2.0; // 画像の半径。x軸の長さの半分
  float rad = t * radius; // 0 〜 1。1で元の半径の大きさ

  // 各フラグメントの距離にノイズ(ランダムな値)を乗せた値を取得
  // circleSDF(画像の半分の大きさの2次元座標, uProgressに合わせてx軸の半分の大きさになる(半径))
  // coords - o1 → 中央を(0, 0)にする
  float c1 = circleSDF(coords - o1, rad);

  // radialCirclesで元の座標をずらした箇所から円を描くための値を取得
  vec2 p = (vUv - 0.5) * uSize; // 0〜1 → -.5〜.5 → * 画像のサイズ → 中央が(0, 0)
  float r1 = radialCircles(p, 0.2 * uSize.x, 3.0);
  float r2 = radialCircles(p, 0.25 * uSize.x, 3.0);
  float r3 = radialCircles(p, 0.45 * uSize.x, 5.0);

  // 
  float k = 50.0 / uSize.x;
  float circle = softMin(c1, r1, k); 
  circle = softMin(circle, r2, k);
  circle = softMin(circle, r3, k);

  circle = step(circle, rad);
  vec4 color = mix(bg, texture, circle);

  gl_FragColor = color;
}