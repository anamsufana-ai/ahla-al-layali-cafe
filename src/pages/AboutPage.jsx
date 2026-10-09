import { Link } from 'react-router-dom'
import { images, promises } from '../data'

export default function AboutPage() {
  return (
    <>
      <header className="page-hero">
        <div className="container">
          <p className="eyebrow" style={{ color: 'var(--gold)' }}>
            About
          </p>
          <h1>أحلى الليالي</h1>
          <p>The best of nights, in a café that also knows how to do the morning.</p>
        </div>
      </header>
      <section className="page-section">
        <div className="container about-grid">
          <div className="about-copy">
            <h2>A café and a shisha lounge, one address</h2>
            <p>
              Ahla Al Layali Cafe sits in shops 07–12 of Building P-28, France Cluster, International City. Guests come for karak and breakfast, then again after dark for a table, a juice, and shisha.
            </p>
            <p>
              The kitchen covers toast and shakshuka, hawawshi, chicken and beef sandwiches, burgers, crepes, and cheesecake. The bar keeps Turkish coffee, iced lattes, fresh juice, mojitos, and milkshakes. The lounge carries the shisha list, from apple and grape mint through the house special.
            </p>
            <p>
              This website is the café’s own: browse the menu, send an order, or request a table. The team confirms bookings on WhatsApp and by phone.
            </p>
            <div className="inline-actions">
              <Link className="btn btn-primary" to="/book">
                Book a table
              </Link>
              <Link className="btn btn-dark" to="/menu">
                Read the menu
              </Link>
            </div>
          </div>
          <div className="about-visual">
            <img src={images.lounge} alt="Café dining room set for the evening" />
          </div>
        </div>
        <div className="container" style={{ marginTop: '3rem' }}>
          <div className="why-grid">
            {promises.map((item) => (
              <article className="why-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
