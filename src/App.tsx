import { useState } from 'react'
import './App.css'
import { ShaderBackground } from './ShaderBackground'

const fontPresets = [
  { id: 'syne', name: 'Syne / DM Sans', sampleFont: "'Syne', sans-serif" },
  { id: 'space-grotesk', name: 'Space Grotesk', sampleFont: "'Space Grotesk', sans-serif" },
  { id: 'manrope', name: 'Manrope', sampleFont: "'Manrope', sans-serif" },
  { id: 'oxanium', name: 'Oxanium / DM Sans', sampleFont: "'Oxanium', sans-serif" },
] as const

type FontPreset = (typeof fontPresets)[number]['id']

const navigation = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'Changlog', href: '#changlog' },
  { label: 'Price', href: '#price' },
  { label: 'Dashbord', href: '#dashbord', dashboard: true },
]

function EmptyState({ message }: { message: string }) {
  return (
    <div className="empty-state">
      <p>{message}</p>
    </div>
  )
}

function FontTester({
  selected,
  onSelect,
}: {
  selected: FontPreset
  onSelect: (font: FontPreset) => void
}) {
  return (
    <details className="font-tester">
      <summary>Font test</summary>
      <div className="font-tester__panel">
        <p className="font-tester__title">Choose a typeface</p>
        {fontPresets.map((font) => (
          <button
            aria-pressed={selected === font.id}
            className="font-tester__option"
            key={font.id}
            onClick={() => onSelect(font.id)}
            style={{ fontFamily: font.sampleFont }}
            type="button"
          >
            <span className="font-tester__name">{font.name}</span>
            <span className="font-tester__sample">Clearer play starts here.</span>
          </button>
        ))}
      </div>
    </details>
  )
}

function App() {
  const [fontChoice, setFontChoice] = useState<FontPreset>('space-grotesk')

  return (
    <div className="app-shell" data-font={fontChoice}>
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="site-header">
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
          <FontTester selected={fontChoice} onSelect={setFontChoice} />
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
                <a className="button button--quiet" href="#dashbord">View Dashbord</a>
              </div>
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
    </div>
  )
}

export default App
