


#pragma glslify: easeBack = require(glsl-easings/back-in-out)

attribute float aDelay;

varying vec2 vUv;
varying float vDelay;

uniform float uProgress;

void main() {
    vUv = uv;
    vDelay = aDelay;

    vec3 pos = position;
    
    // aDelay => 0 ~ 1。既に頂点ごとに割り振られている。
    // aDelay * 0.3=> 0 ~ 0.3の範囲に変更
    // マイナスから抜け出した頂点から動き出す(対角線上に動きだす)
    // 対角線上の値は小さい順に引く値が小さいので、その頂点は早くプラスになるので動くのが早くなる。
    float x = clamp(uProgress * 1.3 - aDelay * 0.3, 0., 1.);
    float progress = easeBack(x);

    pos.z += progress * 250.;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
