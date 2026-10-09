import { useEffect, useMemo, useState } from 'react'
import { formatAED, slotOptions } from '../data'
import { useStore } from '../context/Store'

export default function PackageModal({ offer, onClose }) {
  const { addToCart } = useStore()
  const slots = useMemo(() => offer.slots.map((slot) => ({ ...slot, options: slotOptions(slot) })), [offer])
  const [picks, setPicks] = useState({})
  const [qty, setQty] = useState(1)
  const [note, setNote] = useState('')

  useEffect(() => {
    const initial = {}
    slots.forEach((slot) => {
      initial[slot.key] = slot.options[0]?.id
    })
    setPicks(initial)
    setQty(1)
    setNote('')
  }, [offer, slots])

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const chosen = slots.map((slot) => slot.options.find((option) => option.id === picks[slot.key])).filter(Boolean)
  const unit = chosen.reduce((sum, item) => sum + item.price, 0)

  const confirm = () => {
    addToCart({
      itemId: offer.id,
      name: offer.title,
      nameAr: '',
      category: 'Package',
      kind: 'package',
      unit,
      qty,
      picks,
      summary: chosen.map((item) => item.name).join(' · '),
      note: note.trim(),
    })
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div className="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="pkg-title" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="item-modal-media">
          <img src={offer.image} alt="" />
        </div>
        <div className="item-modal-content">
          <div className="item-modal-header">
            <h3 id="pkg-title">{offer.title}</h3>
            <span className="price-tag">{formatAED(unit)}</span>
          </div>
          <p className="item-modal-desc">{offer.text} Each line uses its menu price.</p>
          {slots.map((slot) => (
            <div className="option-group" key={slot.key}>
              <span className="option-title">{slot.title}</span>
              <select value={picks[slot.key] || ''} onChange={(event) => setPicks((current) => ({ ...current, [slot.key]: event.target.value }))}>
                {slot.options.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name} · {formatAED(option.price)}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <div className="field">
            <label htmlFor="pkg-note">Note for the café</label>
            <input id="pkg-note" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Anything the team should know" />
          </div>
          <div className="modal-actions">
            <div className="qty-controls" aria-label="Quantity">
              <button type="button" onClick={() => setQty((value) => Math.max(1, value - 1))} aria-label="Decrease quantity">
                −
              </button>
              <strong>{qty}</strong>
              <button type="button" onClick={() => setQty((value) => value + 1)} aria-label="Increase quantity">
                +
              </button>
            </div>
            <button className="btn btn-primary" type="button" style={{ flex: 1 }} onClick={confirm}>
              Add package · {formatAED(unit * qty)}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
