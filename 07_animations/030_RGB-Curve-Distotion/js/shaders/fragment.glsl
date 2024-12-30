
precision mediump float;

varying vec2 vUv;

uniform sampler2D uTexture;
uniform float uAlpha; // 0 〜 1までの値が線形補間で渡ってくる
uniform vec2 uOffset; // targetからcurrentを差し引いた値。線形補間の値。カーソルが止まれば0になる
uniform float uTick;

vec3 rgbShift(sampler2D textureimage, vec2 uv, vec2 offset ){
  // uv + offset → rチャネル(赤)の値を少しずらした位置でサンプリング
  // → テクスチャの黒(r = 0, g = 0, b = 0)の部分にoffsetによって、白い箇所(r = 1)のrチャネルがシフトされると、
  //   その黒い箇所に対して赤の値が増える(r が 1 になる)ため、そのピクセルが赤く見えるようになる
  float r = texture2D(textureimage, uv + offset).r;
  float g = texture2D(textureimage, uv - offset).g;
  float b = texture2D(textureimage, uv).b;

  // vec2 gb = texture2D(textureimage, uv).rb;

  return vec3(r, g, b);
}

void main(){
  // vec3 color = texture2D(uTexture, vUv).rgb;
  vec3 color = rgbShift(uTexture, vUv, uOffset);
  gl_FragColor = vec4(color, uAlpha);
}



// 元のコード

// precision mediump float;

// varying vec2 vUv;

// uniform sampler2D uTexture;
// uniform float uAlpha; // 0 〜 1までの値が線形補間で渡ってくる
// uniform vec2 uOffset; // targetからcurrentを差し引いた値。線形補間の値。カーソルが止まれば0になる

// vec3 rgbShift(sampler2D textureimage, vec2 uv, vec2 offset ){
//   // uv + offset → rチャネル(赤)の値を少しずらした位置でサンプリング
//   float r = texture2D(textureimage, uv + offset).r;
//   vec2 gb = texture2D(textureimage, uv).rb;

//   return vec3(r, gb);
// }

// void main(){
//   // vec3 color = texture2D(uTexture, vUv).rgb;
//   vec3 color = rgbShift(uTexture, vUv, uOffset);
//   gl_FragColor = vec4(color, uAlpha);
// }
