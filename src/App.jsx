import { Route, Routes } from 'react-router-dom'
import { StoreProvider } from './context/Store'
import Layout from './components/Layout'
import Home from './pages/Home'
import MenuPage from './pages/MenuPage'
import AboutPage from './pages/AboutPage'
import GalleryPage from './pages/GalleryPage'
import ContactPage from './pages/ContactPage'
import OrderPage from './pages/OrderPage'
import BookPage from './pages/BookPage'

export default function App() {
  return (
    <StoreProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="order" element={<OrderPage />} />
          <Route path="book" element={<BookPage />} />
        </Route>
      </Routes>
    </StoreProvider>
  )
}
