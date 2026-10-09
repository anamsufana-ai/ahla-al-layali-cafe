import { Link } from 'react-router-dom'
import { formatAED } from '../data'

export default function MenuCard({ item, onOpen }) {
  return (
    <article className="menu-card">
      <div className="menu-card-img-wrap">
        <img src={item.image} alt="" />
        <span className="menu-card-category-tag">{item.category}</span>
      </div>
      <div className="menu-card-body">
        <div className="menu-card-top">
          <h3>{item.name}</h3>
          <span className="price">{formatAED(item.price)}</span>
        </div>
        <p className="ar-name">{item.nameAr}</p>
        <p>{item.desc}</p>
        {item.tags.length > 0 && (
          <div className="tag-row">
            {item.tags.map((tag) => (
              <span className="tag-chip" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="menu-card-actions">
          <button className="btn btn-line" type="button" onClick={() => onOpen(item)}>
            {item.kind === 'shisha' || item.kind === 'deal' ? 'Order shisha' : 'Add to order'}
          </button>
          {(item.kind === 'shisha' || item.kind === 'deal') && (
            <Link className="btn btn-dark" to={`/book?flavor=${encodeURIComponent(item.name)}`}>
              Book
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
