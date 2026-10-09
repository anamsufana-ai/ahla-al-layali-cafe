import { useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { boards, formatAED } from '../data'
import { useAuth } from '../context/Auth'

const tabs = [
  ['details', 'Details'],
  ['menu', 'Menu'],
  ['orders', 'Orders'],
  ['bookings', 'Bookings'],
  ['invoices', 'Invoices'],
]

function Empty({ children }) {
  return <p className="cart-empty-state">{children}</p>
}

export default function AccountPage() {
  const { user, ready, logout, updateProfile } = useAuth()
  const [params, setParams] = useSearchParams()
  const tab = tabs.some(([id]) => id === params.get('tab')) ? params.get('tab') : 'details'
  const [form, setForm] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const draft = form || user
  const set = (key) => (event) => setForm((current) => ({ ...(current || user), [key]: event.target.value }))

  if (!ready) return <section className="page-section"><div className="container"><p>Opening your account…</p></div></section>
  if (!user) return <Navigate to="/login?next=/account" replace />

  const save = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    try {
      await updateProfile(draft)
      setForm(null)
      setMessage('Your details are saved.')
    } catch (updateError) {
      setError(updateError.message)
    }
  }

  const invoices = [
    ...(user.orders || []).map((item) => ({ ...item, kind: 'Order' })),
    ...(user.bookings || []).map((item) => ({ ...item, kind: 'Booking' })),
  ].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <p className="eyebrow" style={{ color: 'var(--gold)' }}>Your account</p>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
        </div>
      </header>
      <section className="page-section">
        <div className="container account-grid">
          <nav className="account-nav" aria-label="Account">
            {tabs.map(([id, label]) => (
              <button key={id} type="button" className={tab === id ? 'active' : ''} onClick={() => setParams({ tab: id })}>
                {label}
              </button>
            ))}
            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
            <button type="button" onClick={logout}>Log out</button>
          </nav>
          <div className="booking-card">
            {tab === 'details' && (
              <form onSubmit={save}>
                <h2>Client details</h2>
                <div className="field">
                  <label htmlFor="a-name">Name</label>
                  <input id="a-name" value={draft.name} onChange={set('name')} />
                </div>
                <div className="field">
                  <label htmlFor="a-dob">Date of birth</label>
                  <input id="a-dob" type="date" value={draft.dob || ''} onChange={set('dob')} />
                  <small className="pay-note">The café uses this for surprise gifts and birthday offers.</small>
                </div>
                <div className="field">
                  <label htmlFor="a-email">Email</label>
                  <input id="a-email" value={user.email} readOnly />
                </div>
                <div className="pay-row">
                  <div className="field">
                    <label htmlFor="a-phone">Phone</label>
                    <input id="a-phone" value={draft.phone || ''} onChange={set('phone')} />
                  </div>
                  <div className="field">
                    <label htmlFor="a-whatsapp">WhatsApp</label>
                    <input id="a-whatsapp" value={draft.whatsapp || ''} onChange={set('whatsapp')} />
                  </div>
                </div>
                <p className="pay-note">
                  {user.marketing
                    ? 'You agreed to receive offers and promotions from Ahla Al Layali Cafe only, by email and by WhatsApp.'
                    : 'Offer messages are not switched on for this account.'}
                </p>
                {message && <p className="promo-ok">{message}</p>}
                {error && <p className="field-error">{error}</p>}
                <button className="btn btn-primary" type="submit">Save details</button>
              </form>
            )}
            {tab === 'menu' && (
              <>
                <h2>Menu</h2>
                <p className="pay-note">Food, drinks, coffee, and shisha. Open a board to order.</p>
                <div className="account-links">
                  {boards.map((board) => (
                    <Link key={board.id} to={`/order?board=${board.id}`}>{board.label}</Link>
                  ))}
                </div>
              </>
            )}
            {tab === 'orders' && (
              <>
                <h2>Orders</h2>
                {(user.orders || []).length === 0 ? <Empty>No orders yet.</Empty> : (
                  <ul className="recent-list">
                    {user.orders.map((order) => (
                      <li className="recent-item" key={order.ref}>
                        <strong>{order.ref}</strong>
                        <p>{order.when || order.mode} · {formatAED(order.total)}</p>
                        <Link to={`/account/invoice/${order.ref}`}>Invoice</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
            {tab === 'bookings' && (
              <>
                <h2>Bookings</h2>
                {(user.bookings || []).length === 0 ? <Empty>No tables booked yet.</Empty> : (
                  <ul className="recent-list">
                    {user.bookings.map((booking) => (
                      <li className="recent-item" key={booking.ref}>
                        <strong>{booking.ref}</strong>
                        <p>{booking.when} · {booking.areaLabel} · {formatAED(booking.total)}</p>
                        <Link to={`/account/invoice/${booking.ref}`}>Invoice</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
            {tab === 'invoices' && (
              <>
                <h2>Invoices</h2>
                {invoices.length === 0 ? <Empty>Invoices appear here after an order or a table fee.</Empty> : (
                  <ul className="recent-list">
                    {invoices.map((item) => (
                      <li className="recent-item" key={item.ref}>
                        <strong>{item.kind} {item.ref}</strong>
                        <p>{formatAED(item.total)}</p>
                        <Link to={`/account/invoice/${item.ref}`}>Open invoice</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
