


// cssのcover フラグメントで使う場合

vec2 getCoverUvFrag(vec2 uv, vec2 naturalSize, vec2 rectSize) {
  vec2 tempUv = uv - vec2(0.5);

  float quadAspect = rectSize.x / rectSize.y;
  float textureAspect = naturalSize.x / naturalSize.y;

  if (quadAspect < textureAspect) {
    tempUv *= vec2(quadAspect / textureAspect, 1.0);
  } else {
    tempUv *= vec2(1.0, textureAspect / quadAspect);
  }

  tempUv += vec2(0.5);

  return tempUv;
}

#pragma glslify: export(getCoverUvFrag)