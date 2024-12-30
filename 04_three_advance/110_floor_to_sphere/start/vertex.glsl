

precision mediump float;

#pragma glslify: easeBack = require(glsl-easings/back-in-out)
#pragma glslify: easeExpo = require(glsl-easings/exponential-in-out)
#pragma glslify: rotate = require(glsl-rotate)

attribute float aDelay;
// attribute vec3 plane;
attribute vec3 sphere;

varying vec2 vUv;
varying float vDelay;

uniform float uTick;
uniform float uProgress;
uniform float uScaleDelay;
uniform float uScaleTime;

// 頂点１つ１つで実行
void main() {
	vUv = uv;
	vDelay = aDelay;

	vec3 p = position;	// 平面の頂点
	vec3 s = sphere;	  // 球の頂点

	// plane時の波    - aDelay ... 対角線上に遅延を持たせる
	float waveP = sin(uTick * .02 - aDelay * 5.);
	// sphere時の波   - uv.y ... 下から上への波
	float waveS = sin(uTick * .02 - uv.y * 10.);

	// planeの頂点にX、Y、Z軸方向に波をかける  100 ... 波の大きさ(sinの振幅)
	p.x += waveP * 50.;
	p.y += waveP * 100.;
	p.z -= waveP * 50.;

	// sphereの頂点に波をかける 10...波の幅
	s += normal * waveS * 20.;

	float delay = easeExpo(clamp(uProgress * 2. - (1. - uv.y), 0., 1.));

	// delay(uProgress)の値が、0の時はplaneの頂点、1の時はsphereの頂点
	vec3 pos = mix(p, s, delay);

	vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

	// 2000 ... カメラから物体までの距離
	gl_PointSize = 4. * (2000. / - mvPosition.z);

	gl_Position = projectionMatrix * mvPosition;
}

