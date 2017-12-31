uniform sampler2D positionTexture;
uniform sampler2D velocityTexture;
uniform float frameTimeSec;

void main() {
   vec2 uv = gl_FragCoord.xy / resolution.xy;
   vec4 p = texture2D( positionTexture, uv );
   vec4 v = texture2D( velocityTexture, uv );
   p = p + (v * frameTimeSec);
   /* Until the ground. */
   if(p.y < -1.2){
     p.y = -1.2;
   }
   if(p.x < -1.2){
     p.x = -1.2;
   }
   if(p.x > 1.2){
     p.x = 1.2;
   }
   if(p.z < -1.2){
     p.z = -1.2;
   }
   if(p.z > 1.2){
     p.z = 1.2;
   }
   gl_FragColor = p;
}
