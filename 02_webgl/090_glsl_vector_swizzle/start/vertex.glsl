

precision mediump float;

// attributeで各頂点に対して、データを保持させる
// ここではaVertexPosition、aVertexColorをそれぞれの頂点で保持しているという
// ことになる

// → その保持しているデータは頂点と紐づくので、フラグメントにvaryingして色情報を
//   設定した場合、その頂点の色はその保持しているデータの値となる

// 1, 0,   -1, -1,   -1, 1
attribute vec2 aVertexPosition;

// 1, 0, 0,   0, 1, 0,   0, 0, 1
attribute vec3 aVertexColor;

varying vec3 vVertexColor;
uniform float uTick;


void main() {
    vec2 p = aVertexPosition;
    vVertexColor = aVertexColor;
    
    gl_Position = vec4(aVertexColor.xy, 0.0, 1.0);
}

