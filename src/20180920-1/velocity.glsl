uniform sampler2D positionTexture;
uniform sampler2D velocityTexture;
uniform float frameTimeSec;

float bounceFactor = 0.7;
float radius = 1.0;

void main() {
   vec2 uv = gl_FragCoord.xy / resolution.xy;
   vec4 p = texture2D( positionTexture, uv );
   vec4 v = texture2D( velocityTexture, uv );
   vec4 nextP = p + (v * frameTimeSec);
   float l = sqrt(nextP.x * nextP.x + nextP.y * nextP.y);
   if(l > radius){
     v.x = -v.x * bounceFactor;
     v.y = -v.y * bounceFactor;
   }

   gl_FragColor = v;
}
