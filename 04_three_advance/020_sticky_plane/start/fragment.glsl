


precision mediump float;

varying vec2 vUv;
varying float vDelay;
varying vec3 vPosition;

// uniform sampler2D uTex;
// uniform float uProgress;


void main(){
  // vec4 tex = texture(uTex, vUv);

  // 頂点、UV座表ともに左上から入っていき、その間は線形補間された値が入る。

  // 遅延を以てせるための頂点座標
  // gl_FragColor = vec4(vDelay, 0.0, 0.0, 1.0);
  // gl_FragColor = vec4(0.9, 0., 0., 1.);

  // UV座表
  // gl_FragColor = vec4(vUv, 0., 1.);
  // gl_FragColor = vec4(1., 1.0, 0., 1.);

  // 頂点座標
  gl_FragColor = vec4(vPosition, 1.);
}

