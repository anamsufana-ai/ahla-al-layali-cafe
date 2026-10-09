import { useEffect, useMemo, useState } from 'react'
import { choiceSummary, formatAED, optionGroupsFor, unitPrice } from '../data'
import { useStore } from '../context/Store'

export default function ItemModal({ item, onClose }) {
  const { addToCart } = useStore()
  const groups = useMemo(() => optionGroupsFor(item), [item])
  const [choices, setChoices] = useState({})
  const [note, setNote] = useState('')
  const [qty, setQty] = useState(1)

  useEffect(() => {
    const initial = {}
    groups.forEach((group) => {
      initial[group.key] = group.choices[0]?.id
    })
    setChoices(initial)
    setQty(1)
    setNote('')
  }, [item, groups])

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

  const unit = unitPrice(item, groups, choices)
  const summary = choiceSummary(groups, choices).join(' · ')

  const confirm = () => {
    addToCart({
      itemId: item.id,
      name: item.name,
      nameAr: item.nameAr,
      category: item.category,
      unit,
      qty,
      choices,
      summary,
      note: note.trim(),
    })
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="item-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="item-modal-media">
          <img src={item.image} alt="" />
        </div>
        <div className="item-modal-content">
          <div className="item-modal-header">
            <h3 id="item-title">{item.name}</h3>
            <span className="price-tag">{formatAED(unit)}</span>
          </div>
          <p className="ar-name">{item.nameAr}</p>
          <p className="item-modal-desc">{item.desc}</p>
          {groups.map((group) => (
            <div className="option-group" key={group.key}>
              <span className="option-title">{group.title}</span>
              {group.choices.length > 8 ? (
                <select
                  value={choices[group.key] || ''}
                  onChange={(event) => setChoices((current) => ({ ...current, [group.key]: event.target.value }))}
                >
                  {group.choices.map((choice) => (
                    <option key={choice.id} value={choice.id}>
                      {choice.label}
                      {choice.add ? ` (+${formatAED(choice.add)})` : ''}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="option-pills">
                  {group.choices.map((choice) => (
                    <button
                      key={choice.id}
                      type="button"
                      className={`pill-btn ${choices[group.key] === choice.id ? 'active' : ''}`}
                      onClick={() => setChoices((current) => ({ ...current, [group.key]: choice.id }))}
                    >
                      {choice.label}
                      {choice.add ? ` +${formatAED(choice.add)}` : ''}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="field">
            <label htmlFor="item-note">Note for the café</label>
            <input
              id="item-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={item.kind === 'shisha' ? 'Example: two flavors, light coal' : 'Anything the kitchen should know'}
            />
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
              Add · {formatAED(unit * qty)}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
