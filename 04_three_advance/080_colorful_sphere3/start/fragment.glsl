

precision mediump float;

#pragma glslify: hsl2rgb = require(glsl-hsl2rgb);

varying vec2 vUv;
varying float vDelay;

uniform float uTick;
uniform float uSaturation;
uniform float uLightness;
uniform float uColorTime;
uniform float uColorDelay;

// フラグメント１つ１つで実行
void main(){
  if(length(gl_PointCoord - vec2(.5, .5)) > .5){
    discard;
  }

  // vDelay を uTick から引くことで色に遅延を持たせる(ばらばらな色に)
  float hue = sin(uTick * uColorTime - vDelay * uColorDelay) * .5 + .5;
  // float hue = sin(uTick * .001) * .5 + .5;

  vec3 rgb = hsl2rgb(hue, uSaturation, uLightness);

  gl_FragColor = vec4(rgb, 1.);
}



// precision mediump float;

// #pragma glslify: hsl2rgb = require(glsl-hsl2rgb)

// varying vec2 vUv;
// varying float vDelay; // 斜めについた頂点(左上から右下に遅延を走らせる)

// uniform sampler2D uTex;
// uniform float uTick;
// uniform float uSaturation;
// uniform float uLightness;
// uniform float uColorTime;
// uniform float uColorDelay;

// // gl_PointCoordについての説明
// // https://khronos.org/registry/OpenGL-Refpages/gl4/html/gl_PointCoord.xhtml

// void main() {
//   // gl_PointCoord...uv座標のように0〜1の値が渡ってくる
//   if(distance(gl_PointCoord, vec2(0.5, 0.5)) > 0.5) {
//     discard;
//   }
//   // vec4 tex = texture(uTex, gl_PointCoord);

//   // sinの値を0〜1に(hslに渡すため)
//   float hue = sin(uTick * uColorTime - vDelay * uColorDelay) * 0.5 + 0.5;
//   vec3 rgb = hsl2rgb(hue, uSaturation, uLightness);

//   gl_FragColor = vec4(rgb, 1.);
//   // gl_FragColor = tex;
// }
