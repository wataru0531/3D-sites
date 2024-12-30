

precision mediump float;

#pragma glslify: easeExpo = require(glsl-easings/exponential-in-out)
#pragma glslify: snoise = require(glsl-noise/simplex/3d)

attribute float aDelay;

varying vec2 vUv;
varying float vDelay;

uniform float uTick;
uniform float uProgress;

void main() {
	vUv = uv;
	vec3 pos = position;

	// 3Dのノイズ(乱数)を使う。noise3(x軸, y軸, 時間軸)  -1〜1 のノイズを 0〜1に
	// 細かいパーティクルにしたいのでuvではなくpositionを使う
	// (uvは0〜1、positionの座標はまだこの時点では数値が大きい。なのでノイズが小さくなる)
	float n = snoise(vec3(position.xy, uTick * 0.01)) * .5 + .5;
	// float n = snoise(vec3(vUv.x, vUv.y, uTick * 0.01)) * .5 + .5;

	// delay → 対角線上に遅延する、0〜1の値が渡ってくる。既に配置されていると考える
	// uProgressの値がプラスに転じた頂点から右斜め上に動き出す。
	float delay = easeExpo(clamp(uProgress * 2. - aDelay, 0., 1.));

	// delayの情報をvDelayに入れてフラグメントに線形補間させる
	vDelay = delay;

	// delay → 対角線の遅延頂点の値が増えていくにつれ動く
	// pos.x = pos.x + 100. * n * delay;
	pos.x += 100. * n * delay;
	pos.y += 100. * n * delay;
	pos.z += 100. * n * delay;

	// パーティクルに遠近感を持たせるためにmvPositionに切り出す
	vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

	gl_PointSize = 3. * (500. / - mvPosition.z);
	gl_Position = projectionMatrix * mvPosition;
}
