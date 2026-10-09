import { Link } from 'react-router-dom'

export default function TermsPage() {
  return (
    <>
      <header className="page-hero">
        <div className="container">
          <p className="eyebrow" style={{ color: 'var(--gold)' }}>Accounts</p>
          <h1>Terms</h1>
          <p>How an Ahla Al Layali account is used for orders, tables, and the guest list.</p>
        </div>
      </header>
      <section className="page-section">
        <article className="policy-copy">
          <p>An account is required to place an order or book a table. The name, date of birth, email, phone, and WhatsApp number on the account are the details the café uses for that guest.</p>
          <p>A table booking has a reservation fee. An open-area table is AED 50. A private cubicle is AED 100. The fee is not refunded if the party cancels or does not show up. Food, drinks, and shisha are charged on top when they are ordered.</p>
          <p>Menu prices are in AED, as shown on the site. An order or booking is held for the café once it is paid at the checkout counter and the receipt is sent on WhatsApp.</p>
          <p>The café may refuse a booking when the room is full. Nothing in these terms invents a promise the café has not confirmed on WhatsApp or by phone.</p>
          <p>
            The guest list is explained in the <Link to="/privacy">privacy policy</Link>. Offers are sent only if the guest selects that option at registration.
          </p>
        </article>
      </section>
    </>
  )
}
