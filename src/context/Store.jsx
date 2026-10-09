import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { promos, seedReviews } from '../data'

const StoreContext = createContext(null)
const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => load('aal-cart', []))
  const [promoCode, setPromoCode] = useState(() => load('aal-promo', ''))
  const [promoMessage, setPromoMessage] = useState('')
  const [toast, setToast] = useState('')
  const [reviews, setReviews] = useState(() => [...load('aal-reviews', []), ...seedReviews])
  const [bookings, setBookings] = useState(() => load('aal-bookings', []))
  const [orders, setOrders] = useState(() => load('aal-orders', []))

  useEffect(() => localStorage.setItem('aal-cart', JSON.stringify(cart)), [cart])
  useEffect(() => localStorage.setItem('aal-promo', JSON.stringify(promoCode)), [promoCode])
  useEffect(() => localStorage.setItem('aal-bookings', JSON.stringify(bookings)), [bookings])
  useEffect(() => localStorage.setItem('aal-orders', JSON.stringify(orders)), [orders])

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(''), 2800)
    return () => clearTimeout(timer)
  }, [toast])

  const notify = (message) => setToast(message)

  const addToCart = (line) => {
    setCart((current) => {
      const signature = `${line.itemId}|${line.summary}|${line.note}`
      const existing = current.find((entry) => entry.signature === signature)
      if (existing) {
        return current.map((entry) =>
          entry.signature === signature ? { ...entry, qty: entry.qty + line.qty } : entry,
        )
      }
      return [...current, { ...line, signature, lineId: `${signature}-${Date.now()}` }]
    })
    notify(`${line.name} added to the order`)
  }

  const updateQty = (lineId, qty) => {
    setCart((current) =>
      qty <= 0 ? current.filter((entry) => entry.lineId !== lineId) : current.map((entry) => (entry.lineId === lineId ? { ...entry, qty } : entry)),
    )
  }

  const clearCart = () => {
    setCart([])
    setPromoCode('')
    setPromoMessage('')
  }

  const applyPromo = (code) => {
    const next = code.trim().toUpperCase()
    if (!next) {
      setPromoCode('')
      setPromoMessage('')
      return
    }
    if (!promos[next]) {
      setPromoMessage('That code is not active.')
      return
    }
    setPromoCode(next)
    setPromoMessage(`${promos[next].label} applied.`)
  }

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, line) => sum + line.unit * line.qty, 0)
    const promo = promos[promoCode]
    let discount = 0
    if (promo?.type === 'percent') discount = Math.round(subtotal * (promo.value / 100))
    if (promo?.type === 'amount') discount = Math.min(promo.value, subtotal)
    return { subtotal, discount, total: Math.max(0, subtotal - discount), count: cart.reduce((sum, line) => sum + line.qty, 0) }
  }, [cart, promoCode])

  const addReview = (review) => {
    const next = { ...review, id: `local-${Date.now()}` }
    const saved = [next, ...load('aal-reviews', [])]
    localStorage.setItem('aal-reviews', JSON.stringify(saved))
    setReviews((current) => [next, ...current])
    notify('Thank you. Your note is on the wall.')
  }

  const saveBooking = (booking) => {
    setBookings((current) => [booking, ...current])
  }

  const saveOrder = (order) => {
    setOrders((current) => [order, ...current])
    clearCart()
  }

  const value = {
    cart,
    addToCart,
    updateQty,
    clearCart,
    promoCode,
    promoMessage,
    applyPromo,
    totals,
    toast,
    notify,
    reviews,
    addReview,
    bookings,
    saveBooking,
    orders,
    saveOrder,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useStore must be used inside StoreProvider')
  return context
}
