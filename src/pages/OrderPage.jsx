import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { boards, formatAED, menu, whatsappLink } from '../data'
import { useStore } from '../context/Store'
import { useAuth } from '../context/Auth'
import OfferCarousel from '../components/OfferCarousel'
import MenuBoard, { BoardTabs } from '../components/MenuBoard'
import ItemModal from '../components/ItemModal'
import PackageModal from '../components/PackageModal'
import CardCounter from '../components/CardCounter'

export default function OrderPage() {
  const { cart, updateQty, clearCart, totals, promoCode, promoMessage, applyPromo, saveOrder } = useStore()
  const { user, saveRecord } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [board, setBoard] = useState(params.get('board') || boards[0].id)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(null)
  const [packageOffer, setPackageOffer] = useState(null)
  const [code, setCode] = useState(promoCode || '')
  const [checkout, setCheckout] = useState(false)

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
          <p>Dine-in or pickup. Create an account, pay by card, then send the receipt to the café on WhatsApp.</p>
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
                  <span>To pay</span>
                  <span>{formatAED(totals.total)}</span>
                </div>
                <button className="btn btn-primary" type="button" style={{ width: '100%', marginTop: '0.8rem' }} onClick={() => (user ? setCheckout(true) : navigate('/login?next=/order'))}>
                  Checkout
                </button>
                <p className="pickup-guarantee">Visa, Mastercard, and Amex at checkout. Codes: LAYALI10, NIGHTS.</p>
              </>
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
          onPlace={saveOrder}
          user={user}
          saveRecord={saveRecord}
        />
      )}
    </>
  )
}

function Checkout({ cart, totals, promoCode, onClose, onPlace, user, saveRecord }) {
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    mode: 'Dine-in',
    when: 'As soon as possible',
    note: '',
  })
  const [paid, setPaid] = useState(null)
  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))

  const pay = async ({ brand, last4 }) => {
    if (!user) return 'Create an account before paying.'
    if (!form.name.trim() || !form.phone.trim()) return 'Add the name and phone for the order.'
    const ref = `ORD-${Date.now().toString().slice(-6)}`
    const lines = cart.map((line) => `${line.qty} × ${line.name}${line.summary ? ` (${line.summary})` : ''}`)
    const text = [
      `Order ${ref} — PAID`,
      'Ahla Al Layali Cafe',
      `Name: ${form.name.trim()}`,
      `Phone: ${form.phone.trim()}`,
      `Type: ${form.mode}`,
      `When: ${form.when}`,
      ...lines,
      promoCode ? `Promo: ${promoCode}` : '',
      `Total: ${formatAED(totals.total)}`,
      `Paid by ${brand}.`,
      form.note.trim() ? `Note: ${form.note.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n')
    await saveRecord('order', {
      ref,
      text,
      name: form.name.trim(),
      total: totals.total,
      mode: form.mode,
      when: form.when,
      lines,
      paid: true,
    })
    onPlace({ ref, text, name: form.name.trim(), total: totals.total, mode: form.mode, paid: true })
    setPaid({ ref, text, brand, last4, total: totals.total })
    return ''
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div className="modal-dialog checkout-sheet" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="checkout-title">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="item-modal-content">
          {paid ? (
            <>
              <span className="confirm-kicker">Paid by card</span>
              <h3 id="checkout-title">Order {paid.ref} is paid</h3>
              <p className="item-modal-desc">
                {paid.brand} ···· {paid.last4}. {formatAED(paid.total)}. Send the receipt so the café starts it.
              </p>
              <a className="btn btn-primary" href={whatsappLink(paid.text)} target="_blank" rel="noreferrer">
                Send receipt on WhatsApp
              </a>
            </>
          ) : (
            <CardCounter split amount={formatAED(totals.total)} onPaid={pay} note="Visa, Mastercard, and American Express.">
              <h3 id="checkout-title">Checkout counter</h3>
              <p className="item-modal-desc">Pay the order by card. The café gets it with the receipt.</p>
              <div>
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
                      <strong>Total</strong>
                      <strong>{formatAED(totals.total)}</strong>
                    </div>
                  </div>
                </div>
            </CardCounter>
          )}
        </div>
      </div>
    </div>
  )
}
