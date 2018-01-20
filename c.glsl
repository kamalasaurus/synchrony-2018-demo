#ifdef GL_ES
precision mediump float;
uniform vec4 u_color;
//uniform vec2 u_color;
#endif

float rand(vec2 co){
  return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  //gl_FragColor = vec4(rand(u_color), rand(u_color), rand(u_color), 1.0);
	gl_FragColor = u_color;
}

