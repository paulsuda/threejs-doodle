
const float PI = 3.1415926535897932;
uniform float rangeMin;
uniform float rangeMax;
vec2 mainSeeds = vec2(72890.0, 27426.035);
vec2 prngSeedOffsets = vec2(323.9, 999.3);
vec2 primeMultipliers = vec2(11.0, 7.0);

float seedRandom(float x){
  float r = fract(
    sin(x * primeMultipliers.x + prngSeedOffsets.x) +
    sin(x * primeMultipliers.y + prngSeedOffsets.y)
  );
  return (r + rangeMin) * (rangeMax - rangeMin);
}

vec2 seedRandom2d(vec2 uv, vec2 seed){
  float v = uv.x * uv.y;
  return vec2(seedRandom(v * seed.x), seedRandom(v * seed.y));
}

void returnValue(vec4 r){
  gl_FragColor = r;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec2 r = seedRandom2d(uv, mainSeeds);
  returnValue(vec4(r.x, r.y, 0.0, 1.0));
}
