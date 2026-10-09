import { Route, Routes } from 'react-router-dom'
import { StoreProvider } from './context/Store'
import { AuthProvider } from './context/Auth'
import Layout from './components/Layout'
import Home from './pages/Home'
import MenuPage from './pages/MenuPage'
import AboutPage from './pages/AboutPage'
import GalleryPage from './pages/GalleryPage'
import ContactPage from './pages/ContactPage'
import OrderPage from './pages/OrderPage'
import BookPage from './pages/BookPage'
import CheckoutSuccess from './pages/CheckoutSuccess'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AccountPage from './pages/AccountPage'
import InvoicePage from './pages/InvoicePage'
import AdminPage from './pages/AdminPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'

export default function App() {
  return (
    <AuthProvider>
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
          <Route path="checkout/success" element={<CheckoutSuccess />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="account/invoice/:ref" element={<InvoicePage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
        </Route>
      </Routes>
        </StoreProvider>
      </AuthProvider>
  )
}
