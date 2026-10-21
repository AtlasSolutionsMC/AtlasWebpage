import { useEffect, useRef } from 'react'
import './App.css'

const navigation = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'Changlog', href: '#changlog' },
  { label: 'Price', href: '#price' },
  { label: 'Dashbord', href: '#dashbord', dashboard: true },
]

const fallbackBars = [
  '18%', '34%', '25%', '61%', '43%', '78%', '53%', '32%', '69%', '46%',
  '84%', '57%', '39%', '72%', '49%', '29%', '65%', '42%', '76%', '55%',
]

const vertexShaderSource = `
  attribute vec2 aPosition;
  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`

// A compact Shadertoy-style field: discrete contour lines and short signal bars.
const fragmentShaderSource = `
  precision highp float;
  uniform vec2 iResolution;
  uniform float iTime;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec2 p = uv - 0.5;
    p.x *= iResolution.x / iResolution.y;

    float drift = sin(p.y * 5.8 + iTime * 0.18) * 0.09;
    float radius = length(vec2(p.x + drift, p.y * 0.82));
    float contour = abs(fract(radius * 11.0) - 0.5);
    float row = floor(uv.y * 44.0);
    float cell = floor(uv.x * 19.0);
    float bar = step(0.982, hash(vec2(cell, row)));
    float tick = step(0.54, fract(uv.x * 19.0 + iTime * 0.025));
    float sweep = 1.0 - step(0.004, abs(p.y - sin(p.x * 4.4 + iTime * 0.13) * 0.19));

    vec3 color = vec3(11.0, 16.0, 13.0) / 255.0;
    if (contour < 0.018) color = vec3(42.0, 60.0, 47.0) / 255.0;
    if (bar * tick > 0.5) color = vec3(67.0, 85.0, 62.0) / 255.0;
    if (sweep > 0.5 && mod(cell, 4.0) < 1.0) color = vec3(199.0, 231.0, 113.0) / 255.0;

    gl_FragColor = vec4(color, 1.0);
  }
`

function ShaderField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas?.getContext('webgl', {
      alpha: false,
      antialias: false,
      powerPreference: 'low-power',
    })

    if (!canvas || !gl) return

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

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource)
    if (!vertexShader || !fragmentShader) return

    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return

    const buffer = gl.createBuffer()
    if (!buffer) return
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    gl.useProgram(program)

    const position = gl.getAttribLocation(program, 'aPosition')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const resolution = gl.getUniformLocation(program, 'iResolution')
    const time = gl.getUniformLocation(program, 'iTime')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
    let width = 1
    let height = 1
    let startTime = 0
    let animationFrame = 0

    const draw = (seconds: number) => {
      gl.uniform2f(resolution, width, height)
      gl.uniform1f(time, seconds)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const { width: cssWidth, height: cssHeight } = entries[0].contentRect
      width = Math.max(1, Math.round(cssWidth * pixelRatio))
      height = Math.max(1, Math.round(cssHeight * pixelRatio))
      canvas.width = width
      canvas.height = height
      gl.viewport(0, 0, width, height)
      draw(0)
    })
    resizeObserver.observe(canvas)

    const animate = (timestamp: number) => {
      if (startTime === 0) startTime = timestamp
      draw(reducedMotion ? 0 : (timestamp - startTime) / 1000)
      if (!reducedMotion) animationFrame = requestAnimationFrame(animate)
    }
    animationFrame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
    }
  }, [])

  return <canvas ref={canvasRef} className="shader-canvas" aria-hidden="true" />
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="empty-state">
      <div className="empty-state__bars" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p>{message}</p>
    </div>
  )
}

