export async function startCheckout(payload) {
  const response = await fetch('/.netlify/functions/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || !data.url) {
    throw new Error(data.error || 'The card payment could not be opened.')
  }
  window.location.assign(data.url)
}
