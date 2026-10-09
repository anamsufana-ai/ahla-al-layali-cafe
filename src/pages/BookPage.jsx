import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { areas, cafe, formatAED, menu, occasions, seating, timeSlots, whatsappLink } from '../data'
import { useStore } from '../context/Store'
import { useAuth } from '../context/Auth'
import CardCounter from '../components/CardCounter'

const MIN_GUESTS = cafe.minGuests

function areaBy(id) {
  return areas.find((area) => area.id === id) || areas[0]
}

function reference() {
  return `AAL-${Date.now().toString().slice(-6)}`
}

function guestCount(value) {
  const count = Number(value)
  return Number.isFinite(count) && count >= MIN_GUESTS ? String(count) : String(MIN_GUESTS)
}

export default function BookPage() {
  const [params] = useSearchParams()
  const { bookings, saveBooking } = useStore()
  const { user, saveRecord } = useAuth()
  const navigate = useNavigate()
  const flavors = useMemo(
    () => menu.filter((item) => item.category === 'Shisha' && !item.name.toLowerCase().includes('renew')),
    [],
  )
  const [step, setStep] = useState('details')
  const [accepted, setAccepted] = useState(false)
  const [paidCard, setPaidCard] = useState('')
  const [form, setForm] = useState({
    name: '',
    phone: '',
    date: params.get('date') || '',
    time: params.get('time') || '8:00 PM',
    guests: guestCount(params.get('guests') || '2'),
    tables: '1',
    area: areaBy(params.get('area')).id,
    seating: 'lounge',
    occasion: occasions[0],
    flavor: params.get('flavor') || '',
    notes: '',
  })
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(null)

  useEffect(() => {
    const flavor = params.get('flavor')
    const date = params.get('date')
    const time = params.get('time')
    const guests = params.get('guests')
    const area = params.get('area')
    if (!flavor && !date && !time && !guests && !area) return
    setForm((current) => ({
      ...current,
      ...(flavor ? { flavor } : {}),
      ...(date ? { date } : {}),
      ...(time ? { time } : {}),
      ...(guests ? { guests: guestCount(guests) } : {}),
      ...(area ? { area: areaBy(area).id } : {}),
    }))
    setSaved(null)
    setStep('details')
  }, [params])

  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))
  const area = areaBy(form.area)
  const seat = seating.find((item) => item.id === form.seating)
  const tables = Math.max(1, Number(form.tables) || 1)
  const fee = tables * area.fee
  const unitLabel = tables === 1 ? area.unit : area.units
  const placeLabel = area.id === 'private' ? area.label : seat?.label || 'Open area'

  const messageFor = (booking) => {
    const bookedArea = areaBy(booking.area)
    const count = booking.tables || 1
    const unitFee = booking.unitFee || bookedArea.fee
    const total = booking.fee || unitFee * count
    const noun = count === 1 ? bookedArea.unit : bookedArea.units
    return [
      `Table reservation ${booking.ref} — Ahla Al Layali Cafe`,
      `Name: ${booking.name}`,
      `Phone: ${booking.phone}`,
      `Date: ${booking.date}`,
      `Time: ${booking.time}`,
      `Guests: ${booking.guests}`,
      `Area: ${booking.areaLabel || bookedArea.label}`,
      `${bookedArea.id === 'private' ? 'Cubicles' : 'Tables'}: ${count}`,
      `Reservation fee: ${formatAED(total)} (${formatAED(unitFee)} per ${bookedArea.unit})`,
      'Reservation fee is paid by card and is not refunded.',
      'Non-refundable if the party cancels or does not show up.',
      bookedArea.id === 'private'
        ? 'Food, drinks, and shisha are paid on top of the cubicle booking.'
        : 'Food, drinks, and shisha are paid when you dine.',
      `Seating: ${booking.seatLabel || bookedArea.label}`,
      `Occasion: ${booking.occasion}`,
      booking.flavor ? `Shisha to start: ${booking.flavor}` : 'Shisha: decide at the table',
      booking.notes ? `Notes: ${booking.notes}` : '',
      `Please hold the ${noun} once the fee is paid.`,
    ]
      .filter(Boolean)
      .join('\n')
  }

  useEffect(() => {
    if (!user) return
    setForm((current) => ({
      ...current,
      name: current.name || user.name,
      phone: current.phone || user.phone,
    }))
  }, [user])

  const goToCheckout = (event) => {
    event.preventDefault()
    if (!user) {
      navigate('/login?next=/book')
      return
    }
    if (!form.name.trim() || !form.phone.trim() || !form.date) {
      setError('Name, phone, and a date are required.')
      return
    }
    if (Number(form.guests) < MIN_GUESTS) {
      setError(`A table booking needs at least ${MIN_GUESTS} guests.`)
      return
    }
    setError('')
    setStep('checkout')
  }

  const payBooking = async ({ brand, last4 }) => {
    if (!user) return 'Create an account before paying.'
    if (!accepted) return 'Confirm the reservation fee before the table can be held.'
    const booking = {
      ...form,
      name: form.name.trim(),
      phone: form.phone.trim(),
      notes: form.notes.trim(),
      guests: guestCount(form.guests),
      tables,
      area: area.id,
      areaLabel: area.label,
      unitFee: area.fee,
      fee,
      seatLabel: placeLabel,
      ref: reference(),
      paid: true,
      createdAt: new Date().toISOString(),
    }
    await saveRecord('booking', {
      ...booking,
      total: fee,
      text: messageFor(booking),
      lines: [`${tables} ${unitLabel} · ${area.label}`, form.flavor ? `Shisha: ${form.flavor}` : 'Shisha: decide at the table'],
    })
    saveBooking(booking)
    setPaidCard(`${brand} ···· ${last4}`)
    setSaved(booking)
    setError('')
    return ''
  }

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <p className="eyebrow" style={{ color: 'var(--gold)' }}>
            Reservations
          </p>
          <h1>Book a table</h1>
          <p>
            Minimum {MIN_GUESTS} guests. An open-area table is {formatAED(cafe.reservationFee)}. A private cubicle is {formatAED(cafe.privateFee)}. The fee is paid by card and is not refunded if you cancel or do not arrive. Anything you order is paid on top. An account is required before checkout.
          </p>
        </div>
      </header>
      <section className="page-section">
        <div className="container">
          {saved ? (
            <article className="confirm-card">
              <span className="confirm-kicker">Paid by card</span>
              <h2>The {saved.area === 'private' ? 'cubicle' : 'table'} fee is paid</h2>
              <p className="ref">{saved.ref}</p>
              <p className="muted">
                {saved.date} · {saved.time} · {saved.guests} guests · {saved.areaLabel || 'Open area'} · {saved.tables}{' '}
                {saved.tables === 1 ? areaBy(saved.area).unit : areaBy(saved.area).units}
                {saved.flavor ? ` · ${saved.flavor}` : ''}
              </p>
              <p className="muted">
                {paidCard ? `${paidCard}. ` : ''}
                {formatAED(saved.fee)} is paid. It is not refunded if you cancel or do not show up.
                {saved.area === 'private'
                  ? ' Food, drinks, and shisha are paid on top of this booking.'
                  : ' Food, drinks, and shisha are paid when you dine.'}
              </p>
              <div className="inline-actions">
                <a className="btn btn-primary" href={whatsappLink(messageFor(saved))} target="_blank" rel="noreferrer">
                  Send booking on WhatsApp
                </a>
                <a className="btn btn-dark" href={`tel:${cafe.phoneTel}`}>
                  Call the café
                </a>
                <button
                  className="btn btn-line"
                  type="button"
                  style={{ width: 'auto' }}
                  onClick={() => {
                    setSaved(null)
                    setPaidCard('')
                    setStep('details')
                    setAccepted(false)
                  }}
                >
                  New reservation
                </button>
              </div>
            </article>
          ) : (
            <div className="booking-grid">
              {step === 'details' ? (
                <form className="booking-card" onSubmit={goToCheckout}>
                  <p className="checkout-steps">
                    <strong>1. Details</strong>
                    <span>2. Checkout</span>
                  </p>
                  <div className="field">
                    <label htmlFor="b-name">Name</label>
                    <input id="b-name" value={form.name} onChange={set('name')} placeholder="Name for the booking" />
                  </div>
                  <div className="field">
                    <label htmlFor="b-phone">Phone</label>
                    <input id="b-phone" value={form.phone} onChange={set('phone')} placeholder="05…" />
                  </div>
                  <div className="seat-grid">
                    <div className="field">
                      <label htmlFor="b-date">Date</label>
                      <input id="b-date" type="date" value={form.date} onChange={set('date')} />
                    </div>
                    <div className="field">
                      <label htmlFor="b-time">Time</label>
                      <select id="b-time" value={form.time} onChange={set('time')}>
                        {timeSlots().map((slot) => (
                          <option key={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="b-guests">Guests</label>
                      <select id="b-guests" value={form.guests} onChange={set('guests')}>
                        {Array.from({ length: 19 }, (_, index) => String(index + MIN_GUESTS)).map((count) => (
                          <option key={count}>{count}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="field">
                    <span className="option-title">Area</span>
                    <div className="seat-grid">
                      {areas.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          className={`seat-card ${form.area === option.id ? 'active' : ''}`}
                          onClick={() => setForm((current) => ({ ...current, area: option.id }))}
                        >
                          {option.label}
                          <small>
                            {formatAED(option.fee)} per {option.unit}. {option.note}
                          </small>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="field">
                    <label htmlFor="b-tables">{area.id === 'private' ? 'Cubicles' : 'Tables'}</label>
                    <select id="b-tables" value={form.tables} onChange={set('tables')}>
                      {Array.from({ length: 6 }, (_, index) => String(index + 1)).map((count) => (
                        <option key={count} value={count}>
                          {count} {count === '1' ? area.unit : area.units} · {formatAED(Number(count) * area.fee)}
                        </option>
                      ))}
                    </select>
                  </div>
                  {area.id === 'open' && (
                    <div className="field">
                      <span className="option-title">Seating</span>
                      <div className="seat-grid">
                        {seating.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            className={`seat-card ${form.seating === option.id ? 'active' : ''}`}
                            onClick={() => setForm((current) => ({ ...current, seating: option.id }))}
                          >
                            {option.label}
                            <small>{option.note}</small>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="field">
                    <label htmlFor="b-occasion">Occasion</label>
                    <select id="b-occasion" value={form.occasion} onChange={set('occasion')}>
                      {occasions.map((occasion) => (
                        <option key={occasion}>{occasion}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="b-flavor">Start a shisha? Optional</label>
                    <select id="b-flavor" value={form.flavor} onChange={set('flavor')}>
                      <option value="">Decide at the table</option>
                      {flavors.map((flavor) => (
                        <option key={flavor.id} value={flavor.name}>
                          {flavor.name} · AED {flavor.price}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="b-notes">Notes</label>
                    <textarea id="b-notes" value={form.notes} onChange={set('notes')} placeholder="Birthday, a quiet corner…" />
                  </div>
                  {error && <p className="field-error">{error}</p>}
                  <button className="btn btn-primary" type="submit">
                    Continue to checkout
                  </button>
                </form>
              ) : (
                <div className="booking-card">
                  <CardCounter
                    amount={formatAED(fee)}
                    onPaid={payBooking}
                    note="Visa, Mastercard, and American Express. This fee is not refunded if you cancel or do not show up."
                  >
                    <p className="checkout-steps">
                      <span>1. Details</span>
                      <strong>2. Checkout</strong>
                    </p>
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Checkout counter</h2>
                    <p className="muted">
                      {area.id === 'private'
                        ? 'The cubicle fee is paid by card now. Food, drinks, and shisha are paid on top when you order.'
                        : 'The table fee is paid by card now. Food, drinks, and shisha are paid when you dine.'}
                    </p>
                    <div className="receipt" style={{ marginTop: '1rem' }}>
                      <div className="receipt-row">
                        <span>
                          {form.name} · {form.guests} guests
                        </span>
                      </div>
                      <div className="receipt-row">
                        <span>
                          {form.date} · {form.time}
                        </span>
                      </div>
                      <div className="receipt-row">
                        <span>{area.label}</span>
                      </div>
                      <div className="receipt-row">
                        <span>
                          {tables} {unitLabel} × {formatAED(area.fee)}
                        </span>
                        <span>{formatAED(fee)}</span>
                      </div>
                      <div className="receipt-row">
                        <strong>Due now</strong>
                        <strong>{formatAED(fee)}</strong>
                      </div>
                    </div>
                    <label className="policy-check">
                      <input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} />
                      <span>
                        I agree that the {formatAED(area.fee)} {area.id === 'private' ? 'private cubicle booking' : 'fee per table'} is not refunded if we cancel or do not show up.
                        {area.id === 'private' ? ' What we order is paid on top.' : ''}
                      </span>
                    </label>
                  </CardCounter>
                  <button className="btn btn-line" type="button" style={{ width: 'auto', marginTop: '0.8rem' }} onClick={() => { setStep('details'); setError('') }}>
                    Back
                  </button>
                </div>
              )}
              <aside className="summary-card">
                <p className="eyebrow" style={{ color: 'var(--gold)' }}>
                  Checkout
                </p>
                <h3>{formatAED(fee)}</h3>
                <div className="summary-line">
                  <span>Area</span>
                  <strong>{area.label}</strong>
                </div>
                <div className="summary-line">
                  <span>Fee</span>
                  <strong>{formatAED(area.fee)} per {area.unit}</strong>
                </div>
                <div className="summary-line">
                  <span>{area.id === 'private' ? 'Cubicles' : 'Tables'}</span>
                  <strong>{tables}</strong>
                </div>
                <div className="summary-line">
                  <span>Guests</span>
                  <strong>{form.guests} guests</strong>
                </div>
                <div className="summary-line">
                  <span>When</span>
                  <strong>{form.date || 'Choose a date'} · {form.time}</strong>
                </div>
                <div className="summary-line">
                  <span>Seating</span>
                  <strong>{placeLabel}</strong>
                </div>
                <p className="muted">
                  {area.id === 'private'
                    ? 'The cubicle booking is not refunded on cancellation or no-show. What you order is paid on top.'
                    : 'Not refunded on cancellation or no-show. Food, drinks, and shisha are paid by card when you order.'}
                </p>
              </aside>
            </div>
          )}

          {bookings.length > 0 && (
            <div style={{ marginTop: '2.5rem' }}>
              <h3>Reservations saved on this device</h3>
              <div className="recent-list">
                {bookings.slice(0, 5).map((booking) => (
                  <article className="recent-item" key={booking.ref}>
                    <strong>{booking.ref}</strong>
                    <p>
                      {booking.name} · {booking.date} · {booking.time} · {booking.guests} guests
                      {booking.fee ? ` · ${formatAED(booking.fee)}${booking.paid ? ' paid by card' : ''}` : ''}
                    </p>
                    <a href={whatsappLink(messageFor(booking))}>Send again on WhatsApp</a>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
