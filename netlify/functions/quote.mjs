import {
  areas,
  cafe,
  choiceSummary,
  menu,
  occasions,
  offers,
  optionGroupsFor,
  promos,
  seating,
  slotOptions,
  timeSlots,
  unitPrice,
} from '../../src/data.js'

const WHEN = ['As soon as possible', 'In 30 minutes', 'In 1 hour', 'I am already at a table']

function clean(value, max) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max)
}

function priceLine(line) {
  const quantity = Number(line.qty)
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
    throw new Error('Check the quantities in the order.')
  }
  const note = clean(line.note, 80)
  if (line.kind === 'package') {
    const offer = offers.find((item) => item.id === line.itemId && item.slots)
    if (!offer) throw new Error('A package in the order is no longer on the menu.')
    const picks = line.picks && typeof line.picks === 'object' ? line.picks : {}
    const chosen = offer.slots.map((slot) => {
      const options = slotOptions(slot)
      return options.find((option) => option.id === picks[slot.key]) || options[0]
    })
    if (chosen.some((item) => !item)) throw new Error('Choose each part of the package.')
    return {
      name: offer.title,
      description: [chosen.map((item) => item.name).join(', '), note].filter(Boolean).join(' — '),
      amount: chosen.reduce((sum, item) => sum + item.price, 0),
      quantity,
    }
  }
  const item = menu.find((entry) => entry.id === line.itemId)
  if (!item) throw new Error('An item in the order is no longer on the menu.')
  const groups = optionGroupsFor(item)
  const choices = line.choices && typeof line.choices === 'object' ? { ...line.choices } : {}
  groups.forEach((group) => {
    const known = group.choices.some((choice) => choice.id === choices[group.key])
    if (!known) choices[group.key] = group.choices[0]?.id
  })
  return {
    name: item.name,
    description: [choiceSummary(groups, choices).join(', '), note].filter(Boolean).join(' — '),
    amount: unitPrice(item, groups, choices),
    quantity,
  }
}

function chargeable(lines, discount) {
  let remaining = Math.round(discount * 100)
  const items = lines
    .map((line) => ({
      name: line.name.slice(0, 120),
      description: line.description.slice(0, 200),
      fils: Math.round(line.amount * 100) * line.quantity,
    }))
    .map((line) => {
      const take = Math.min(remaining, line.fils)
      remaining -= take
      return { ...line, fils: line.fils - take }
    })
    .filter((line) => line.fils > 0)
  if (remaining > 0) throw new Error('That promo is larger than the order.')
  const totalFils = items.reduce((sum, line) => sum + line.fils, 0)
  if (totalFils < 200) throw new Error('The card payment must be at least AED 2.')
  return items
}

export function quoteBooking(input) {
  if (input?.accepted !== true) throw new Error('Confirm the non-refundable fee before paying.')
  const name = clean(input.name, 80)
  const phone = clean(input.phone, 30)
  const date = clean(input.date, 10)
  const time = clean(input.time, 20)
  if (!name || !phone || !date) throw new Error('Name, phone, and a date are required.')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Choose a valid date.')
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dubai' }).format(new Date())
  if (date < today) throw new Error('Choose today or a later date.')
  if (!timeSlots().includes(time)) throw new Error('Choose a time from the list.')
  const guests = Number(input.guests)
  if (!Number.isInteger(guests) || guests < cafe.minGuests || guests > 20) {
    throw new Error(`A table booking needs at least ${cafe.minGuests} guests.`)
  }
  const tables = Number(input.tables)
  if (!Number.isInteger(tables) || tables < 1 || tables > 6) throw new Error('Choose between 1 and 6 tables.')
  const area = areas.find((item) => item.id === input.area)
  if (!area) throw new Error('Choose the open area or a private cubicle.')
  const seat = area.id === 'open' ? seating.find((item) => item.id === input.seating) : null
  if (area.id === 'open' && !seat) throw new Error('Choose a seating style.')
  const occasion = occasions.includes(input.occasion) ? input.occasion : occasions[0]
  let flavor = clean(input.flavor, 80)
  if (flavor && !menu.some((item) => item.category === 'Shisha' && item.name === flavor && !/renew/i.test(item.name))) {
    flavor = ''
  }
  const notes = clean(input.notes, 240)
  const noun = tables === 1 ? area.unit : area.units
  const ref = `AAL-${Date.now().toString().slice(-6)}`
  return {
    kind: 'booking',
    ref,
    total: tables * area.fee,
    items: chargeable(
      [
        {
          name: `${area.label} reservation`,
          description: `${tables} ${noun} · ${guests} guests · ${date} ${time}`,
          amount: area.fee,
          quantity: tables,
        },
      ],
      0,
    ),
    policy: 'This reservation fee is not refunded if you cancel or do not show up.',
    cancelPath: '/book',
    metadata: {
      kind: 'booking',
      ref,
      name,
      phone,
      date,
      time,
      guests: String(guests),
      tables: String(tables),
      area: area.label,
      seating: seat?.label || area.label,
      occasion,
      flavor,
      notes,
    },
  }
}

export function quoteOrder(input) {
  const name = clean(input.name, 80)
  const phone = clean(input.phone, 30)
  if (!name || !phone) throw new Error('Add the name and phone for the order.')
  const mode = input.mode === 'Pickup' ? 'Pickup' : 'Dine-in'
  const when = WHEN.includes(input.when) ? input.when : WHEN[0]
  const note = clean(input.note, 240)
  const incoming = Array.isArray(input.lines) ? input.lines.slice(0, 30) : []
  if (!incoming.length) throw new Error('The order is empty.')
  const lines = incoming.map(priceLine)
  const subtotal = lines.reduce((sum, line) => sum + line.amount * line.quantity, 0)
  const code = clean(input.promo, 20).toUpperCase()
  const promo = code ? promos[code] : null
  if (code && !promo) throw new Error('That code is not active.')
  let discount = 0
  if (promo?.type === 'percent') discount = Math.round(subtotal * (promo.value / 100))
  if (promo?.type === 'amount') discount = Math.min(promo.value, subtotal)
  const ref = `ORD-${Date.now().toString().slice(-6)}`
  return {
    kind: 'order',
    ref,
    total: subtotal - discount,
    items: chargeable(lines, discount),
    policy: 'Ahla Al Layali prepares the order after this card payment.',
    cancelPath: '/order',
    metadata: {
      kind: 'order',
      ref,
      name,
      phone,
      mode,
      when,
      note,
      promo: promo ? code : '',
    },
  }
}
