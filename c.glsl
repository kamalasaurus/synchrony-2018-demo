#ifdef GL_ES
precision mediump float;
uniform vec4 u_color;
#endif

void main() {
	gl_FragColor = u_color;
}

