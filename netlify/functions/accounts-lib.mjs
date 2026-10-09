import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

export const ADMIN_EMAIL = 'anam.sufana@gmail.com'

const DAY = 24 * 60 * 60 * 1000

function clean(value, max) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max)
}

function emailOf(value) {
  return clean(value, 120).toLowerCase()
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  const hash = scryptSync(password, salt, 32).toString('hex')
  return `${salt}:${hash}`
}

function checkPassword(password, stored) {
  const [salt, hash] = String(stored || '').split(':')
  if (!salt || !hash) return false
  const next = scryptSync(password, salt, 32)
  const prev = Buffer.from(hash, 'hex')
  if (next.length !== prev.length) return false
  return timingSafeEqual(next, prev)
}

function publicUser(user) {
  if (!user) return null
  return {
    email: user.email,
    name: user.name,
    dob: user.dob || '',
    phone: user.phone || '',
    whatsapp: user.whatsapp || '',
    role: user.role || 'client',
    marketing: user.marketing === true,
    termsAcceptedAt: user.termsAcceptedAt || '',
    createdAt: user.createdAt || '',
    orders: user.orders || [],
    bookings: user.bookings || [],
  }
}

function birthdayNote(dob) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob || '')) return ''
  const [, month, day] = dob.split('-').map(Number)
  const today = new Date()
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  let next = new Date(today.getFullYear(), month - 1, day)
  if (next < start) next = new Date(today.getFullYear() + 1, month - 1, day)
  const days = Math.round((next - start) / DAY)
  if (days === 0) return 'Birthday today'
  if (days <= 30) return `Birthday in ${days} day${days === 1 ? '' : 's'}`
  return ''
}

function validateProfile(input, { creating }) {
  const name = clean(input.name, 80)
  const email = emailOf(input.email)
  const phone = clean(input.phone, 30)
  const whatsapp = clean(input.whatsapp, 30)
  const dob = clean(input.dob, 10)
  if (name.length < 2) return { error: 'Add the guest name.' }
  if (!validEmail(email)) return { error: 'Add a real email address.' }
  if (phone.length < 7) return { error: 'Add a phone number.' }
  if (whatsapp.length < 7) return { error: 'Add a WhatsApp number.' }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) return { error: 'Add a date of birth.' }
  const born = new Date(`${dob}T00:00:00Z`)
  const today = new Date()
  if (Number.isNaN(born.getTime()) || born.getUTCFullYear() < 1920 || born >= today) {
    return { error: 'The date of birth needs to be a past date.' }
  }
  if (creating) {
    if (String(input.password || '').length < 8) return { error: 'Use a password of at least 8 characters.' }
    if (input.terms !== true) return { error: 'Agree to the terms and the privacy policy to open an account.' }
    if (input.marketing !== true) {
      return { error: 'Select the offer box to receive promotions from Ahla Al Layali Cafe only, by email and WhatsApp.' }
    }
  }
  return { name, email, phone, whatsapp, dob }
}

export function memoryStore() {
  const data = new Map()
  return {
    async get(key) {
      return data.has(key) ? structuredClone(data.get(key)) : null
    },
    async set(key, value) {
      data.set(key, structuredClone(value))
    },
  }
}

