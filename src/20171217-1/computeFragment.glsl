
uniform sampler2D texture;
void main() {
   vec2 uv = gl_FragCoord.xy / resolution.xy;
   vec4 t = texture2D( texture, uv );
   /* Fall down. */
   t.y -= 0.02;
   /* Until the ground. */
   if(t.y < -1.2){
     t.y = -1.2;
   }
   gl_FragColor = t;
}
