import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { formatAED } from '../data'
import { useAuth } from '../context/Auth'

export default function AdminPage() {
  const { user, ready, loadAdmin, saveCrm } = useAuth()
  const [desk, setDesk] = useState(null)
  const [error, setError] = useState('')
  const [crm, setCrm] = useState({ provider: '', webhookUrl: '', apiKey: '', connected: false })
  const [note, setNote] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'admin') return undefined
    loadAdmin()
      .then((data) => {
        setDesk(data)
        setCrm((current) => ({
          ...current,
          provider: data.crm?.provider || '',
          webhookUrl: data.crm?.webhookUrl || '',
          connected: data.crm?.connected === true,
        }))
      })
      .catch((loadError) => setError(loadError.message))
    return undefined
  }, [user, loadAdmin])

  if (!ready) return <section className="page-section"><div className="container"><p>Opening the admin space…</p></div></section>
  if (!user) return <Navigate to="/login?next=/admin" replace />
  if (user.role !== 'admin') {
    return (
      <section className="page-section">
        <div className="container"><article className="confirm-card"><h2>This space is for the café owner.</h2></article></div>
      </section>
    )
  }

  const connect = async (event) => {
    event.preventDefault()
    setError('')
    setNote('')
    try {
      const data = await saveCrm(crm)
      setDesk((current) => ({ ...current, crm: data.crm }))
      setCrm((current) => ({ ...current, apiKey: '' }))
      setNote(data.crm.connected ? `${data.crm.provider} is connected. New orders and bookings are sent there.` : 'The CRM is disconnected.')
    } catch (crmError) {
      setError(crmError.message)
    }
  }

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <p className="eyebrow" style={{ color: 'var(--gold)' }}>Café owner</p>
          <h1>Admin</h1>
          <p>{user.email}. Guest list, sales from the site, and the CRM connection.</p>
        </div>
      </header>
      <section className="page-section">
        <div className="container account-stack">
          {error && <p className="field-error">{error}</p>}
          <article className="booking-card">
            <h2>Connect a CRM</h2>
            <p className="pay-note">Online orders and table bookings are sent to the café’s own system so they sit with the rest of the sales.</p>
            <form onSubmit={connect}>
              <div className="field">
                <label htmlFor="crm-name">CRM name</label>
                <input id="crm-name" value={crm.provider} onChange={(event) => setCrm((current) => ({ ...current, provider: event.target.value }))} placeholder="The system the café already uses" />
              </div>
              <div className="field">
                <label htmlFor="crm-url">Webhook address</label>
                <input id="crm-url" value={crm.webhookUrl} onChange={(event) => setCrm((current) => ({ ...current, webhookUrl: event.target.value }))} placeholder="https://" />
              </div>
              <div className="field">
                <label htmlFor="crm-key">API key</label>
                <input id="crm-key" value={crm.apiKey} onChange={(event) => setCrm((current) => ({ ...current, apiKey: event.target.value }))} placeholder={desk?.crm?.apiKeySet ? 'A key is saved. Type a new one to replace it.' : 'Optional'} />
              </div>
              <label className="policy-check">
                <input type="checkbox" checked={crm.connected} onChange={(event) => setCrm((current) => ({ ...current, connected: event.target.checked }))} />
                <span>Synchronize online orders and bookings with this CRM.</span>
              </label>
              {note && <p className="promo-ok">{note}</p>}
              <button className="btn btn-primary" type="submit">{crm.connected ? 'Save connection' : 'Disconnect'}</button>
            </form>
          </article>
          <article className="booking-card">
            <h2>Client list</h2>
            <p className="pay-note">Name, date of birth, email, phone, and WhatsApp. This is the list for café offers.</p>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Date of birth</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>WhatsApp</th>
                    <th>Offers</th>
                  </tr>
                </thead>
                <tbody>
                  {(desk?.clients || []).length === 0 ? (
                    <tr><td colSpan="6">No guest accounts yet.</td></tr>
                  ) : desk.clients.map((client) => (
                    <tr key={client.email}>
                      <td>{client.name}{client.birthday ? ` · ${client.birthday}` : ''}</td>
                      <td>{client.dob}</td>
                      <td>{client.email}</td>
                      <td>{client.phone}</td>
                      <td>{client.whatsapp}</td>
                      <td>{client.marketing ? 'Email and WhatsApp' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
          <article className="booking-card">
            <h2>Online orders</h2>
            {(desk?.orders || []).length === 0 ? <p className="cart-empty-state">No online orders yet.</p> : (
              <ul className="recent-list">
                {desk.orders.map((order) => (
                  <li className="recent-item" key={`${order.email}-${order.ref}`}>
                    <strong>{order.ref}</strong>
                    <p>{order.client} · {order.mode} · {formatAED(order.total)} · CRM {order.crm || 'skipped'}</p>
                  </li>
                ))}
              </ul>
            )}
          </article>
          <article className="booking-card">
            <h2>Bookings</h2>
            {(desk?.bookings || []).length === 0 ? <p className="cart-empty-state">No online bookings yet.</p> : (
              <ul className="recent-list">
                {desk.bookings.map((booking) => (
                  <li className="recent-item" key={`${booking.email}-${booking.ref}`}>
                    <strong>{booking.ref}</strong>
                    <p>{booking.client} · {booking.when} · {formatAED(booking.total)} · CRM {booking.crm || 'skipped'}</p>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </div>
      </section>
    </>
  )
}
