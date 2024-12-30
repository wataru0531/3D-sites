varying vec2 vUv;
uniform sampler2D uTex;
uniform float uTick;

void main() {
    float time = uTick * 0.01;
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
    vec4 texColor = texture(uTex, vUv);

    // 一行で色の入れ替え
    // color.rgb = texColor.gbr;
    
    // 時間で色の変化
    // color.r = texColor.g * sin(time);
    // color.g = texColor.b * cos(time);
    // color.b = texColor.r;

    // 色を反転
    color.rgb = 1.0 - texColor.rgb;
    
    gl_FragColor = color;
    // gl_FragColor = texColor;
}