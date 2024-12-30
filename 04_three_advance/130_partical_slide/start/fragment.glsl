
precision lowp float;

varying vec2 vUv;
varying float vDelay;
varying float vProgress;

uniform sampler2D uTexCurrent;
uniform sampler2D uTexNext;
uniform float uProgress;

void main(){
  if(vProgress > .1 && distance(gl_PointCoord, vec2(.5, .5)) > .5){
    discard;
  }

  vec4 texCurrent = texture(uTexCurrent, vUv);
  vec4 texNext = texture(uTexNext, vUv);

  vec4 color = mix(texCurrent, texNext, uProgress);
  gl_FragColor = color;
}

// // precisionをlowpに....小数点の計算を厳密にするかどうか。highが最も厳密
// // lowp < midiump < highp
// precision lowp float;

// varying vec2 vUv;
// varying float vDelay;

// uniform sampler2D uTexCurrent;
// uniform sampler2D uTexNext;

// uniform float uProgress; // 通常のプログレス

// // vProgress...0の時は0、0.5の時は1、1の時は0
// varying float vProgress;


// // gl_PointCoordについての説明
// // https://khronos.org/registry/OpenGL-Refpages/gl4/html/gl_PointCoord.xhtml

// void main() {

//   // progressの値が0の時は丸ではなくて四角にしておく
//   // vProgress ... 0の時は0、0.5の時は1、1の時は0
//   if(vProgress > 0.1 && distance(gl_PointCoord, vec2(0.5, 0.5)) > 0.5) {
//     discard;
//   }

//   vec4 texCurrent = texture(uTexCurrent, vUv);
//   vec4 texNext = texture(uTexNext, vUv);

//   vec4 color = mix(texCurrent, texNext, uProgress);

//   gl_FragColor = color;
// }