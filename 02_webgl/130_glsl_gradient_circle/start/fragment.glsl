

precision mediump float;

varying vec2 vVertexPosition; // -1, -1, 1, 0, -1, 1

void main(){
  vec2 p = vVertexPosition;
  p.x = p.x * 2.;

  float len = length(p);

  float circle = 1. - smoothstep(0.98, 1., len);

  vec2 uv = vVertexPosition * .5 + .5;

  vec2 color = uv * circle;

  // gl_FragColor = vec4(circle, 0., 0., 1.);
  gl_FragColor = vec4(color, 0., 1.);
}


// precision mediump float;

// // -1, -1, 1, 0, -1, 1
// varying vec2 vVertexPosition;

// void main() {
//     vec2 p = vVertexPosition;
//     p.x = p.x * 2.0;

//     // circleには、0.98まで0を返す。そこからはゆるやかに1.0を返す。1からは増加しない
//     float circle = 1.0 - smoothstep(.98, 1.0, length(p));

//     // (0, 0) (1, 0.5) (0, 1) 
//     vec2 uv = vVertexPosition / 2. + .5;

//     // uv... (0, 0)、(1, 0.5)、(0, 1)など他に線形補間された値が渡ってくる。
//     // circle...0がわたってくるが、0.98をこえたら1が渡ってくる。
//     uv = uv * circle;

//     vec4 color = vec4(uv, 0., 1.);

//     // gl_FragColor = color;
//     gl_FragColor = vec4(uv, 0., 1.);
// }
