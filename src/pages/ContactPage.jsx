import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cafe, whatsappLink } from '../data'

const topics = ['General question', 'Table reservation', 'Private gathering', 'Menu question']

export default function ContactPage() {
  const [form, setForm] = useState({ topic: topics[0], name: '', phone: '', message: '' })
  const [error, setError] = useState('')
  const [sent, setSent] = useState('')

  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))

  const submit = (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      setError('Name, phone, and a message are needed so the café can reply.')
      return
    }
    const text = [
      `Hi Ahla Al Layali Cafe,`,
      `Topic: ${form.topic}`,
      `Name: ${form.name.trim()}`,
      `Phone: ${form.phone.trim()}`,
      form.message.trim(),
    ].join('\n')
    setError('')
    setSent(text)
  }

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <p className="eyebrow" style={{ color: 'var(--gold)' }}>
            Contact
          </p>
          <h1>Talk to the café</h1>
          <p>For a table, use booking. For anything else, send a WhatsApp note or call.</p>
        </div>
      </header>
      <section className="page-section">
        <div className="container contact-grid">
          <aside className="contact-aside">
            <h2>We read every note</h2>
            <p>
              Call <a href={`tel:${cafe.phoneTel}`}>{cafe.phoneDisplay}</a>, or send the form through WhatsApp. Table requests are confirmed by the café, not held automatically.
            </p>
            <p>{cafe.addressLines.join(', ')}</p>
            <p>{cafe.hoursNote}</p>
            <div className="inline-actions">
              <a className="btn btn-primary" href={`tel:${cafe.phoneTel}`}>
                Call
              </a>
              <Link className="btn btn-dark" to="/book">
                Book a table
              </Link>
            </div>
          </aside>
          {sent ? (
            <div className="contact-form">
              <div className="form-success">Your message is ready. Send it on WhatsApp so the café receives it.</div>
              <a className="btn btn-primary" href={whatsappLink(sent)} target="_blank" rel="noreferrer">
                Send on WhatsApp
              </a>
              <button className="btn btn-dark" type="button" onClick={() => setSent('')}>
                Write another note
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={submit}>
              <div className="field">
                <label htmlFor="topic">Topic</label>
                <select id="topic" value={form.topic} onChange={set('topic')}>
                  {topics.map((topic) => (
                    <option key={topic}>{topic}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="cname">Name</label>
                <input id="cname" value={form.name} onChange={set('name')} placeholder="Your name" />
              </div>
              <div className="field">
                <label htmlFor="cphone">Phone</label>
                <input id="cphone" value={form.phone} onChange={set('phone')} placeholder="05…" />
              </div>
              <div className="field">
                <label htmlFor="cmessage">Message</label>
                <textarea id="cmessage" value={form.message} onChange={set('message')} placeholder="How can the café help?" />
              </div>
              {error && <p className="field-error">{error}</p>}
              <button className="btn btn-primary" type="submit">
                Prepare WhatsApp message
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
