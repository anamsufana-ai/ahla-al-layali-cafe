import { Link, Navigate, useParams } from 'react-router-dom'
import { cafe, formatAED } from '../data'
import { useAuth } from '../context/Auth'

export default function InvoicePage() {
  const { ref } = useParams()
  const { user, ready } = useAuth()
  if (!ready) return <section className="page-section"><div className="container"><p>Opening the invoice…</p></div></section>
  if (!user) return <Navigate to={`/login?next=/account/invoice/${ref || ''}`} replace />
  const order = (user.orders || []).find((item) => item.ref === ref)
  const booking = (user.bookings || []).find((item) => item.ref === ref)
  const item = order || booking
  if (!item) {
    return (
      <section className="page-section">
        <div className="container">
          <article className="confirm-card">
            <h2>Invoice not found</h2>
            <Link to="/account?tab=invoices">Back to invoices</Link>
          </article>
        </div>
      </section>
    )
  }
  const lines = item.lines?.length ? item.lines : [item.summary || item.areaLabel || 'Café charge']

  return (
    <section className="page-section">
      <div className="container">
        <article className="confirm-card invoice-sheet">
          <p className="eyebrow" style={{ color: 'var(--gold)' }}>Invoice</p>
          <h2>{item.ref}</h2>
          <p>{cafe.name}</p>
          <p className="muted">{cafe.addressLines.join(', ')}</p>
          <p className="muted">{cafe.phoneDisplay}</p>
          <div className="receipt">
            <div className="receipt-row"><span>Bill to</span><strong>{user.name}</strong></div>
            <div className="receipt-row"><span>Email</span><strong>{user.email}</strong></div>
            <div className="receipt-row"><span>Phone</span><strong>{user.phone}</strong></div>
            <div className="receipt-row"><span>WhatsApp</span><strong>{user.whatsapp}</strong></div>
            <div className="receipt-row"><span>Date</span><strong>{String(item.createdAt || '').slice(0, 10)}</strong></div>
            {lines.map((line) => (
              <div className="receipt-row" key={line}><span>{line}</span></div>
            ))}
            <div className="receipt-row"><strong>Total</strong><strong>{formatAED(item.total)}</strong></div>
          </div>
          <p className="pay-note">Paid at the Ahla Al Layali checkout counter.</p>
          <div className="inline-actions">
            <button className="btn btn-primary" type="button" onClick={() => window.print()}>Print invoice</button>
            <Link className="btn btn-line" to="/account?tab=invoices">Back to invoices</Link>
          </div>
        </article>
      </div>
    </section>
  )
}
