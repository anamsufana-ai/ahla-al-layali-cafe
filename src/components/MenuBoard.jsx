import { useMemo } from 'react'
import { boards, priceLabel, sectionsFor } from '../data'

export function BoardTabs({ value, onChange }) {
  return (
    <div className="board-tabs" role="tablist" aria-label="Menu categories">
      {boards.map((board) => (
        <button key={board.id} type="button" role="tab" aria-selected={value === board.id} className={value === board.id ? 'active' : ''} onClick={() => onChange(board.id)}>
          {board.label}
        </button>
      ))}
    </div>
  )
}

export default function MenuBoard({ board, query, onOpen }) {
  const current = boards.find((item) => item.id === board) || boards[0]
  const sections = useMemo(() => sectionsFor(current.id, query), [current.id, query])

  return (
    <div>
      <p className="board-blurb">{current.blurb}</p>
      {sections.length === 0 ? (
        <p className="empty-note">Nothing in {current.label} matches that search.</p>
      ) : (
        sections.map((section) => (
          <section className="menu-section" key={section.name}>
            <h3>{section.name}</h3>
            <ul className="price-list">
              {section.items.map((item) => (
                <li key={item.id}>
                  <button className="price-row" type="button" onClick={() => onOpen(item)}>
                    <span>
                      <strong>{item.name}</strong>
                      <small>{item.nameAr}</small>
                    </span>
                    <span className="price">{priceLabel(item)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  )
}
