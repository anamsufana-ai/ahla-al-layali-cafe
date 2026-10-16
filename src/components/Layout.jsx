import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { cafe, whatsappLink } from '../data'
import { useStore } from '../context/Store'
import { useAuth } from '../context/Auth'

const links = [
  ['/', 'Home'],
  ['/menu', 'Menu'],
  ['/about', 'About'],
  ['/gallery', 'Gallery'],
  ['/contact', 'Contact'],
]

function Mark() {
  return <img className="brand-mark" src="/logo.png" alt="" />
}

export default function Layout() {
  const { totals, toast } = useStore()
  const { user } = useAuth()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12)
      setShowTop(window.scrollY > 500)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  const solid = scrolled || location.pathname !== '/'

  return (
    <>
      <div className={`loader ${loaded ? 'done' : ''}`} aria-hidden={loaded}>
        <div>
          <img className="loader-logo" src="/logo.png" alt="" />
          <p>Welcome</p>
        </div>
      </div>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className={`navbar ${solid ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          <Link to="/" className="brand" aria-label="Ahla Al Layali Cafe home">
            <Mark />
            <span className="brand-text">
              <strong>Ahla Al Layali</strong>
              <span>Cafe</span>
            </span>
          </Link>
          <nav aria-label="Primary">
            <ul className="nav-links">
              {links.map(([to, label]) => (
                <li key={to}>
                  <NavLink to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
                    {label}
                  </NavLink>
                </li>
              ))}
              <li>
                <NavLink to={user ? (user.role === 'admin' ? '/admin' : '/account') : '/login'}>
                  {user ? 'Account' : 'Log in'}
                </NavLink>
              </li>
              <li>
                <NavLink to="/order" className="nav-order">
                  Order
                  {totals.count > 0 && <span className="nav-cart-badge">{totals.count}</span>}
                </NavLink>
              </li>
              <li>
                <NavLink to="/book" className="nav-cta">
                  Book a table
                </NavLink>
              </li>
            </ul>
          </nav>
          <button className="menu-toggle" type="button" aria-label="Open menu" onClick={() => setOpen((value) => !value)}>
            <span />
          </button>
          {open && (
            <div className="mobile-panel">
              {links.map(([to, label]) => (
                <NavLink key={to} to={to} end={to === '/'}>
                  {label}
                </NavLink>
              ))}
              <NavLink to={user ? (user.role === 'admin' ? '/admin' : '/account') : '/login'}>{user ? 'Account' : 'Log in'}</NavLink>
              <NavLink to="/order">Order {totals.count > 0 ? `(${totals.count})` : ''}</NavLink>
              <NavLink to="/book">Book a table</NavLink>
            </div>
          )}
        </div>
      </header>
      <main id="main">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="footer-newsletter">
          <div className="container newsletter-inner">
            <div>
              <h3>Monday to Wednesday deals</h3>
              <p>Shisha with tea, Turkish coffee, a sweet, or fresh juice. Message the café and they will hold a table.</p>
            </div>
            <a className="btn btn-primary" href={whatsappLink('Hi Ahla Al Layali, I would like to hear about table openings and the Monday–Wednesday shisha deals.')}>
              Message on WhatsApp
            </a>
          </div>
        </div>
        <div className="container footer-grid">
          <div>
            <div className="brand">
              <Mark />
              <span className="brand-text">
                <strong>Ahla Al Layali</strong>
                <span>Cafe</span>
              </span>
            </div>
            <p style={{ marginTop: '0.8rem' }}>
              {cafe.nameAr}. Coffee, a late kitchen, and shisha in France Cluster, International City.
            </p>
          </div>
          <div>
            <h3>Visit</h3>
            <ul className="footer-links">
              {links.map(([to, label]) => (
                <li key={to}>
                  <Link to={to}>{label}</Link>
                </li>
              ))}
              <li>
                <Link to="/book">Book a table</Link>
              </li>
              <li>
                <Link to="/order">Order online</Link>
              </li>
              <li>
                <Link to="/account">Account</Link>
              </li>
              <li>
                <Link to="/terms">Terms</Link>
              </li>
              <li>
                <Link to="/privacy">Privacy</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3>Café</h3>
            <p>{cafe.addressLines.join(', ')}</p>
            <p style={{ marginTop: '0.6rem' }}>
              <a href={`tel:${cafe.phoneTel}`}>{cafe.phoneDisplay}</a>
            </p>
            <p style={{ marginTop: '0.35rem' }}>Open 24/7</p>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} Ahla Al Layali Cafe</span>
          <span>
            <Link to="/terms">Terms</Link>
            {' · '}
            <Link to="/privacy">Privacy</Link>
          </span>
          <span>© 2026 Designed by ALEXIS FZC LLC</span>
        </div>
      </footer>
      {showTop && (
        <button className="back-to-top" type="button" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          ↑
        </button>
      )}
      {toast && <div className="toast">{toast}</div>}
    </>
  )
}
