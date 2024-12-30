

// 

vec2 getContainUvFrag(vec2 uv, vec2 naturalSize, vec2 rectSize) {
   // -.5 〜 .5にする → 中央を(0, 0)にすることにより全てのフラグメントを均等に変更することができる
  vec2 tempUv = uv - vec2(0.5);

  float quadAspect = rectSize.x / rectSize.y; // naturalの画像のアスペクト比
  float textureAspect = naturalSize.x / naturalSize.y; // テクスチャのアスペクト比

  // ナチュラルの方がアスペクト比が大きい
  // → 幅が広いといこと。
  if (quadAspect > textureAspect) {
    tempUv *= vec2(quadAspect / textureAspect, 1.0); // x軸を変更
  } else {
    tempUv *= vec2(1.0, textureAspect / quadAspect); // y軸を変更
  }

  tempUv += vec2(0.5);

  return tempUv;
}

#pragma glslify: export(getContainUvFrag)