import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { whatsappLink } from '../data'
import { useStore } from '../context/Store'

export default function CheckoutSuccess() {
  const [params] = useSearchParams()
  const sessionId = params.get('session_id') || ''
  const { saveBooking, saveOrder } = useStore()
  const [state, setState] = useState({ status: 'loading' })

  useEffect(() => {
    if (!sessionId) {
      setState({ status: 'error', message: 'This page needs a payment from Stripe.' })
      return undefined
    }
    let ignore = false
    fetch(`/.netlify/functions/checkout-session?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (response) => {
        const data = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(data.error || 'The payment receipt could not be loaded.')
        return data
      })
      .then((data) => {
        if (ignore) return
        if (!data.paid) {
          setState({ status: 'error', message: 'The card payment was not completed.' })
          return
        }
        const mark = `aal-paid-${data.ref}`
        if (!sessionStorage.getItem(mark)) {
          if (data.kind === 'booking') saveBooking(data.record)
          if (data.kind === 'order') saveOrder(data.record)
          sessionStorage.setItem(mark, '1')
        }
        setState({ status: 'paid', ...data })
      })
      .catch((error) => {
        if (!ignore) setState({ status: 'error', message: error.message })
      })
    return () => {
      ignore = true
    }
  }, [sessionId, saveBooking, saveOrder])

  return (
    <section className="page-section">
      <div className="container">
        {state.status === 'loading' && <p>Checking the card payment…</p>}
        {state.status === 'error' && (
          <article className="confirm-card">
            <h2>Payment not finished</h2>
            <p className="muted">{state.message}</p>
            <Link className="btn btn-primary" to="/book">
              Back to booking
            </Link>
          </article>
        )}
        {state.status === 'paid' && (
          <article className="confirm-card">
            <span className="confirm-kicker">Paid by card</span>
            <h2>{state.kind === 'booking' ? 'The table fee is paid' : 'The order is paid'}</h2>
            <p className="ref">{state.ref}</p>
            <p className="muted">{state.total}. Stripe has the card receipt.</p>
            {state.kind === 'booking' && (
              <p className="muted">The fee is not refunded if you cancel or do not show up. Send the receipt to the café so they hold the table.</p>
            )}
            <div className="inline-actions">
              <a className="btn btn-primary" href={whatsappLink(state.text)} target="_blank" rel="noreferrer">
                Send receipt on WhatsApp
              </a>
              <Link className="btn btn-dark" to={state.kind === 'booking' ? '/book' : '/order'}>
                {state.kind === 'booking' ? 'Back to bookings' : 'Back to the menu'}
              </Link>
            </div>
          </article>
        )}
      </div>
    </section>
  )
}
