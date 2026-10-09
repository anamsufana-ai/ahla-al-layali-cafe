import { Link } from 'react-router-dom'

export default function PrivacyPage() {
  return (
    <>
      <header className="page-hero">
        <div className="container">
          <p className="eyebrow" style={{ color: 'var(--gold)' }}>Accounts</p>
          <h1>Privacy policy</h1>
          <p>What the café keeps, and the offers a guest can choose to receive.</p>
        </div>
      </header>
      <section className="page-section">
        <article className="policy-copy">
          <p>Ahla Al Layali Cafe keeps a guest account so the café can take an order, hold a table, and issue an invoice. The account stores the name, date of birth, email, phone number, and WhatsApp number, plus the orders and bookings placed while logged in.</p>
          <p>The date of birth is used for surprise gifts and birthday offers. It is not shown on the public site.</p>
          <p>Card numbers are typed at the checkout counter and are not stored in the guest list.</p>
          <p>
            Offers and promotions are sent only from Ahla Al Layali Cafe, and only by email and WhatsApp, and only when the guest selects that option while creating the account. The café does not pass the guest list to other businesses for their own advertising. The choice is part of opening the account, as described in the <Link to="/terms">terms</Link>.
          </p>
          <p>The café owner can open the guest list in the admin space and connect the café’s own CRM so online orders sit with the rest of the sales. That connection is for the café’s system, not for outside mailing lists.</p>
          <p>To correct a name, phone, WhatsApp number, or date of birth, the guest edits those details in the account dashboard.</p>
        </article>
      </section>
    </>
  )
}
