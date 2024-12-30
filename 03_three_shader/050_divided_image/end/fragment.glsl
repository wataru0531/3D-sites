

varying vec2 vUv;
uniform sampler2D uTex;
uniform float uTick;

void main() {
    float time = 3.14 / 2.;
    const float AMP = 0.5;
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
    vec2 fUv = vUv;

    fUv.x = fract(fUv.x * 4. * sin(time));
    fUv.y = fract(fUv.y * 4. * sin(time));
    color = texture(uTex, fUv);

    // vec4 color2 = vec4(1.0);
    // color2.rgb = color.gbr;
    // color.g = texture(uTex, vUv + vec2(0., AMP * sin(time))).g;
    // color.b = texture(uTex, vUv + vec2(0.0, 0.0)).b;
    
    // gl_FragColor = color2;
    // gl_FragColor = texColor;
    gl_FragColor = color;
}