import { useState } from 'react'
import { boards, formatAED, menu, whatsappLink } from '../data'
import { useStore } from '../context/Store'
import OfferCarousel from '../components/OfferCarousel'
import MenuBoard, { BoardTabs } from '../components/MenuBoard'
import ItemModal from '../components/ItemModal'
import PackageModal from '../components/PackageModal'

function reference() {
  return `ORD-${Date.now().toString().slice(-6)}`
}

export default function OrderPage() {
  const { cart, updateQty, clearCart, totals, promoCode, promoMessage, applyPromo, saveOrder } = useStore()
  const [board, setBoard] = useState(boards[0].id)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(null)
  const [packageOffer, setPackageOffer] = useState(null)
  const [code, setCode] = useState(promoCode || '')
  const [checkout, setCheckout] = useState(false)
  const [placed, setPlaced] = useState(null)

  const openOffer = (offer) => {
    if (offer.mode === 'deal') {
      const item = menu.find((entry) => entry.name === offer.itemName)
      if (item) setActive(item)
      return
    }
    setPackageOffer(offer)
  }

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <p className="eyebrow" style={{ color: 'var(--gold)' }}>
            Order
          </p>
          <h1>Send an order to the café</h1>
          <p>Dine-in or pickup. You pay at Ahla Al Layali. WhatsApp carries the order to the team.</p>
        </div>
      </header>
      <section className="page-section">
        <div className="container order-layout">
          <div>
            <OfferCarousel onSelect={openOffer} />
            <p className="board-note">Or skip the packages and order à la carte.</p>
            <div className="order-search">
              <span className="search-icon" aria-hidden="true">
                ⌕
              </span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search this category" aria-label="Search the menu" />
            </div>
            <BoardTabs value={board} onChange={setBoard} />
            <MenuBoard board={board} query={query} onOpen={setActive} />
          </div>
          <aside className="cart-panel">
            <div className="cart-header">
              <h3>Your order {totals.count > 0 && <span className="nav-cart-badge">{totals.count}</span>}</h3>
              {cart.length > 0 && (
                <button className="icon-btn" type="button" onClick={clearCart} aria-label="Clear order" style={{ width: 'auto', borderRadius: 999, padding: '0 0.7rem' }}>
                  Clear
                </button>
              )}
            </div>
            {cart.length === 0 ? (
              <div className="cart-empty-state">
                <strong>The tray is empty</strong>
                <p>Add coffee, a plate, or a shisha flavor.</p>
              </div>
            ) : (
              <>
                <div className="cart-items-list">
                  {cart.map((line) => (
                    <article className="cart-item-card" key={line.lineId}>
                      <div className="cart-item-name">{line.name}</div>
                      <div className="cart-item-modifiers">
                        {line.summary}
                        {line.note ? ` · ${line.note}` : ''}
                      </div>
                      <div className="cart-item-footer">
                        <div className="cart-qty">
                          <button type="button" onClick={() => updateQty(line.lineId, line.qty - 1)} aria-label="Decrease">
                            −
                          </button>
                          <span>{line.qty}</span>
                          <button type="button" onClick={() => updateQty(line.lineId, line.qty + 1)} aria-label="Increase">
                            +
                          </button>
                        </div>
                        <strong className="price">{formatAED(line.unit * line.qty)}</strong>
                      </div>
                    </article>
                  ))}
                </div>
                <form
                  className="promo-row"
                  onSubmit={(event) => {
                    event.preventDefault()
                    applyPromo(code)
                  }}
                >
                  <input value={code} onChange={(event) => setCode(event.target.value)} placeholder="LAYALI10" aria-label="Promo code" />
                  <button className="btn btn-dark" type="submit">
                    Apply
                  </button>
                </form>
                {promoMessage && <p className={promoMessage.includes('applied') ? 'promo-ok' : 'promo-bad'}>{promoMessage}</p>}
                <div className="calc-row">
                  <span>Subtotal</span>
                  <span>{formatAED(totals.subtotal)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="calc-row">
                    <span>Promo</span>
                    <span>− {formatAED(totals.discount)}</span>
                  </div>
                )}
                <div className="calc-row total-row">
                  <span>To pay at the café</span>
                  <span>{formatAED(totals.total)}</span>
                </div>
                <button className="btn btn-primary" type="button" style={{ width: '100%', marginTop: '0.8rem' }} onClick={() => setCheckout(true)}>
                  Checkout
                </button>
                <p className="pickup-guarantee">Pay by cash or card when you arrive. Codes: LAYALI10, NIGHTS.</p>
              </>
            )}
            {placed && (
              <div className="form-success" style={{ marginTop: '1rem' }}>
                {placed.ref} is ready.
                <div>
                  <a href={whatsappLink(placed.text)}>Send on WhatsApp</a>
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
      {active && <ItemModal item={active} onClose={() => setActive(null)} />}
      {packageOffer && <PackageModal offer={packageOffer} onClose={() => setPackageOffer(null)} />}
      {checkout && (
        <Checkout
          totals={totals}
          cart={cart}
          promoCode={promoCode}
          onClose={() => setCheckout(false)}
          onPlace={(order) => {
            saveOrder(order)
            setPlaced(order)
            setCheckout(false)
          }}
        />
      )}
    </>
  )
}

