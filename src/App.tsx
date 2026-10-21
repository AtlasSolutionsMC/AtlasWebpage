import { useEffect, useState } from 'react'
import './App.css'
import { ShaderBackground } from './ShaderBackground'

const navigation = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'Changlog', href: '#changlog' },
  { label: 'Price', href: '#price' },
  { label: 'Dashbord', href: '#dashbord', dashboard: true },
]

const terminalLines = [
  { time: '01:08:41', level: 'INFO', scope: 'Atlas', message: 'Boot sequence started' },
  { time: '01:08:41', level: 'INFO', scope: 'Platform', message: 'Paper 1.21.11 detected' },
  { time: '01:08:41', level: 'INFO', scope: 'Config', message: 'Configuration loaded' },
  { time: '01:08:42', level: 'INFO', scope: 'Network', message: 'Packet pipeline ready' },
  { time: '01:08:42', level: 'INFO', scope: 'Checks', message: '12 detection modules loaded' },
  { time: '01:08:42', level: 'INFO', scope: 'Movement', message: 'Movement checks enabled' },
  { time: '01:08:42', level: 'INFO', scope: 'Combat', message: 'Combat checks enabled' },
  { time: '01:08:43', level: 'INFO', scope: 'Storage', message: 'Profile cache initialized' },
  { time: '01:09:02', level: 'INFO', scope: 'Session', message: 'SamplePlayer connected' },
  { time: '01:09:05', level: 'WARN', scope: 'Movement', message: 'Unusual acceleration sample' },
  { time: '01:09:05', level: 'INFO', scope: 'Review', message: 'Evidence attached to alert' },
  { time: '01:09:06', level: 'INFO', scope: 'Atlas', message: 'Protection status: active' },
]

function TerminalPreview() {
  return (
    <div className="terminal-stage">
      <div className="terminal-window" role="img" aria-label="Simulated Atlas Anticheat terminal output">
        <div className="terminal-window__bar">
          <span>ATLAS CONSOLE</span>
          <span className="terminal-window__mode">SIMULATED OUTPUT</span>
        </div>
        <div className="terminal-window__body" aria-hidden="true">
          <div className="terminal-system-stats">
            <p className="terminal-system-stats__row">
              <span>Usage of /:</span>
              <span>78.8% of 250 GB</span>
            </p>
            <p className="terminal-system-stats__row">
              <span>Memory usage:</span>
              <span>67%</span>
            </p>
            <p className="terminal-system-stats__row">
              <span>Swap usage:</span>
              <span>60%</span>
            </p>
          </div>
          <div className="terminal-window__logs">
            {terminalLines.map((line) => (
              <p className="terminal-line" key={`${line.time}-${line.scope}-${line.message}`}>
                <span className="terminal-line__time">[{line.time}</span>
                <span className={`terminal-line__level${line.level === 'WARN' ? ' terminal-line__level--warn' : ''}`}>
                  {line.level}
                </span>
                <span className="terminal-line__scope">[{line.scope}]</span>
                <span className="terminal-line__message">{line.message}</span>
              </p>
            ))}
          </div>
          <div className="terminal-window__prompt">
            <span>atlas@server:~$</span>
            <span>status</span>
            <span className="terminal-window__cursor" />
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="empty-state">
      <p>{message}</p>
    </div>
  )
}

function App() {
  const [headerScrolled, setHeaderScrolled] = useState(false)

  useEffect(() => {
    const landing = document.getElementById('home')
    if (!landing) return

    const observer = new IntersectionObserver(([entry]) => {
      setHeaderScrolled(entry.boundingClientRect.bottom <= 0)
    })

    observer.observe(landing)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      <header className={`site-header${headerScrolled ? ' site-header--scrolled' : ''}`}>
        <div className="header-inner">
          <a className="wordmark" href="#home" aria-label="Atlas Anticheat home">ATLAS</a>
          <nav className="main-nav" aria-label="Main navigation">
            {navigation.map((item) => (
              <a
                className={item.dashboard ? 'nav-link nav-link--dashboard' : 'nav-link'}
                href={item.href}
                key={item.label}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="home" aria-labelledby="hero-title">
          <ShaderBackground />
          <div className="hero-inner page-wrap">
            <div className="hero-copy">
              <p className="hero-kicker">A new home for Atlas Anticheat</p>
              <h1 id="hero-title">Clearer play<br />starts here.</h1>
              <p className="hero-intro">
                Atlas Anticheat for Minecraft. Product details, updates and access will take shape here.
              </p>
              <div className="hero-actions">
                <a className="button button--primary" href="#features">Explore Features</a>
                <a className="button button--quiet button--dashboard" href="#dashbord">View Dashbord</a>
              </div>
            </div>
            <div className="hero-terminal">
              <TerminalPreview />
            </div>
          </div>
          <a className="scroll-cue" href="#features">Scroll to explore</a>
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
            <EmptyState message="Feature details will be added soon." />
          </div>
        </section>

        <section className="content-section page-wrap" id="changlog" aria-labelledby="changlog-title">
          <div className="section-heading section-heading--compact">
            <div>
              <p className="section-kicker">A record of what changes</p>
              <h2 id="changlog-title">Changlog</h2>
            </div>
            <EmptyState message="Update notes will appear here." />
          </div>
        </section>

        <section className="content-section page-wrap" id="price" aria-labelledby="price-title">
          <div className="section-heading section-heading--compact">
            <div>
              <p className="section-kicker">Straightforward by design</p>
              <h2 id="price-title">Price</h2>
            </div>
            <EmptyState message="Pricing information will be added soon." />
          </div>
        </section>

        <section className="dashboard-section page-wrap" id="dashbord" aria-labelledby="dashbord-title">
          <div className="dashboard-heading">
            <p className="section-kicker">Live console</p>
            <h2 id="dashbord-title">Dashbord</h2>
            <p>One place for the full picture.</p>
          </div>
          <div className="dashboard-window">
            <div className="dashboard-window__bar">
              <span>ATLAS / OVERVIEW</span>
              <span>Preview</span>
            </div>
            <EmptyState message="Dashboard details will be added soon." />
          </div>
        </section>
      </main>

      <footer className="site-footer page-wrap">
        <a className="wordmark wordmark--footer" href="#home" aria-label="Atlas Anticheat home">ATLAS</a>
        <div className="footer-meta">
          <span>Atlas Anticheat</span>
          <small>
            Background: <a href="https://www.shadertoy.com/view/MtlGWM" target="_blank" rel="noreferrer">2TC 15 Psychedelic Sand Dunes by Reinder Nijhoff (2015)</a>.
            Monochrome WebGL adaptation under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noreferrer">CC BY-NC-SA 4.0</a>.
          </small>
        </div>
        <a href="#home">Back to top</a>
      </footer>
    </>
  )
}

export default App
