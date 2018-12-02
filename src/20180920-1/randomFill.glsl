
const float PI = 3.1415926535897932;
uniform float rangeMin;
uniform float rangeMax;
vec2 mainSeeds = vec2(13.0, 22420.035);

float seedRandom(float x, float seed){
  float r = fract(sin(x * seed) + sin(x * 2355.0));
  return (r + rangeMin) * (rangeMax - rangeMin);
}

vec2 seedRandom2d(vec2 uv, vec2 seed){
  return vec2(seedRandom(uv.x, uv.y), seedRandom(uv.y, uv.x));
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec2 r = seedRandom2d(uv, mainSeeds);
  gl_FragColor = vec4(r.x, r.y, 0.0, 1.0);
}
