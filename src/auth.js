export async function account(body) {
  const response = await fetch('/.netlify/functions/account', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || 'The account request failed.')
  return data
}
