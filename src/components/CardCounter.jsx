import { useState } from 'react'

const BRANDS = [
  { id: 'Visa', label: 'Visa' },
  { id: 'Mastercard', label: 'Mastercard' },
  { id: 'Amex', label: 'Amex' },
]

function digits(value) {
  return String(value || '').replace(/\D/g, '')
}

function brandOf(number) {
  const value = digits(number)
  if (/^4/.test(value)) return 'Visa'
  if (/^3[47]/.test(value)) return 'Amex'
  if (/^(5[1-5]|2[2-7])/.test(value)) return 'Mastercard'
  return ''
}

function luhn(value) {
  let sum = 0
  let alt = false
  for (let i = value.length - 1; i >= 0; i -= 1) {
    let n = Number(value[i])
    if (alt) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
    alt = !alt
  }
  return sum % 10 === 0
}

function formatNumber(value) {
  const raw = digits(value).slice(0, 16)
  return raw.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
}

function formatExpiry(value) {
  const raw = digits(value).slice(0, 4)
  if (raw.length <= 2) return raw
  return `${raw.slice(0, 2)}/${raw.slice(2)}`
}

export function checkCard(card) {
  const name = card.name.trim()
  const number = digits(card.number)
  const expiry = digits(card.expiry)
  const cvc = digits(card.cvc)
  if (name.length < 2) return 'Add the name on the card.'
  if (number.length < 15 || number.length > 16 || !luhn(number)) return 'Check the card number.'
  if (expiry.length !== 4) return 'Add the expiry as MM/YY.'
  const month = Number(expiry.slice(0, 2))
  const year = 2000 + Number(expiry.slice(2))
  const now = new Date()
  const current = now.getFullYear() * 12 + now.getMonth()
  if (month < 1 || month > 12 || year * 12 + (month - 1) < current) return 'This card is expired.'
  const brand = brandOf(number)
  if (cvc.length !== (brand === 'Amex' ? 4 : 3)) return 'Check the security code.'
  return ''
}

function Mark({ id }) {
  if (id === 'Visa') {
    return (
      <svg viewBox="0 0 48 16" width="46" height="16" aria-hidden="true">
        <text x="0" y="14" fill="#1a1f71" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="700" fontSize="16">
          VISA
        </text>
      </svg>
    )
  }
  if (id === 'Mastercard') {
    return (
      <svg viewBox="0 0 36 22" width="36" height="22" aria-hidden="true">
        <circle cx="13" cy="11" r="9" fill="#eb001b" />
        <circle cx="23" cy="11" r="9" fill="#f79e1b" />
        <path d="M18 4.4a9 9 0 0 1 0 13.2 9 9 0 0 1 0-13.2z" fill="#ff5f00" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 46 16" width="46" height="16" aria-hidden="true">
      <text x="0" y="13" fill="#2e77bc" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="13">
        AMEX
      </text>
    </svg>
  )
}

export default function CardCounter({ amount, onPaid, children, note = 'Visa, Mastercard, and American Express.', split = false }) {
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvc: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const brand = brandOf(card.number)
  const set = (key, format) => (event) => {
    const value = format ? format(event.target.value) : event.target.value
    setCard((current) => ({ ...current, [key]: value }))
  }

  const submit = async (event) => {
    event.preventDefault()
    const problem = checkCard(card)
    if (problem) {
      setError(problem)
      return
    }
    const number = digits(card.number)
    setError('')
    setBusy(true)
    try {
      const result = await onPaid({ brand: brand || 'Card', last4: number.slice(-4) })
      if (typeof result === 'string' && result) {
        setError(result)
        setBusy(false)
      }
    } catch (checkoutError) {
      setError(checkoutError.message)
      setBusy(false)
    }
  }

  return (
    <form className={split ? 'checkout-grid' : undefined} onSubmit={submit}>
      {split ? <div>{children}</div> : children}
      <div className="pay-counter">
        <div className="pay-brands" aria-label="Accepted cards">
          {BRANDS.map((item) => (
            <span className={`pay-brand ${brand === item.id ? 'active' : ''}`} key={item.id} title={item.label}>
              <Mark id={item.id} />
            </span>
          ))}
        </div>
        <div className="pay-card-box">
          <div className="field">
            <label htmlFor="card-name">Name on card</label>
            <input id="card-name" autoComplete="cc-name" value={card.name} onChange={set('name')} placeholder="Name on card" />
          </div>
          <div className="field">
            <label htmlFor="card-number">Card number</label>
            <input
              id="card-number"
              inputMode="numeric"
              autoComplete="cc-number"
              value={card.number}
              onChange={set('number', formatNumber)}
              placeholder="1234 5678 9012 3456"
            />
          </div>
          <div className="pay-row">
            <div className="field">
              <label htmlFor="card-expiry">Expiry</label>
              <input id="card-expiry" inputMode="numeric" autoComplete="cc-exp" value={card.expiry} onChange={set('expiry', formatExpiry)} placeholder="MM/YY" />
            </div>
            <div className="field">
              <label htmlFor="card-cvc">CVC</label>
              <input id="card-cvc" inputMode="numeric" autoComplete="cc-csc" value={card.cvc} onChange={set('cvc', (value) => digits(value).slice(0, 4))} placeholder="123" />
            </div>
          </div>
        </div>
        {error && <p className="field-error">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? 'Taking the payment…' : `Pay ${amount}`}
        </button>
        <p className="pay-note">{note}</p>
      </div>
    </form>
  )
}
