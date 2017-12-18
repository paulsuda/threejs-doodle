
uniform sampler2D positionTexture;
uniform sampler2D velocityTexture;
uniform float frameTimeSec;

void main() {
   vec2 uv = gl_FragCoord.xy / resolution.xy;
   vec4 t = texture2D( positionTexture, uv );
   vec4 v = texture2D( velocityTexture, uv );
   t += v * frameTimeSec;
   /* Until the ground. */
   if(t.y < -1.2){
     t.y = -1.2;
   }
   gl_FragColor = t;
}
