#ifdef GL_ES
precision mediump float;
uniform float u_color;
uniform float u_color_position;
#endif

void main() {

  vec2 preTransPosition = vec2(mod(u_color_position * 60.0, 750.0), floor(u_color_position * 60.0 / 750.0) * 60.0);
  float rando = abs(sin(u_color/1000.0 + preTransPosition.x));
  float no2 = abs(cos(u_color/2000.0 - preTransPosition.y));
  float no3 = abs(sin(u_color/3000.0));
  gl_FragColor = vec4(0.8 * rando, 0.8 * (rando + no2 / 2.0), 0.8 * (rando + no3 / 2.0), 1.0);
}

