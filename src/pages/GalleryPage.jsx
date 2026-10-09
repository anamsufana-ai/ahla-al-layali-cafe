import { useMemo, useState } from 'react'
import { gallery } from '../data'
import Lightbox from '../components/Lightbox'

const filters = ['All', ...new Set(gallery.map((photo) => photo.cat))]

export default function GalleryPage() {
  const [filter, setFilter] = useState('All')
  const [index, setIndex] = useState(null)
  const photos = useMemo(
    () => (filter === 'All' ? gallery : gallery.filter((photo) => photo.cat === filter)),
    [filter],
  )

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <p className="eyebrow" style={{ color: 'var(--gold)' }}>
            Gallery
          </p>
          <h1>Inside the café</h1>
          <p>Drinks, plates, and the rooms we keep for long sittings.</p>
        </div>
      </header>
      <section className="page-section">
        <div className="container">
          <div className="gallery-filters">
            {filters.map((name) => (
              <button key={name} type="button" className={`filter-chip ${filter === name ? 'active' : ''}`} onClick={() => setFilter(name)}>
                {name}
              </button>
            ))}
          </div>
          <div className="gallery-grid">
            {photos.map((photo, photoIndex) => (
              <button key={`${photo.src}-${photo.caption}`} className="gallery-item" type="button" onClick={() => setIndex(photoIndex)}>
                <img src={photo.src} alt={photo.caption} />
                <figcaption>{photo.caption}</figcaption>
              </button>
            ))}
          </div>
        </div>
      </section>
      {index !== null && (
        <Lightbox images={photos} index={index} onClose={() => setIndex(null)} onIndex={setIndex} />
      )}
    </>
  )
}