export function createAccounts(store, { adminPassword = '' } = {}) {
  const userKey = (email) => `user:${email}`
  const sessionKey = (token) => `session:${token}`

  async function users() {
    return (await store.get('users')) || []
  }

  async function ensureAdmin() {
    const email = ADMIN_EMAIL
    const existing = await store.get(userKey(email))
    if (!adminPassword) return existing
    if (existing && checkPassword(adminPassword, existing.passwordHash)) return existing
    const admin = {
      ...(existing || {}),
      email,
      name: existing?.name || 'Ana Maria',
      dob: existing?.dob || '',
      phone: existing?.phone || '',
      whatsapp: existing?.whatsapp || '',
      role: 'admin',
      marketing: existing?.marketing === true,
      termsAcceptedAt: existing?.termsAcceptedAt || new Date().toISOString(),
      createdAt: existing?.createdAt || new Date().toISOString(),
      passwordHash: hashPassword(adminPassword),
      orders: existing?.orders || [],
      bookings: existing?.bookings || [],
    }
    await store.set(userKey(email), admin)
    const list = await users()
    if (!list.includes(email)) await store.set('users', [email, ...list])
    return admin
  }

  async function sessionUser(token) {
    if (!token) return null
    const session = await store.get(sessionKey(token))
    if (!session || session.exp < Date.now()) return null
    return store.get(userKey(session.email))
  }

  async function openSession(email) {
    const token = randomBytes(24).toString('hex')
    await store.set(sessionKey(token), { email, exp: Date.now() + 30 * DAY })
    return token
  }

  async function register(input) {
    const profile = validateProfile(input, { creating: true })
    if (profile.error) return { status: 400, body: { error: profile.error } }
    if (profile.email === ADMIN_EMAIL) return { status: 400, body: { error: 'That email is the café admin account. Log in instead.' } }
    await ensureAdmin()
    if (await store.get(userKey(profile.email))) return { status: 400, body: { error: 'An account with that email is already open. Log in.' } }
    const user = {
      ...profile,
      role: 'client',
      marketing: true,
      termsAcceptedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      passwordHash: hashPassword(input.password),
      orders: [],
      bookings: [],
    }
    await store.set(userKey(profile.email), user)
    const list = await users()
    await store.set('users', [profile.email, ...list.filter((item) => item !== profile.email)])
    const token = await openSession(profile.email)
    return { status: 200, body: { token, user: publicUser(user) } }
  }

  async function login(input) {
    const admin = await ensureAdmin()
    const email = emailOf(input.email)
    const user = email === ADMIN_EMAIL ? admin : await store.get(userKey(email))
    if (!user || !checkPassword(String(input.password || ''), user.passwordHash)) {
      return { status: 400, body: { error: 'That email or password is not right.' } }
    }
    const token = await openSession(email)
    return { status: 200, body: { token, user: publicUser(user) } }
  }

  async function me(input) {
    await ensureAdmin()
    const user = await sessionUser(input.token)
    if (!user) return { status: 401, body: { error: 'Log in again.' } }
    return { status: 200, body: { user: publicUser(user) } }
  }

  async function update(input) {
    const user = await sessionUser(input.token)
    if (!user) return { status: 401, body: { error: 'Log in again.' } }
    const profile = validateProfile({ ...user, ...input, email: user.email, terms: true, marketing: true, password: 'placeholder' }, { creating: false })
    if (profile.error) return { status: 400, body: { error: profile.error } }
    const next = { ...user, name: profile.name, dob: profile.dob, phone: profile.phone, whatsapp: profile.whatsapp }
    await store.set(userKey(user.email), next)
    return { status: 200, body: { user: publicUser(next) } }
  }

  async function pushCrm(kind, record) {
    const crm = await store.get('crm')
    if (!crm?.connected || !crm.webhookUrl) return 'skipped'
    try {
      const response = await fetch(crm.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(crm.apiKey ? { Authorization: `Bearer ${crm.apiKey}` } : {}),
        },
        body: JSON.stringify({ source: 'Ahla Al Layali Cafe', type: kind, record }),
        signal: AbortSignal.timeout(4000),
      })
      return response.ok ? 'sent' : 'failed'
    } catch {
      return 'failed'
    }
  }

  async function record(input) {
    const user = await sessionUser(input.token)
    if (!user) return { status: 401, body: { error: 'Log in again before paying.' } }
    const kind = input.kind === 'booking' ? 'booking' : input.kind === 'order' ? 'order' : ''
    if (!kind) return { status: 400, body: { error: 'Choose an order or a booking.' } }
    const source = input.record && typeof input.record === 'object' ? input.record : {}
    const entry = {
      ref: clean(source.ref, 20) || `${kind === 'booking' ? 'AAL' : 'ORD'}-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      email: user.email,
      name: user.name,
      phone: user.phone,
      whatsapp: user.whatsapp,
      total: Math.round(Number(source.total ?? source.fee) || 0),
      summary: clean(source.text || source.summary, 2000),
      mode: clean(source.mode, 40),
      when: clean(source.when || `${source.date || ''} ${source.time || ''}`, 80),
      lines: Array.isArray(source.lines) ? source.lines.slice(0, 40).map((line) => clean(typeof line === 'string' ? line : line.name, 160)) : [],
      areaLabel: clean(source.areaLabel, 80),
      guests: clean(source.guests, 10),
      tables: Number(source.tables) || 1,
    }
    entry.crm = await pushCrm(kind, entry)
    const bucket = kind === 'booking' ? 'bookings' : 'orders'
    const next = { ...user, [bucket]: [entry, ...(user[bucket] || [])].slice(0, 80) }
    await store.set(userKey(user.email), next)
    return { status: 200, body: { record: entry, user: publicUser(next) } }
  }

  function crmPublic(crm) {
    if (!crm) return { connected: false, provider: '', webhookUrl: '', apiKeySet: false }
    return {
      connected: crm.connected === true,
      provider: crm.provider || '',
      webhookUrl: crm.webhookUrl || '',
      apiKeySet: Boolean(crm.apiKey),
    }
  }

  async function admin(input) {
    const user = await sessionUser(input.token)
    if (!user || user.role !== 'admin') return { status: 403, body: { error: 'This space is for the café owner.' } }
    const emails = await users()
    const clients = []
    for (const email of emails) {
      const guest = await store.get(userKey(email))
      if (!guest || guest.role === 'admin') continue
      clients.push({ ...publicUser(guest), birthday: birthdayNote(guest.dob) })
    }
    const orders = clients.flatMap((guest) => (guest.orders || []).map((item) => ({ ...item, client: guest.name })))
    const bookings = clients.flatMap((guest) => (guest.bookings || []).map((item) => ({ ...item, client: guest.name })))
    orders.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    bookings.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    return { status: 200, body: { clients, orders, bookings, crm: crmPublic(await store.get('crm')) } }
  }

  async function crm(input) {
    const user = await sessionUser(input.token)
    if (!user || user.role !== 'admin') return { status: 403, body: { error: 'This space is for the café owner.' } }
    const provider = clean(input.provider, 80)
    const webhookUrl = clean(input.webhookUrl, 300)
    const apiKey = clean(input.apiKey, 200)
    const connected = input.connected === true
    if (connected) {
      if (!provider) return { status: 400, body: { error: 'Name the CRM you want to connect.' } }
      let parsed
      try {
        parsed = new URL(webhookUrl)
      } catch {
        return { status: 400, body: { error: 'Add the CRM web address, starting with https://.' } }
      }
      if (parsed.protocol !== 'https:') return { status: 400, body: { error: 'The CRM address must start with https://.' } }
    }
    const previous = (await store.get('crm')) || {}
    const next = {
      connected,
      provider,
      webhookUrl: connected ? webhookUrl : '',
      apiKey: apiKey || previous.apiKey || '',
      updatedAt: new Date().toISOString(),
    }
    if (!connected) next.apiKey = ''
    await store.set('crm', next)
    return { status: 200, body: { crm: crmPublic(next) } }
  }

  async function handle(input) {
    const action = input?.action
    if (action === 'register') return register(input)
    if (action === 'login') return login(input)
    if (action === 'me') return me(input)
    if (action === 'update') return update(input)
    if (action === 'record') return record(input)
    if (action === 'admin') return admin(input)
    if (action === 'crm') return crm(input)
    return { status: 400, body: { error: 'That account action is not available.' } }
  }

  return { handle }
}
