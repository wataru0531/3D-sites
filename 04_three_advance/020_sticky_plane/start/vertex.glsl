

precision mediump float;

attribute float aDelay;

varying vec2 vUv;
varying float vDelay;
varying vec3 vPosition;

void main(){
	vUv = uv;
	vDelay = aDelay;
	vPosition = position;

	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}
