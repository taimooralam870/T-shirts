import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SimpleCartDrawer from './components/SimpleCartDrawer';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import ShippingReturns from './pages/ShippingReturns';
import SizeGuide from './pages/SizeGuide';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import FAQ from './pages/FAQ';
import TrackOrder from './pages/TrackOrder';

// Admin
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

// Layout wrapper — hides Navbar/Footer on admin routes
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) return <>{children}</>;

  return (
    <div className="app-wrapper flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <SimpleCartDrawer />
    </div>
  );
};

function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <Router>
          <AppLayout>
            <Routes>
              {/* Store */}
              <Route path="/"                 element={<Home />} />
              <Route path="/shop"             element={<Shop />} />
              <Route path="/product/:id"      element={<ProductDetail />} />
              <Route path="/cart"             element={<Cart />} />
              <Route path="/checkout"         element={<Checkout />} />
              <Route path="/contact"          element={<Contact />} />
              <Route path="/shipping-returns" element={<ShippingReturns />} />
              <Route path="/size-guide"       element={<SizeGuide />} />
              <Route path="/privacy-policy"   element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/faq"              element={<FAQ />} />
              <Route path="/track-order"      element={<TrackOrder />} />

              {/* Admin */}
              <Route path="/admin"           element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </AppLayout>
        </Router>
      </CartProvider>
    </ProductProvider>
  );
}

export default App;
