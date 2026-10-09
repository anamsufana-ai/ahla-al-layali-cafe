import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/Auth'

const nextPath = (value) => (value && value.startsWith('/') && !value.startsWith('//') ? value : '/account')

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const next = nextPath(params.get('next'))

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const user = await login(email, password)
      navigate(user.role === 'admin' && next === '/account' ? '/admin' : next)
    } catch (loginError) {
      setError(loginError.message)
      setBusy(false)
    }
  }

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <p className="eyebrow" style={{ color: 'var(--gold)' }}>Guest account</p>
          <h1>Log in</h1>
          <p>Use the email on your Ahla Al Layali account.</p>
        </div>
      </header>
      <section className="page-section">
        <form className="booking-card auth-card" onSubmit={submit}>
          <div className="field">
            <label htmlFor="l-email">Email</label>
            <input id="l-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="l-password">Password</label>
            <input id="l-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
          </div>
          {error && <p className="field-error">{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? 'Checking the account…' : 'Log in'}
          </button>
          <p className="pay-note">
            New guest? <Link to={`/register?next=${encodeURIComponent(next)}`}>Create an account</Link>
          </p>
        </form>
      </section>
    </>
  )
}
