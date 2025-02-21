


// cssのcover 頂点で使う場合

vec2 getCoverUvVert(vec2 uv, vec2 naturalSize, vec2 rectSize) {
  // 
  vec2 ratio = vec2(
    min((rectSize.x / rectSize.y) / (naturalSize.x / naturalSize.y), 1.0),
    min((rectSize.y / rectSize.x) / (naturalSize.y / naturalSize.x), 1.0)
  );

  return vec2(
    uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    uv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );
}


#pragma glslify: export(getCoverUvVert)