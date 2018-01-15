uniform sampler2D positionTexture;
uniform sampler2D velocityTexture;
uniform float frameTimeSec;

void main() {
   vec2 uv = gl_FragCoord.xy / resolution.xy;
   vec4 p = texture2D( positionTexture, uv );
   vec4 v = texture2D( velocityTexture, uv );
   float bounceFactor = 0.2;
   float floorY = -1.2;
   float boxSize = 1.0;
   vec4 nextP = p + (v * frameTimeSec);

   /* Gravity */
   v.y += -4.0 * frameTimeSec;

   if(nextP.y < -1.2){
     v.y = -v.y * bounceFactor;
   }
   if(nextP.x < -boxSize || nextP.x > boxSize){
     v.x = -v.x * bounceFactor;
   }
   if(nextP.z < -boxSize || nextP.z > boxSize){
     v.z = -v.z * bounceFactor;
   }

   /* pull to middle at bottom push at top, a little more at bottom */
   float pullFactor = min(p.y * 14.0, p.y * 6.0);
   v.xz += (normalize(p.xz) * pullFactor * frameTimeSec);

   /* Anti gravity in center. */
   v.y += max(0.0, (0.2 - length(p.xz)) * 42.0 * frameTimeSec);

   /* Decay */
   v.xyz *= 1.0 - (0.6 * frameTimeSec);


   gl_FragColor = v;
}
