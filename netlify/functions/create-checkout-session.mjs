import Stripe from 'stripe'
import { quoteBooking, quoteOrder } from './quote.mjs'

const ALLOWED = new Set([
  'https://ahla-al-layali-cafe.netlify.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
])

function json(status, body) {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Use the checkout button on the site.' })
  if (!process.env.STRIPE_SECRET_KEY) {
    return json(503, { error: 'Card payments are not switched on yet. Add the Stripe secret key in Netlify.' })
  }
  let input
  try {
    input = JSON.parse(event.body || '{}')
  } catch {
    return json(400, { error: 'The payment request was not valid.' })
  }
  let quote
  try {
    quote = input.kind === 'booking' ? quoteBooking(input) : input.kind === 'order' ? quoteOrder(input) : null
    if (!quote) throw new Error('Choose a table booking or an order.')
  } catch (error) {
    return json(400, { error: error.message || 'The payment could not be prepared.' })
  }
  const requestOrigin = event.headers.origin || event.headers.Origin || ''
  const origin = ALLOWED.has(requestOrigin) ? requestOrigin : 'https://ahla-al-layali-cafe.netlify.app'
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${quote.cancelPath}`,
      phone_number_collection: { enabled: true },
      custom_text: { submit: { message: quote.policy } },
      metadata: quote.metadata,
      payment_intent_data: { description: `${quote.metadata.ref} · Ahla Al Layali Cafe`, metadata: quote.metadata },
      line_items: quote.items.map((item) => ({
        quantity: 1,
        price_data: {
          currency: 'aed',
          unit_amount: item.fils,
          product_data: {
            name: item.name,
            description: item.description || undefined,
          },
        },
      })),
    })
    return json(200, { url: session.url })
  } catch (error) {
    console.error(error)
    return json(502, { error: 'Stripe could not open the card payment. Try again in a moment.' })
  }
}
