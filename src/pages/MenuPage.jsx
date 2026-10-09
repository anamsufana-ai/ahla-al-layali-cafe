import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { boards, menu } from '../data'
import OfferCarousel from '../components/OfferCarousel'
import MenuBoard, { BoardTabs } from '../components/MenuBoard'
import ItemModal from '../components/ItemModal'
import PackageModal from '../components/PackageModal'

export default function MenuPage() {
  const [params, setParams] = useSearchParams()
  const requested = params.get('board')
  const board = boards.some((item) => item.id === requested) ? requested : 'Food'
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(null)
  const [packageOffer, setPackageOffer] = useState(null)

  const chooseBoard = (next) => {
    setParams({ board: next })
  }

  const openOffer = (offer) => {
    if (offer.mode === 'deal') {
      const item = menu.find((entry) => entry.name === offer.itemName)
      if (item) setActive(item)
      return
    }
    setPackageOffer(offer)
  }

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <p className="eyebrow" style={{ color: 'var(--gold)' }}>
            Menu
          </p>
          <h1>À la carte, with a few packages</h1>
          <p>Offers sit in the banner. Food, drinks, coffee, and shisha are each listed on their own, at the café’s prices.</p>
        </div>
      </header>
      <section className="page-section">
        <div className="container">
          <OfferCarousel onSelect={openOffer} />
          <p className="board-note">Packages are optional. Order one coffee, one juice, one plate, or one shisha — whatever you actually want.</p>
          <div className="order-search">
            <span className="search-icon" aria-hidden="true">
              ⌕
            </span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search this category…" aria-label="Search the menu" />
          </div>
          <BoardTabs value={board} onChange={chooseBoard} />
          <MenuBoard board={board} query={query} onOpen={setActive} />
        </div>
      </section>
      {active && <ItemModal item={active} onClose={() => setActive(null)} />}
      {packageOffer && <PackageModal offer={packageOffer} onClose={() => setPackageOffer(null)} />}
    </>
  )
}
