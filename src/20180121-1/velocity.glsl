uniform sampler2D positionTexture;
uniform sampler2D velocityTexture;
uniform float frameTimeSec;

float bounceFactor = 0.8;
float boxSize = 1.1;

void main() {
   vec2 uv = gl_FragCoord.xy / resolution.xy;
   vec4 p = texture2D( positionTexture, uv );
   vec4 v = texture2D( velocityTexture, uv );
   vec4 nextP = p + (v * frameTimeSec);

   if(nextP.x < -boxSize || nextP.x > boxSize){
     v.x = -v.x * bounceFactor;
   }
   if(nextP.y < -boxSize || nextP.y > boxSize){
     v.y = -v.y * bounceFactor;
   }

   gl_FragColor = v;
}
