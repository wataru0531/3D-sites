

precision mediump float;

#pragma glslify: easeBack = require(glsl-easings/back-in-out)
#pragma glslify: easeCubic = require(glsl-easings/cubic-in-out)

#pragma glslify: rotate = require(glsl-rotate)

attribute float aDelay;

varying vec2 vUv;
varying float vDelay;

uniform float uProgress;

// 各頂点１つ１つで実行
void main() {
	vUv = uv;
	vDelay = aDelay;
	vec3 pos = position;

	// aDelay → 0 ~ 1
	// aDelay * 0.3 → 0 ~ 0.3
	float delay = clamp(uProgress * 1.2 - aDelay * 0.2, 0., 1.);
	float progress = easeCubic(delay);

	// ポイントの大きさ
	gl_PointSize = 6.;

	gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}