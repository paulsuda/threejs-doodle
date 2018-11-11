
float bounceFactor = 0.95;
float radius = 0.8;
float seedConst = 1234567.0;

// x between -1, 1
// seed between -1, 1
// From: https://thebookofshaders.com/10/
float seedRandom(float x, float seed){
  return fract(sin(x) * seedConst * seed);
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  float seed = 0.2;
  gl_FragColor = vec4(seedRandom(uv.x, seed) - 0.5, seedRandom(uv.y, seed) - 0.5, 0.0, 1.0);
}
