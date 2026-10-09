import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/Auth'

const nextPath = (value) => (value && value.startsWith('/') && !value.startsWith('//') ? value : '/account')

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [form, setForm] = useState({ name: '', dob: '', email: '', phone: '', whatsapp: '', password: '' })
  const [terms, setTerms] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await register({ ...form, terms, marketing })
      navigate(nextPath(params.get('next')))
    } catch (registerError) {
      setError(registerError.message)
      setBusy(false)
    }
  }

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <p className="eyebrow" style={{ color: 'var(--gold)' }}>Guest account</p>
          <h1>Create an account</h1>
          <p>An account is how you order, book a table, and keep your invoices.</p>
        </div>
      </header>
      <section className="page-section">
        <form className="booking-card auth-card" onSubmit={submit}>
          <div className="field">
            <label htmlFor="r-name">Name</label>
            <input id="r-name" value={form.name} onChange={set('name')} autoComplete="name" />
          </div>
          <div className="field">
            <label htmlFor="r-dob">Date of birth</label>
            <input id="r-dob" type="date" value={form.dob} onChange={set('dob')} />
            <small className="pay-note">Used for surprise gifts and birthday offers from the café.</small>
          </div>
          <div className="field">
            <label htmlFor="r-email">Email</label>
            <input id="r-email" type="email" value={form.email} onChange={set('email')} autoComplete="email" />
          </div>
          <div className="pay-row">
            <div className="field">
              <label htmlFor="r-phone">Phone</label>
              <input id="r-phone" value={form.phone} onChange={set('phone')} autoComplete="tel" placeholder="05…" />
            </div>
            <div className="field">
              <label htmlFor="r-whatsapp">WhatsApp</label>
              <input id="r-whatsapp" value={form.whatsapp} onChange={set('whatsapp')} placeholder="05…" />
            </div>
          </div>
          <div className="field">
            <label htmlFor="r-password">Password</label>
            <input id="r-password" type="password" value={form.password} onChange={set('password')} autoComplete="new-password" />
          </div>
          <label className="policy-check">
            <input type="checkbox" checked={terms} onChange={(event) => setTerms(event.target.checked)} />
            <span>
              I agree to the <Link to="/terms">terms</Link> and the <Link to="/privacy">privacy policy</Link>.
            </span>
          </label>
          <label className="policy-check">
            <input type="checkbox" checked={marketing} onChange={(event) => setMarketing(event.target.checked)} />
            <span>I agree to receive offers and promotions from Ahla Al Layali Cafe only, by email and by WhatsApp.</span>
          </label>
          {error && <p className="field-error">{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? 'Opening the account…' : 'Create account'}
          </button>
          <p className="pay-note">
            Already registered? <Link to={`/login?next=${encodeURIComponent(nextPath(params.get('next')))}`}>Log in</Link>
          </p>
        </form>
      </section>
    </>
  )
}
