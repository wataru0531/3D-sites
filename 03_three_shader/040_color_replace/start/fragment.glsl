

// uv座標...0, 1, 1, 1, 0, 0, 1, 0
varying vec2 vUv;

uniform sampler2D uTex;
uniform float uTick;


void main() {
    float time = uTick * 0.01;
    
    // 初期の色
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);

    // uTex ... 画像の各座標毎の4次元の色情報を持つ
    // vUv  ... 0 から 1
    // texture() テクスチャであるuTexの中のvUv座標に対応する色を取得し返す
    //           色情報は基本的に0〜255までですが、textureの内部で0から1に正規化される
    //           WebGLの世界では0〜1の範囲で指定するのがお作法
    vec4 texColor = texture(uTex, vUv);

    // 1.0 - とすると色が反転する
    // sin()...-1から1の範囲で値を返す。ラジアンの値を元に、y軸の値を返す。ラジアンが0のときyの値は0。
    // color.rgb = 1.0 - texColor.rgb * sin(time); // -1から1の範囲
    color.rgb = 1.0 - texColor.rgb * (sin(time) * .5 + .5); // 0から1の範囲
    // color.rgb = 1. - texColor.rgb;

    // color.r = texColor.g;
    // color.g = texColor.b;
    // color.b = texColor.r;
    
    gl_FragColor = color;
    // gl_FragColor = vec4(sin(uTick * 0.01) * 0.5 + 0.5, 0.0, 0.0, 1.0);
}
