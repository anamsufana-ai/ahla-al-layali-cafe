import { useEffect, useState } from 'react'
import { formatAED, offerFromPrice, offers } from '../data'

export default function OfferCarousel({ onSelect }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const offer = offers[index]

  useEffect(() => {
    if (paused) return undefined
    const timer = setInterval(() => setIndex((current) => (current + 1) % offers.length), 5500)
    return () => clearInterval(timer)
  }, [paused])

  const go = (next) => setIndex((next + offers.length) % offers.length)

  return (
    <section className="offer-carousel" aria-roledescription="carousel" aria-label="Café packages" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <article className="offer-slide">
        <img src={offer.image} alt="" />
        <div className="offer-copy">
          <p className="eyebrow">{offer.kicker}</p>
          <h2>{offer.title}</h2>
          <p>{offer.text}</p>
          <strong>{offer.mode === 'sum' ? `From ${formatAED(offerFromPrice(offer))}` : formatAED(offer.price)}</strong>
          <div className="inline-actions">
            <button className="btn btn-primary" type="button" onClick={() => onSelect(offer)}>
              {offer.mode === 'sum' ? 'Build this package' : 'Add this offer'}
            </button>
          </div>
        </div>
      </article>
      <button className="offer-arrow offer-prev" type="button" aria-label="Previous offer" onClick={() => go(index - 1)}>
        ‹
      </button>
      <button className="offer-arrow offer-next" type="button" aria-label="Next offer" onClick={() => go(index + 1)}>
        ›
      </button>
      <div className="offer-dots">
        {offers.map((item, dot) => (
          <button key={item.id} type="button" className={dot === index ? 'active' : ''} aria-label={`Show ${item.title}`} onClick={() => setIndex(dot)} />
        ))}
      </div>
    </section>
  )
}
