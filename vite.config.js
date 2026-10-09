import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { createAccounts, memoryStore } from './netlify/functions/accounts-lib.mjs'

const localAccounts = createAccounts(memoryStore(), { adminPassword: process.env.ADMIN_PASSWORD || '' })

function localAccountApi() {
  return {
    name: 'aal-accounts',
    configureServer(server) {
      server.middlewares.use('/.netlify/functions/account', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('{}')
          return
        }
        let body = ''
        req.on('data', (chunk) => {
          body += chunk
        })
        req.on('end', async () => {
          try {
            const result = await localAccounts.handle(JSON.parse(body || '{}'))
            res.statusCode = result.status
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(result.body))
          } catch (error) {
            console.error(error)
            res.statusCode = 500
            res.end(JSON.stringify({ error: 'The guest book could not be opened.' }))
          }
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), localAccountApi()],
})
