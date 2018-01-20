#ifdef GL_ES
attribute vec2 a_position;
uniform float u_translation;
uniform float u_scale;
uniform vec2 u_resolution;
#endif

void main() {
  vec2 preTransPosition = a_position + vec2(mod(u_translation * 60.0, 750.0), floor(u_translation * 60.0 / 750.0) * 60.0);
  vec2 preZeroToOne = preTransPosition / u_resolution;

  float scax = tan(u_scale / 3000.0 + preZeroToOne.x * 2.0 * 3.14) * 2.0 - 1.0;
  float pert = 0.3 * (sin(u_scale / 1500.0 + preZeroToOne.y * 2.0 * 3.14) * 2.0 - 1.0);
  //float hi_scax = 0.1 * floor(sin(u_scale / 1000.0)) * 2.0 - 1.0 ; // square wave
  //float med_scax = mod(u_scale / 500.0, 1000.0); // saw tooth
  //float scay = sin(u_scale / 1000.0 + preZeroToOne.y * 2.0 * 3.14) * 2.0 - 1.0;
  vec2 scaledPosition = a_position * vec2((scax + pert), (scax + pert));
  vec2 transPosition = scaledPosition + vec2(mod(u_translation * 60.0, 750.0), floor(u_translation * 60.0 / 750.0) * 60.0);
  vec2 zeroToOne = transPosition / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;
  vec2 clipPosition = clipSpace * vec2(1, -1);
  gl_Position = vec4(clipPosition, 0, 1);
}

