

precision mediump float;

attribute vec2 aVertexPosition;
attribute vec3 aVertexColor;

varying vec3 vVertexColor;
uniform float uTick;

void main(){
  vec2 p = aVertexPosition * sin(uTick * .01);
  vVertexColor = aVertexColor;

  gl_Position = vec4(p, 0., 1.);
}
