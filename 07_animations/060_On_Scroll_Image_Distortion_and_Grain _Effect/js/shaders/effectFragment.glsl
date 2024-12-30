
precision mediump float;

uniform float uScrollVelocity; // 瞬間的なスクロール量
uniform sampler2D uTexture; // 
uniform vec2 uRectSize; // htmlのサイズ
uniform float uMouseEnter; // meshに入れば1, でたら0。durationは.6
uniform vec2 uMouseOverPos; // meshでのカーソルの位置。左上が(0, 0)、右下が(1, 1);

in vec2 vUv;
in vec2 vUvCover; // CSSのコンテインのようにしたuv

// #include './resources/noise.glsl';

#pragma glslify: snoise = require(./shader-utils/snoise.glsl);

// #pragma glslify: 

out vec4 outColor;
// out修飾子
// → GLSL3(WebGL3.0)。モダンGLSL仕様で導入された、結果をフレームバッファに送るための変数を定義する際に使用
// 　複数の出力変数 をサポート(MRT を使用して複数のカラーバッファに描画可能)。
//   フラグメントシェーダーの柔軟性を向上させる
// gl_fragColorは非推奨


void main() {
  vec2 texCoords = vUvCover; // 線形補間されたuv

  // htmlのアスペクト比
  //  アスペクト比は、幅が相対的に長ければ値が大きくなる
  float aspectRatio = uRectSize.y / uRectSize.x; // 1.5

  // distance → 2点間の距離を算出
  //            ユークリッド距離の公式に基づいて計算 d= √(x1−x0)2 +(y1−y0)2
  // uMouseOverPos → meshでのカーソルの位置。左上が(0, 0)で(1, 1)まで
  // 1.0 - uMouseOverPos.y → yは上が1、下が0にしてuv座表と同じにしている
  float circle = 1.0 - distance(
    // アスペクト比をかけることで、uMouseOverPosとvUvの座標を同じにしている。
    // uMouseOverPosは線形補間で0〜1の値が渡ってくるので、その遅延
    vec2(uMouseOverPos.x, (1.0 - uMouseOverPos.y) * aspectRatio),
    vec2(vUv.x, vUv.y * aspectRatio)
  ) * 15.0;
  // → カーソルが止まっている部分では値が小さくなるが、その周囲では値が大きくなる
  //   → それゆえに後のmixでマウスホバーした時に周囲は濃いnoiseがかかった状態になる。

  // ノイズ
  // gl_FragCoord → フラグメントシェーダ内で現在処理中のピクセルのスクリーン座標を表す組み込み変数
  //                左下が(0, 0)、右上は(width, height)の実際のサイズ
  // gl_FragCoord.x - ピクセルのスクリーン座標系でのx座標(左から右）
  // gl_FragCoord.y - ピクセルのスクリーン座標系でのy座標(下から上)
  // gl_FragCoord.z - そのピクセルの深度値(Zバッファ値)
  // gl_FragCoord.w - そのピクセルのウィンドウ座標の非同次性(通常は 1.0 で固定される)
  float noise = snoise(gl_FragCoord.xy); 
  // float noise = snoise(vec2(gl_FragCoord.x, gl_FragCoord.y));

  // マウスホバーしなくても、uScrollVelocityによりノイズがかかる
  texCoords.x += mix(0.0, circle * noise * 0.01, uMouseEnter + uScrollVelocity * 0.1);
  texCoords.y += mix(0.0, circle * noise * 0.01, uMouseEnter + uScrollVelocity * 0.1);

  vec3 texture = vec3(texture(uTexture, texCoords));
  outColor = vec4(texture, 1.0);
}
