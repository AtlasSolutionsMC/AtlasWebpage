import { useEffect, useRef } from 'react'

/*
 * Adapted from "2TC 15 Psychedelic Sand Dunes" by Reinder Nijhoff (2015).
 * https://www.shadertoy.com/view/MtlGWM
 * Licensed under CC BY-NC-SA 4.0:
 * https://creativecommons.org/licenses/by-nc-sa/4.0/
 *
 * Changes: Shadertoy uniforms and output ported to WebGL, color mapped to
 * monochrome, and animation capped at 24 fps. The drawing buffer uses the
 * full viewport resolution multiplied by the device pixel ratio.
 */
export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas?.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: 'high-performance',
      stencil: false,
    })
    if (!canvas || !gl) return

    const vertexSource = `
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `

    const precision = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT)
    const fragmentSource = `
      ${precision?.precision ? 'precision highp float;' : 'precision mediump float;'}
      uniform vec2 uResolution;
      uniform float uTime;

      void main() {
        vec3 d = vec3(gl_FragCoord.xy / uResolution - 0.5, 0.5);
        vec3 p = vec3(0.0);
        vec3 o = d;
        o.z += uTime * 4.0;

        float i = 0.0;
        for (int step = 0; step < 900; step++) {
          if (i >= 9.0) break;
          float surface = cos(p.z) - abs(sin(p.x * 0.7 + cos(p.z)));
          p.y += 1.0;
          if (!(surface < p.y)) break;

          p = (o += d * i * 0.05) * 0.3;
          i += 0.01;
        }

        float mixAmount = i / 9.0;
        vec3 color = mix((3.0 + p.y) * vec3(0.6, 0.3, 0.0), d, mixAmount);
        float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
        gl_FragColor = vec4(vec3(clamp(luminance, 0.0, 1.0)), 1.0);
      }
    `

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type)
      if (!shader) return null

      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader)
        return null
      }

      return shader
    }

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource)
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource)
    if (!vertexShader || !fragmentShader) {
      if (vertexShader) gl.deleteShader(vertexShader)
      if (fragmentShader) gl.deleteShader(fragmentShader)
      return
    }

    const program = gl.createProgram()
    if (!program) {
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
      return
    }

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program)
      return
    }

    const positionLocation = gl.getAttribLocation(program, 'aPosition')
    const resolutionLocation = gl.getUniformLocation(program, 'uResolution')
    const timeLocation = gl.getUniformLocation(program, 'uTime')
    const buffer = gl.createBuffer()
    if (positionLocation < 0 || !resolutionLocation || !timeLocation || !buffer) {
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      return
    }

    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let animationTimeout = 0
    let startTime = 0

    const draw = (seconds: number) => {
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
      gl.uniform1f(timeLocation, seconds)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    const resize = () => {
      const pixelRatio = window.devicePixelRatio || 1
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * pixelRatio))
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * pixelRatio))
      draw(0)
    }

    const animate = () => {
      draw((performance.now() - startTime) / 1000)
      animationTimeout = window.setTimeout(animate, 1000 / 24)
    }

    const startAnimation = () => {
      window.clearTimeout(animationTimeout)
      if (reducedMotion.matches || document.hidden) {
        draw(0)
        return
      }
      startTime = performance.now()
      animationTimeout = window.setTimeout(animate, 1000 / 24)
    }

    const handleVisibilityChange = () => {
      if (document.hidden) window.clearTimeout(animationTimeout)
      else startAnimation()
    }

    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas.parentElement ?? canvas)
    window.addEventListener('resize', resize)
    reducedMotion.addEventListener('change', startAnimation)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    startAnimation()

    return () => {
      window.clearTimeout(animationTimeout)
      resizeObserver.disconnect()
      window.removeEventListener('resize', resize)
      reducedMotion.removeEventListener('change', startAnimation)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
    }
  }, [])

  return (
    <div className="shader-background" aria-hidden="true">
      <canvas ref={canvasRef} className="shader-background__canvas" />
    </div>
  )
}
