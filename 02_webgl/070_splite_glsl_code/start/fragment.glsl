
precision mediump float;

varying vec3 vVertexColor;

uniform vec2 uColor;


void main() {
  vec4 v1 = vec4(1.0, 1.0 , 0.0, 2.0);
  vec4 v2 = vec4(0.5, 0.0, 1.0, 1.0);

  vec4 color = v1 - v2;

  // gl_FragColor = vec4(1.0, 1.0, 0.0, 1.);
  gl_FragColor = vec4(color);
}

