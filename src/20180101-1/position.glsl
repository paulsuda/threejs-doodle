uniform sampler2D positionTexture;
uniform sampler2D velocityTexture;
uniform float frameTimeSec;

void main() {
   vec2 uv = gl_FragCoord.xy / resolution.xy;
   vec4 p = texture2D( positionTexture, uv );
   vec4 v = texture2D( velocityTexture, uv );
   vec4 nextP = p + (v * frameTimeSec);
   float boxSize = 1.0;
   if(nextP.y < -1.2){
     nextP.y = -1.19;
   }
   else if(nextP.x < -boxSize){
     nextP.x = -boxSize + 0.01;
   }
   else if (nextP.x > boxSize){
     nextP.x = boxSize - 0.01;
   }
   else if(nextP.z < -boxSize){
     nextP.z = boxSize + 0.01;
   }
   else if(nextP.z > boxSize){
     nextP.z = boxSize - 0.01;
   }
   gl_FragColor = nextP;
}