function Checkout({ cart, totals, promoCode, onClose, onPlace }) {
  const [form, setForm] = useState({ name: '', phone: '', mode: 'Dine-in', when: 'As soon as possible', note: '' })
  const [error, setError] = useState('')
  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))

  const submit = (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Add the name and phone for the order.')
      return
    }
    const lines = cart.map((line) => `${line.qty} × ${line.name}${line.summary ? ` (${line.summary})` : ''}${line.note ? ` — ${line.note}` : ''} — ${formatAED(line.unit * line.qty)}`)
    const ref = reference()
    const text = [
      `Order ${ref} — Ahla Al Layali Cafe`,
      `Name: ${form.name.trim()}`,
      `Phone: ${form.phone.trim()}`,
      `Type: ${form.mode}`,
      `When: ${form.when}`,
      ...lines,
      `Subtotal: ${formatAED(totals.subtotal)}`,
      promoCode ? `Promo ${promoCode}: − ${formatAED(totals.discount)}` : '',
      `Total to pay at the café: ${formatAED(totals.total)}`,
      form.note.trim() ? `Note: ${form.note.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n')
    window.open(whatsappLink(text), '_blank', 'noopener,noreferrer')
    onPlace({ ref, text, name: form.name.trim(), total: totals.total, mode: form.mode })
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <form className="modal-dialog item-modal-content" onClick={(event) => event.stopPropagation()} onSubmit={submit}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h3>Checkout</h3>
        <p className="item-modal-desc">The café prepares this after you send it on WhatsApp. Payment stays at the till.</p>
        <div className="field">
          <label htmlFor="o-name">Name</label>
          <input id="o-name" value={form.name} onChange={set('name')} />
        </div>
        <div className="field">
          <label htmlFor="o-phone">Phone</label>
          <input id="o-phone" value={form.phone} onChange={set('phone')} />
        </div>
        <div className="field">
          <label htmlFor="o-mode">How you will have it</label>
          <select id="o-mode" value={form.mode} onChange={set('mode')}>
            <option>Dine-in</option>
            <option>Pickup</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="o-when">When</label>
          <select id="o-when" value={form.when} onChange={set('when')}>
            <option>As soon as possible</option>
            <option>In 30 minutes</option>
            <option>In 1 hour</option>
            <option>I am already at a table</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="o-note">Note</label>
          <textarea id="o-note" value={form.note} onChange={set('note')} />
        </div>
        <div className="receipt">
          {cart.map((line) => (
            <div className="receipt-row" key={line.lineId}>
              <span>
                {line.qty} × {line.name}
              </span>
              <span>{formatAED(line.unit * line.qty)}</span>
            </div>
          ))}
          <div className="receipt-row">
            <strong>Total at the café</strong>
            <strong>{formatAED(totals.total)}</strong>
          </div>
        </div>
        {error && <p className="field-error">{error}</p>}
        <button className="btn btn-primary" type="submit">
          Save order and open WhatsApp
        </button>
      </form>
    </div>
  )
}
