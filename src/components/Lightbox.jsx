import { useEffect } from 'react'

export default function Lightbox({ images, index, onClose, onIndex }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onIndex((index + 1) % images.length)
      if (event.key === 'ArrowLeft') onIndex((index - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [images.length, index, onClose, onIndex])

  const photo = images[index]
  if (!photo) return null

  return (
    <div className="lightbox-backdrop" onClick={onClose} role="presentation">
      <button className="lightbox-nav lightbox-prev" type="button" aria-label="Previous photo" onClick={(event) => { event.stopPropagation(); onIndex((index - 1 + images.length) % images.length) }}>
        ‹
      </button>
      <div className="lightbox-content" onClick={(event) => event.stopPropagation()}>
        <button className="lightbox-close" type="button" onClick={onClose} aria-label="Close photo">
          ×
        </button>
        <img src={photo.src} alt={photo.caption} />
        <p>
          <span className="tag-chip">{photo.cat}</span> {photo.caption}
        </p>
      </div>
      <button className="lightbox-nav lightbox-next" type="button" aria-label="Next photo" onClick={(event) => { event.stopPropagation(); onIndex((index + 1) % images.length) }}>
        ›
      </button>
    </div>
  )
}
