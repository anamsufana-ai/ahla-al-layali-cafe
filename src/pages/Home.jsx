import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { areas, boards, cafe, gallery, images, menu, promises, timeSlots } from '../data'
import { useStore } from '../context/Store'
import OfferCarousel from '../components/OfferCarousel'
import ItemModal from '../components/ItemModal'
import PackageModal from '../components/PackageModal'
import Lightbox from '../components/Lightbox'

export default function Home() {
  const navigate = useNavigate()
  const { reviews, addReview } = useStore()
  const [active, setActive] = useState(null)
  const [packageOffer, setPackageOffer] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [hold, setHold] = useState({ date: '', time: '8:00 PM', guests: '2', area: 'open' })

  const openOffer = (offer) => {
    if (offer.mode === 'deal') {
      const item = menu.find((entry) => entry.name === offer.itemName)
      if (item) setActive(item)
      return
    }
    setPackageOffer(offer)
  }
  const shots = gallery.slice(0, 8)
  const loop = [...reviews, ...reviews]

  const holdTable = (event) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (hold.date) params.set('date', hold.date)
    if (hold.time) params.set('time', hold.time)
    if (hold.guests) params.set('guests', hold.guests)
    if (hold.area) params.set('area', hold.area)
    navigate(`/book?${params.toString()}`)
  }

  return (
    <>
      <section className="hero">
        <div className="hero-media">
          <img src={images.hero} alt="Evening tables at a warmly lit café" />
        </div>
        <div className="hero-content">
          <p className="eyebrow">Ahla Al Layali Cafe</p>
          <h1>The best of nights</h1>
          <p className="hero-ar">{cafe.nameAr}</p>
          <p className="lede">Coffee · Shisha · Open 24/7</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/book">
              Book a table
            </Link>
            <Link className="btn btn-ghost" to="/menu">
              View menu
            </Link>
          </div>
        </div>
        <span className="hero-scroll">Scroll</span>
      </section>

      <div className="container">
        <form className="reserve-strip" onSubmit={holdTable}>
          <div>
            <label htmlFor="hold-date">Date</label>
            <input id="hold-date" type="date" required value={hold.date} onChange={(event) => setHold({ ...hold, date: event.target.value })} />
          </div>
          <div>
            <label htmlFor="hold-time">Time</label>
            <select id="hold-time" value={hold.time} onChange={(event) => setHold({ ...hold, time: event.target.value })}>
              {timeSlots().map((slot) => (
                <option key={slot}>{slot}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="hold-guests">Guests</label>
            <select id="hold-guests" value={hold.guests} onChange={(event) => setHold({ ...hold, guests: event.target.value })}>
              {Array.from({ length: 15 }, (_, index) => index + 2).map((count) => (
                <option key={count} value={count}>
                  {count} guests
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="hold-area">Area</label>
            <select id="hold-area" value={hold.area} onChange={(event) => setHold({ ...hold, area: event.target.value })}>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.label} · AED {area.fee}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" type="submit">
            Request table
          </button>
        </form>
      </div>

      <section className="section" id="about">
        <div className="container about-grid">
          <div className="about-copy">
            <p className="eyebrow">Our story</p>
            <h2>A France Cluster room for slow nights</h2>
            <p>
              Ahla Al Layali is the neighborhood café on Building P-28: breakfast when International City is waking up, and a lounge that stays open through the night.
            </p>
            <p>
              The menu is the café’s own — Turkish coffee, karak, fresh juice, burgers, hawawshi, crepes — with a full shisha list for the table. Book ahead and the team will hold the seats.
            </p>
            <div className="about-highlights">
              <article className="about-card">
                <h3>Shop 07-12, P-28</h3>
                <p>France Cluster, International City, Dubai.</p>
              </article>
              <article className="about-card">
                <h3>Open 24/7</h3>
                <p>The doors stay open through the night and into the next morning.</p>
              </article>
            </div>
          </div>
          <div className="about-visual">
            <img src={images.about} alt="Sunlit café seating" />
            <div className="about-badge">
              <strong>Almost 24h</strong>
              Coffee by day, shisha by night
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '2.5rem' }}>
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">Packages</p>
            <h2>Offers for a full table — or skip them</h2>
            <p>The banner is for people who want a combination. Everyone else orders from Food, Drinks, Coffee, or Shisha.</p>
          </div>
          <OfferCarousel onSelect={openOffer} />
          <div className="board-tabs">
            {boards.map((board) => (
              <Link key={board.id} className="board-link" to={`/menu?board=${board.id}`}>
                <strong>{board.label}</strong>
                <span>{board.blurb}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">Why this table</p>
            <h2>Stay for the coffee. Stay for the night.</h2>
          </div>
          <div className="why-grid">
            {promises.map((item) => (
              <article className="why-card" key={item.title}>
                <div className="why-icon" aria-hidden="true">
                  ✶
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">Gallery</p>
            <h2>The bar, the kitchen, the lounge</h2>
          </div>
          <div className="gallery-grid">
            {shots.map((shot, index) => (
              <button key={shot.src} className="gallery-item" type="button" onClick={() => setPhoto(index)}>
                <img src={shot.src} alt={shot.caption} />
                <figcaption>{shot.caption}</figcaption>
              </button>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link className="btn btn-dark" to="/gallery">
              Open the gallery
            </Link>
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">Guest notes</p>
            <h2>Nights people come back for</h2>
            <button className="btn btn-line" type="button" style={{ width: 'auto', marginTop: '1rem' }} onClick={() => setReviewOpen(true)}>
              Share your visit
            </button>
          </div>
          <div className="reviews-wrap">
            <div className="reviews-track">
              {loop.map((review, index) => (
                <article className="review-card" key={`${review.id}-${index}`}>
                  <div className="stars" aria-label={`${review.stars} stars`}>
                    {'★'.repeat(review.stars)}
                    {'☆'.repeat(5 - review.stars)}
                  </div>
                  <blockquote>{review.text}</blockquote>
                  <div className="reviewer">
                    <strong>{review.name}</strong>
                    <span>{review.detail}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">Find the café</p>
            <h2>France Cluster, International City</h2>
            <p>Building P-28, shops 07 to 12. Look for the lounge lights after dark.</p>
          </div>
          <div className="location-grid">
            <iframe
              className="map-frame"
              title="Map of Ahla Al Layali Cafe"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(cafe.mapQuery)}&z=16&output=embed`}
              loading="lazy"
            />
            <div className="location-card">
              <h3>Visit</h3>
              <div className="info-row">
                <span>Address</span>
                {cafe.addressLines.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </div>
              <div className="info-row">
                <span>Phone</span>
                <a href={`tel:${cafe.phoneTel}`}>{cafe.phoneDisplay}</a>
              </div>
              <div className="info-row">
                <span>Hours</span>
                <ul className="hours-list">
                  {cafe.hours.map((row) => (
                    <li key={row.days}>
                      <span>{row.days}</span>
                      <span>{row.time}</span>
                    </li>
                  ))}
                </ul>
                <p style={{ marginTop: '0.6rem', color: 'var(--beige)' }}>{cafe.hoursNote}</p>
              </div>
              <div className="inline-actions">
                <a className="btn btn-primary" href={cafe.mapsLink} target="_blank" rel="noreferrer">
                  Directions
                </a>
                <Link className="btn btn-ghost" to="/book">
                  Book a table
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {active && <ItemModal item={active} onClose={() => setActive(null)} />}
      {packageOffer && <PackageModal offer={packageOffer} onClose={() => setPackageOffer(null)} />}
      {photo !== null && <Lightbox images={shots} index={photo} onClose={() => setPhoto(null)} onIndex={setPhoto} />}
      {reviewOpen && <ReviewModal onClose={() => setReviewOpen(false)} onSave={addReview} />}
    </>
  )
}

function ReviewModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: '', detail: '', stars: 5, text: '' })
  const [error, setError] = useState('')

  const submit = (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.text.trim()) {
      setError('Add your name and a few words about the visit.')
      return
    }
    onSave({ ...form, name: form.name.trim(), detail: form.detail.trim() || 'Guest', text: form.text.trim() })
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <form className="modal-dialog item-modal-content" onClick={(event) => event.stopPropagation()} onSubmit={submit}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h3>Share your visit</h3>
        <p className="item-modal-desc">A short note for the café wall. It stays on this browser.</p>
        <div className="field">
          <label htmlFor="rev-name">Name</label>
          <input id="rev-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="rev-detail">How you know us</label>
          <input id="rev-detail" value={form.detail} placeholder="Friday lounge, breakfast regular…" onChange={(event) => setForm({ ...form, detail: event.target.value })} />
        </div>
        <div className="option-pills" style={{ margin: '0.4rem 0 0.8rem' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} type="button" className={`star-pill ${form.stars === star ? 'active' : ''}`} onClick={() => setForm({ ...form, stars: star })}>
              {star} ★
            </button>
          ))}
        </div>
        <div className="field">
          <label htmlFor="rev-text">Note</label>
          <textarea id="rev-text" value={form.text} onChange={(event) => setForm({ ...form, text: event.target.value })} />
        </div>
        {error && <p className="field-error">{error}</p>}
        <button className="btn btn-primary" type="submit">
          Leave note
        </button>
      </form>
    </div>
  )
}
