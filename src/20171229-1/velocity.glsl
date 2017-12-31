uniform sampler2D positionTexture;
uniform sampler2D velocityTexture;
uniform float frameTimeSec;

void main() {
   vec2 uv = gl_FragCoord.xy / resolution.xy;
   vec4 p = texture2D( positionTexture, uv );
   vec4 v = texture2D( velocityTexture, uv );

   /* Gravity */
   // v.y += -4.9 * frameTimeSec;

   /* pull to middle at bottom push at top */
   v.xz += (normalize(p.xz * p.y) * 3.0 * frameTimeSec);

   /* Anti gravity in center. */
   v.y += cos(length(p.xz) * 2.0) * frameTimeSec;

   /* Decay */
   v.xyz *= 1.0 - (0.6 * frameTimeSec);

   gl_FragColor = v;
}
