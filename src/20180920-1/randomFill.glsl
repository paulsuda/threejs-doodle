
float bounceFactor = 0.95;
float radius = 0.8;
float seedConst = 123562.0;

float f(float x){
  return x * x;
}

// x between -1, 1
// seed between -1, 1
// From: https://thebookofshaders.com/10/
float seedRandom(float x, float seed){
  return fract(f(x * seed * seedConst));
  // return fract(sin(x) * seedConst * seed);
}

vec2 seedRandom2d(vec2 uv, float seed){
  return vec2(seedRandom(uv.x, seed), seedRandom(uv.y, seed + 0.03532));
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  float seed = 12345.0;
  float seed2 = 1.5;
  vec2 r = seedRandom2d(uv, 23.0);
  // gl_FragColor = vec4(seedRandom(seedRandom(uv.x, seed), seed2) - 0.5, seedRandom(seedRandom(uv.y, seed), seed2) - 0.5, 0.0, 1.0);
  gl_FragColor = vec4(r - vec2(0.5, 0.5), 0.0, 1.0);
}
