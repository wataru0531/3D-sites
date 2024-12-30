

precision mediump float;

// uv座標...0, 1, 1, 1, 0, 0, 1, 0
varying vec2 vUv;

uniform sampler2D uTex;
uniform float uTick;

void main() {
    float time = uTick * 0.005;

    // sinカーブの振幅の調整 amplitude...振幅
    // sin()は、-1から1の範囲。
    const float AMP = 0.1;
    // const → 定数。あとからAMPの値は変更できない
    //         constを消せば、後からAMPに再代入可能となる

    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);

		// color.r = texture(uTex, vec2(vUv.x, vUv.y)).r;

    // color.r = texture(uTex, vUv + vec2(.1, .2)).r;

    color.r = texture(uTex, vUv + vec2(sin(time) * AMP, 0.0)).r;
    // color.g = texture(uTex, vUv + vec2(0.0, sin(time) * AMP)).g;
    // color.b = texture(uTex, vUv + vec2(0.0, 0.0)).b;

    // uTex。→ テクスチャであるuTexの中のvUv座標に対応する色を取得し返す
    //         uv座標に見合ったフラグメントの色を動かせば動く。
    // vUv + 0.1 とすると画像上の+0.1の部分が部分が取得
    // vec4 texColor = texture(uTex, vUv);

    gl_FragColor = color;
    // gl_FragColor = texColor;
}
