uniform sampler2D positionTexture;
uniform sampler2D velocityTexture;
uniform float frameTimeSec;

float bounceFactor = 0.95;
float radius = 0.8;
float seedConst = 500000.0;

// x between -1, 1
// seed between -1, 1
// From: https://thebookofshaders.com/10/
float seedRandom(float x, float seed){
  return fract(sin(x) * seedConst * seed);
}

vec2 seedRandom2d(vec2 uv, float seed){
  return vec2(seedRandom(uv.x, seed), seedRandom(uv.y, seed + 0.03532));
}

void main() {
   vec2 uv = gl_FragCoord.xy / resolution.xy;
   vec4 p = texture2D( positionTexture, uv );
   vec4 v = texture2D( velocityTexture, uv );
   // v.xy += (seedRandom2d(uv, 0.9235) - 0.5) * 0.01;
   vec4 nextP = p + (v * frameTimeSec);
   float l = sqrt(nextP.x * nextP.x + nextP.y * nextP.y);
   if(l > radius){
     v.x = -v.x * bounceFactor;
     v.y = -v.y * bounceFactor;
   }
   gl_FragColor = v;
}