function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="site-header">
        <div className="header-inner">
          <a className="wordmark" href="#home" aria-label="Atlas Anticheat home">
            <span className="wordmark__bars" aria-hidden="true"><i /><i /><i /></span>
            <span>ATLAS</span>
          </a>
          <nav className="main-nav" aria-label="Main navigation">
            {navigation.map((item) => (
              <a
                className={`nav-link${item.dashboard ? ' nav-link--dashboard' : ''}`}
                href={item.href}
                key={item.label}
              >
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="hero page-wrap" id="home" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="hero-kicker"><span className="kicker-rule" />A new home for Atlas Anticheat</p>
            <h1 id="hero-title">Clearer play<br />starts here.</h1>
            <p className="hero-intro">
              Atlas Anticheat for Minecraft. Product details, updates and access will take shape here.
            </p>
            <div className="hero-actions">
              <a className="button button--primary" href="#features">Explore Features</a>
              <a className="button button--quiet" href="#dashbord">View Dashbord</a>
            </div>
          </div>

          <div className="signal-panel" role="img" aria-label="Animated field of contour lines and signal bars">
            <div className="signal-panel__top">
              <span className="signal-panel__title">Atlas / Signal field</span>
              <span className="signal-panel__state"><i />Preview</span>
            </div>
            <div className="signal-visual" aria-hidden="true">
              <div className="fallback-bars">
                {fallbackBars.map((width, index) => (
                  <span key={`${width}-${index}`} style={{ width }} />
                ))}
              </div>
              <ShaderField />
              <span className="visual-crosshair visual-crosshair--one" />
              <span className="visual-crosshair visual-crosshair--two" />
              <span className="visual-coordinate">FIELD / 01</span>
            </div>
            <div className="signal-panel__bottom">
              <span>Observe</span><span className="signal-panel__track"><i /></span><span>Respond</span>
            </div>
          </div>

          <a className="scroll-cue" href="#features"><span />Scroll to explore</a>
        </section>

        <section className="content-section page-wrap" id="features" aria-labelledby="features-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Built around a better signal</p>
              <h2 id="features-title">Features</h2>
            </div>
            <p className="section-summary">A clear space for everything Atlas can do.</p>
          </div>
          <div className="feature-placeholder">
            <div className="feature-placeholder__rail" aria-hidden="true"><i /><i /><i /><i /></div>
            <EmptyState message="Feature details will be added soon." />
            <span className="placeholder-edge" aria-hidden="true" />
          </div>
        </section>

        <section className="content-section content-section--lined page-wrap" id="changlog" aria-labelledby="changlog-title">
          <div className="section-heading section-heading--compact">
            <div>
              <p className="section-kicker">A record of what changes</p>
              <h2 id="changlog-title">Changlog</h2>
            </div>
            <EmptyState message="Update notes will appear here." />
          </div>
          <div className="section-rule" aria-hidden="true"><span /><span /><span /><span /><span /></div>
        </section>

        <section className="content-section page-wrap" id="price" aria-labelledby="price-title">
          <div className="section-heading section-heading--compact">
            <div>
              <p className="section-kicker">Straightforward by design</p>
              <h2 id="price-title">Price</h2>
            </div>
            <EmptyState message="Pricing information will be added soon." />
          </div>
          <div className="price-rule" aria-hidden="true"><span /></div>
        </section>

        <section className="dashboard-section page-wrap" id="dashbord" aria-labelledby="dashbord-title">
          <div className="dashboard-heading">
            <div className="dashboard-ring"><h2 id="dashbord-title">Dashbord</h2></div>
            <p>One place for the full picture.</p>
          </div>
          <div className="dashboard-window">
            <div className="dashboard-window__bar">
              <span>ATLAS / OVERVIEW</span>
              <span className="dashboard-window__status"><i />Preview</span>
            </div>
            <div className="dashboard-window__body">
              <div className="dashboard-rails" aria-hidden="true">
                <span /><span /><span /><span /><span /><span />
              </div>
              <EmptyState message="Dashboard details will be added soon." />
            </div>
            <div className="dashboard-window__footer"><span /><span /><span /></div>
          </div>
        </section>
      </main>

      <footer className="site-footer page-wrap">
        <a className="wordmark wordmark--footer" href="#home" aria-label="Atlas Anticheat home">
          <span className="wordmark__bars" aria-hidden="true"><i /><i /><i /></span>
          <span>ATLAS</span>
        </a>
        <span>Atlas Anticheat</span>
        <a href="#home">Back to top</a>
      </footer>
    </>
  )
}

export default App
