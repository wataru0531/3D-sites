
precision mediump float;

varying vec2 vUv;
uniform sampler2D tDiffuse;

void main(){
    vec4 texColor = texture(tDiffuse, vUv);
    gl_FragColor = texColor;
}

