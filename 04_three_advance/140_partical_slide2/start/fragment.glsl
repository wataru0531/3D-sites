
precision lowp float;

varying vec2 vUv;
varying float vAlpha;

uniform sampler2D uTexCurrent;
uniform sampler2D uTexNext;
uniform float uProgress;
varying float vProgress;

// gl_PointCoordについての説明
// https://khronos.org/registry/OpenGL-Refpages/gl4/html/gl_PointCoord.xhtml

void main() {
  // uProgress が.5の時に、vProgressは1を返す
  // なのでuProgressが.05の時に、vProgressは0.1を返す
  if(vProgress > 0.1 && distance(gl_PointCoord, vec2(0.5, 0.5)) > 0.5) {
    discard;
  }

  vec4 texCurrent = texture(uTexCurrent, vUv);
  vec4 texNext = texture(uTexNext, vUv);

  vec4 color = mix(texCurrent, texNext, uProgress);
  
  color.a = vAlpha;
  
  gl_FragColor = color;
  // gl_FragColor = vec4(color.r, color.g, color.b, color.a);
}