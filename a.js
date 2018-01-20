let createRectangles = (gl, col, transloc, scale, positions, index, time) => {
  // add transformations to the coords to get rotations in glsl?  start doing them here first
  let primitiveType = gl.TRIANGLES
  let offset = 0
  let count = 6

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  gl.uniform4f(col, Math.random(), Math.random(), Math.random(), 1)
  gl.uniform2fv(col, [time, 100 * Math.random()])
  gl.uniform1f(scale, time)
  gl.uniform1f(transloc, index)
  gl.drawArrays(primitiveType, offset, count)

}

let update = (gl, col, transloc, scale, positions, time) => {
  console.log(time);
  for (i = 0; i < 100; i++) {
    createRectangles(gl, col, transloc, scale, positions, i, time)
  }
  requestAnimationFrame(update.bind(null, gl, col, transloc, scale, positions))
}

let render = (gl, program, buf, loc, uni, col, transloc, scale) => {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.useProgram(program)
  gl.uniform2f(uni, gl.canvas.width, gl.canvas.height);
  gl.enableVertexAttribArray(loc)
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)

  let size = 2
  let type = gl.FLOAT
  let normalize = false
  let stride = 0
  let offset = 0

  gl.vertexAttribPointer(
    loc,
    size,
    type,
    normalize,
    stride,
    offset
  )

  let x1 = 10
  let x2 = x1 + 10
  let y1 = 10
  let y2 = y1 + 50

  let positions = [
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2
  ]

  requestAnimationFrame(update.bind(null, gl, col, transloc, scale, positions))
}

let initialize = (gl, program) => {
  let loc = gl.getAttribLocation(program, 'a_position')
  let transloc = gl.getUniformLocation(program, "u_translation")
  let uni = gl.getUniformLocation(program, 'u_resolution')
  let col = gl.getUniformLocation(program, 'u_color')
  let scale = gl.getUniformLocation(program, 'u_scale')
  let buf = gl.createBuffer()

  render(gl, program, buf, loc, uni, col, transloc, scale)
}

(() => {
  let gl = document.getElementById('a').getContext('webgl')
  let program = gl.createProgram()
  let shaders = [
    gl.createShader(gl.VERTEX_SHADER),
    gl.createShader(gl.FRAGMENT_SHADER)
  ]

  Promise.all([
    fetch('./b.glsl'),
    fetch('./c.glsl')
  ])
  .then(([v,f]) => {
    Promise.all([
      v.text(),
      f.text()
    ])
    .then((shaderSrcs) => {
      shaderSrcs.forEach((src, i) => {
        let s = shaders[i]
        gl.shaderSource(s, src)
        gl.compileShader(s)
        gl.attachShader(program, s)
      })
      gl.linkProgram(program)
      initialize(gl, program)
    })
  })
})()
