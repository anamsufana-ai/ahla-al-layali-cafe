import Stripe from 'stripe'

function json(status, body) {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}

function aed(fils) {
  return `AED ${Math.round(fils / 100)}`
}

export const handler = async (event) => {
  if (event.httpMethod !== 'GET') return json(405, { error: 'Open the payment receipt from the link Stripe sent you back to.' })
  if (!process.env.STRIPE_SECRET_KEY) return json(503, { error: 'Card payments are not switched on yet.' })
  const sessionId = event.queryStringParameters?.session_id || ''
  if (!sessionId.startsWith('cs_')) return json(400, { error: 'This payment link is not valid.' })
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['line_items'] })
    if (session.payment_status !== 'paid') return json(200, { paid: false })
    const meta = session.metadata || {}
    const lines = (session.line_items?.data || []).map((line) => `${line.description} — ${aed(line.amount_total)}`)
    const text = [
      meta.kind === 'booking' ? `Table reservation ${meta.ref} — PAID` : `Order ${meta.ref} — PAID`,
      'Ahla Al Layali Cafe',
      `Name: ${meta.name || ''}`,
      `Phone: ${meta.phone || ''}`,
      meta.kind === 'booking' ? `Date: ${meta.date}` : `Type: ${meta.mode}`,
      meta.kind === 'booking' ? `Time: ${meta.time}` : `When: ${meta.when}`,
      meta.kind === 'booking' ? `Guests: ${meta.guests}` : '',
      meta.kind === 'booking' ? `Area: ${meta.area}` : '',
      meta.kind === 'booking' ? `Tables: ${meta.tables}` : '',
      meta.kind === 'booking' ? `Seating: ${meta.seating}` : '',
      meta.kind === 'booking' && meta.flavor ? `Shisha to start: ${meta.flavor}` : '',
      meta.kind === 'booking' ? 'Reservation fee is not refunded on cancellation or no-show.' : '',
      ...lines,
      meta.note || meta.notes ? `Note: ${meta.note || meta.notes}` : '',
      'Paid by card through Stripe.',
    ]
      .filter(Boolean)
      .join('\n')
    return json(200, {
      paid: true,
      kind: meta.kind,
      ref: meta.ref,
      total: aed(session.amount_total),
      text,
      record:
        meta.kind === 'booking'
          ? {
              ref: meta.ref,
              name: meta.name,
              phone: meta.phone,
              date: meta.date,
              time: meta.time,
              guests: meta.guests,
              tables: Number(meta.tables) || 1,
              areaLabel: meta.area,
              seatLabel: meta.seating,
              flavor: meta.flavor,
              fee: Math.round((session.amount_total || 0) / 100),
              paid: true,
            }
          : {
              ref: meta.ref,
              name: meta.name,
              total: Math.round((session.amount_total || 0) / 100),
              mode: meta.mode,
              text,
              paid: true,
            },
    })
  } catch (error) {
    console.error(error)
    return json(502, { error: 'The payment receipt could not be loaded.' })
  }
}
