import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { ProductDetailsPage } from './pages/ProductDetailsPage.jsx'
import { CartPage } from './pages/CartPage.jsx'
import { CheckoutPage } from './pages/CheckoutPage.jsx'
import { OrderConfirmationPage } from './pages/OrderConfirmationPage.jsx'
import { AboutPage } from './pages/AboutPage.jsx'
import { NotFoundPage } from './pages/NotFoundPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="products/:id" element={<ProductDetailsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="order-confirmation/:id" element={<OrderConfirmationPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
