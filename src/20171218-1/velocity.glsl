
uniform sampler2D positionTexture;
uniform sampler2D velocityTexture;
uniform float frameTimeSec;

void main() {
   vec2 uv = gl_FragCoord.xy / resolution.xy;
   vec4 p = texture2D( positionTexture, uv );
   vec4 v = texture2D( velocityTexture, uv );
   v.y += 10.0 * frameTimeSec;
   v.x += 0.00005 * frameTimeSec;
   v.w = frameTimeSec;
   gl_FragColor = v;
}
