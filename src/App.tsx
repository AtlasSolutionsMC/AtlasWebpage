import './App.css'
import { ShaderBackground } from './ShaderBackground'

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

function App() {
  return (
    <>
      <ShaderBackground />
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
        </div>
      </header>

      <main id="main">
        <section className="hero page-wrap" id="home" aria-labelledby="hero-title">
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
            Monochrome Canvas 2D adaptation with reduced ray-march steps under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noreferrer">CC BY-NC-SA 4.0</a>.
          </small>
        </div>
        <a href="#home">Back to top</a>
      </footer>
    </>
  )
}

export default App
