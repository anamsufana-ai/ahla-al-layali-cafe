import { connectLambda, getStore } from '@netlify/blobs'
import { createAccounts } from './accounts-lib.mjs'

function json(status, body) {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}

function blobStore() {
  const blobs = getStore('ahla-guests')
  return {
    async get(key) {
      return blobs.get(key, { type: 'json' })
    },
    async set(key, value) {
      await blobs.setJSON(key, value)
    },
  }
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Use the account form on the site.' })
  let input
  try {
    input = JSON.parse(event.body || '{}')
  } catch {
    return json(400, { error: 'The account request was not valid.' })
  }
  try {
    connectLambda(event)
    const accounts = createAccounts(blobStore(), { adminPassword: process.env.ADMIN_PASSWORD || '' })
    const result = await accounts.handle(input)
    return json(result.status, result.body)
  } catch (error) {
    console.error(error)
    return json(502, { error: 'The guest book could not be opened. Try again in a moment.' })
  }
}
