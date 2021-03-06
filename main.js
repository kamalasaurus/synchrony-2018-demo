
let makeFreq = (ctx, osc, val, note, offs) => {
  osc.frequency.setValueAtTime(val * Math.pow(2, note/12), ctx.currentTime + offs)
}
let makeNoise = () => {
  let ctx = new AudioContext()
  let gain = ctx.createGain()
  let gain.gain.value = 0.03;
  let osc = ctx.createOscillator()

  osc.type = 'triangle'

  let val = 830.61

  osc.frequency.value = val * Math.pow(2, 4/12)

  makeFreq(ctx, osc, val, 7, 0.9)
  makeFreq(ctx, osc, val, 4, 1.35)
  makeFreq(ctx, osc, val, 5, 1.8)
  makeFreq(ctx, osc, val, 4, 2.25)
  makeFreq(ctx, osc, val, 9, 2.7)
  makeFreq(ctx, osc, val, 5, 3.15)
  makeFreq(ctx, osc, val, 7, 3.6)
  makeFreq(ctx, osc, val, 9, 4.15)
  makeFreq(ctx, osc, val, 2, 4.5)

  gain.connect(ctx.destination)
  osc.connect(gain)
  osc.start(0)
  osc.stop(ctx.currentTime + 4.95)

  osc.addEventListener('ended', makeNoise)
}
let createRectangles = (gl, col, transloc, scale, colPos, positions, index, time) => {
  // add transformations to the coords to get rotations in glsl?  start doing them here first
  let primitiveType = gl.TRIANGLES
  let offset = 0
  let count = 6

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  //gl.uniform4f(col, Math.random(), Math.random(), Math.random(), 1)
  gl.uniform1f(col, time)
  gl.uniform1f(colPos, index)
  gl.uniform1f(scale, time)
  gl.uniform1f(transloc, index)
  gl.drawArrays(primitiveType, offset, count)

}

let update = (gl, col, transloc, scale, colPos, positions, time) => {
  for (i = 0; i < 100; i++) {
    createRectangles(gl, col, transloc, scale, colPos, positions, i, time)
  }
  requestAnimationFrame(update.bind(null, gl, col, transloc, scale, colPos, positions))
}

let render = (gl, program, buf, loc, uni, col, transloc, scale, colPos) => {
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

  requestAnimationFrame(update.bind(null, gl, col, transloc, scale, colPos, positions))
}

let initialize = (gl, program) => {
  let loc = gl.getAttribLocation(program, 'a_position')
  let transloc = gl.getUniformLocation(program, "u_translation")
  let uni = gl.getUniformLocation(program, 'u_resolution')
  let col = gl.getUniformLocation(program, 'u_color')
  let scale = gl.getUniformLocation(program, 'u_scale')
  let colPos = gl.getUniformLocation(program, 'u_color_position')
  let buf = gl.createBuffer()

  makeNoise()

  render(gl, program, buf, loc, uni, col, transloc, scale, colPos)
}

(() => {
  let gl = document.getElementById('a').getContext('webgl')
  let program = gl.createProgram()
  let shaders = [
    gl.createShader(gl.VERTEX_SHADER),
    gl.createShader(gl.FRAGMENT_SHADER)
  ]

  Promise.all([
    fetch('./vertex.glsl'),
    fetch('./fragment.glsl')
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
