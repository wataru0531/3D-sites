



precision mediump float;


varying vec2 vUv;

uniform sampler2D uTexCurrent;
uniform sampler2D uTexNext;
uniform float uProgress;
uniform float uTick;
uniform vec2 uNoiseScale;

void main(){

  vec4 texCurrent = texture(uTexCurrent, vUv);
  vec4 texNext    = texture(uTexNext, vUv);

  gl_FragColor = mix(texCurrent, texNext, uProgress);
}




// precision mediump float;


// #pragma glslify: noise2 = require(glsl-noise/simplex/2d);
// #pragma glslify: noise3 = require(glsl-noise/simplex/3d);

// varying vec2 vUv;
// uniform sampler2D uTexCurrent;
// uniform sampler2D uTexNext;

// uniform float uTick;
// uniform vec2 uNoiseScale;
// uniform float uProgress;

// void main() {
//   // ヨコシマのノイズ
//   float n = noise3(vec3(vUv.x * uNoiseScale.x, vUv.y * uNoiseScale.y, uTick * 0.01));

//   vec4 texCurrent = texture(uTexCurrent, vUv);
//   vec4 texNext = texture(uTexNext, vUv);

//   // gl_FragColor = texNext;
//   // mix()...uProgressの値が0ならが第1引数を、値が1なら第2引数を取り出す。0.5なら中間の値を取得。
//   // mix()は第３引数の数値次第でどういう値を返すかを決める。

//   gl_FragColor = mix(texCurrent, texNext, uProgress);
// }
