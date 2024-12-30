

precision mediump float;

varying vec2 vUv;
varying vec3 vPosition;

uniform sampler2D uTex;

void main(){
  vec2 center = vec2(.5, .5);

  // length ... (0, 0)、つまり原点から引数までの距離。
  // このmainは各ピクセルで実行されていて、このmainに割り当てられているvUvとの距離を取得
  float len = length(vUv - vec2(.5, .5));

  // centerからのvUvまでの距離
  // float len = distance(vUv, center);

  float circle = 1. - smoothstep(.98, 1., len * 2.);

  vec4 tex = texture(uTex, vUv);

  vec4 color = circle * tex;

  gl_FragColor = color;
}


// precision mediump float;

// varying vec2 vUv;
// uniform sampler2D uTex;

// void main() {
//   // uv座標の中心
//   vec2 center = vec2(0.5, 0.5);

//   vec2 p = vUv;
//   p.x = p.x * 2.0;

//   // distance...pとcenter(原点の位置)の距離を返す。引数に順番はない。
//   // 5.0倍しているのでしているので黒の部分が増える。
//   // float len = distance(vUv, center) * 5.;
//   float len = distance(p, center) * 2.0;
  
//   // smoothstep...0.98に満たない値は0を返し、0.98以上から値が増え始めて1までの値を返す。
//   // float circle = 1. - smoothstep(0.98, 1., len);
//   float circle = smoothstep(0.98, 1., len);

//   // uv座表に合うuTexの色を格納
//   vec4 texColor = texture(uTex, vUv);

//   // circleには黒い部分には0が渡ってきて、0ではない部分には1が渡ってくる
//   vec4 color = circle * texColor;

//   gl_FragColor = color;

//   // gl_FragColor = vec4(vUv, 0.0, 1.0);
//   // gl_FragColor = vec4(p, 0., 1.);
// }


/////////////////////////////////////////////

// uvの座標はひとつづつ渡ってきて各フラグメントで一斉に実行される。
// uv...(0, 1) (1, 1) (0, 0) (1, 0)

// uv座表の位置自体は絶対に変化しない。
// uv座標に紐づく数値を変化させるだけ。
// 左下が(0, 0)、右上が(1, 1)で、0.5からの距離を計算して表示させている。



