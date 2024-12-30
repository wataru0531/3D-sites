precision mediump float;

// 2次元のノイズ
#pragma glslify: noise2 = require(glsl-noise/simplex/2d);

// 3次元のノイズ
#pragma glslify: noise3 = require(glsl-noise/simplex/3d);

varying vec2 vUv;
 // vPosition ... gl_Positionに渡される前なので大きな数値が線形補間されて渡ってくる
varying vec3 vPosition;

uniform sampler2D uTex;
uniform float uTick;
uniform float uPI;


// フラグメント１つ１つで実行
void main() {
  // 通常のノイズ。小数値(float)で返る
  // 引数にはvec2型の値を入れる。
  // vUvを使っているのにはvec2型だけで特に理由はない
  // float n = noise2(vUv);
  // float n = noise2(vec2(vUv.x, vUv.y));

  // position
  // → vUvより値が大きくなるので粒度が細かくなる
  // float n = noise2(vec2(vPosition.x, vPosition.y));
  
  // より細かく 数値をかけるとノイズが小さくなる
  // float n = noise2(vUv * 1000.0);

  // 時間が経つにつれて細かく
  // float n = noise2(vUv * uTick * .1);

  // ノイズを移動
  // float n = noise2(vUv * 10.0 - uTick * .01);
  // float n = noise2(vec2(vUv.x * 10. - uTick * .01, vUv.y * 10.));

  // x方向にだけ移動
  // float n = noise2(vec2(vUv.x * 10. - sin(uTick * .01), vUv.y * 10.));

  // float n = noise2(vec2(vUv.x * 10. - sin(uTick * .01), vUv.y));

  // 波のように揺れる
  // x軸にy軸の値をプラス → y軸の高さによって数値が異なる
  // float n = noise2(vec2(vUv.x * 100. - sin(vUv.y + uTick / 100.), vUv.y * 10. - sin(vUv.x + uTick / 100.)));
  // float n = noise2(vec2(vUv.x * 100. - sin(vUv.y + uTick * .01), vUv.y));
  // float n = noise2(vec2(vUv.x, vUv.y * 100. - sin(vUv.x + uTick * .1)));

  // cos( vUv.x * PI * 2)とすることで、x軸の0から1になるにつれて、1から-1の値を返すので、
  // 本来のノイズに対して横軸に対しての波を描くことになる
  // float n = noise2(vec2(vUv.x * 10., vUv.y - uTick * .001));
  float n = noise2(vec2(cos(vUv.x * uPI * 2.), vUv.y - uTick * .001));


  // 3Dノイズ  noise3(x軸, y軸, 時間軸)
  // 3D座標 (x, y, z) でのノイズ値を計算し、float 値として返す。
  // このノイズ値は通常-1から1の間の値を持つ
  // x → x軸のノイズの大きさ
  // y → y軸のノイズの大きさ
  // z → ノイズのパターンを時間や他のパラメータによって変化させるためのパラメータ
  //     時間軸を指定させるとノイズの発生源をランダムに変更できるようにする。
  //     zは奥行きではなくて時間などによる変化を表現するために使われている
  //     3次元目を固定値にするとノイズのパターンが時間によって変化しなくなる
  // 注意: ランダムとはいえ、ライブラリのコードを使うので決まった動き
  // float n = noise3(vec3(vUv * 10., uTick * 0.01));
  // float n = noise3(vec3(vUv.x * 10., vUv.y * 10., uTick * .01));
  // float n = noise3(vec3(vPosition.x, vPosition.y, uTick * .01));

  // ヨコシマのノイズ。横に細くしたい場合は、,y軸には50をかける。
  // float n = noise3(vec3(vUv.x * 10., vUv.y * 50., uTick * 0.01));
  // float n = noise3(vec3(vUv.x * 10., vUv.y * 50., uTick * .01));


  gl_FragColor = vec4(n, 0., 0., 1.);
  // gl_FragColor = vec4(0, n, 0., 1.);
  // gl_FragColor = vec4(0, 0., n, 1.);
}
