import { Link } from 'react-router-dom';
import { Truck, RefreshCcw, Clock, MapPin, Package, AlertCircle, CheckCircle } from 'lucide-react';
import './PolicyPages.css';

const ShippingReturns = () => {
  return (
    <div className="policy-page">
      {/* Hero */}
      <div className="policy-hero-banner">
        <div className="container">
          <div className="policy-breadcrumb">
            <Link to="/">Home</Link> / <span>Shipping &amp; Returns</span>
          </div>
          <div className="policy-hero-icon"><Truck size={24} /></div>
          <h1>Shipping &amp; Returns</h1>
          <p>Everything you need to know about delivery and our hassle-free return policy.</p>
        </div>
      </div>

      <div className="container">
        {/* Shipping */}
        <div className="policy-card">
          <h2>Shipping Information</h2>

          <div className="policy-info-grid">
            <div className="policy-info-item">
              <h4>Standard Delivery</h4>
              <p>5–7 Business Days — Rs. 200</p>
            </div>
            <div className="policy-info-item">
              <h4>Free Shipping</h4>
              <p>Orders Rs. 3,000+ — FREE</p>
            </div>
            <div className="policy-info-item">
              <h4>Express Delivery</h4>
              <p>2–3 Business Days — Rs. 400</p>
            </div>
            <div className="policy-info-item">
              <h4>Same Day (Lahore Only)</h4>
              <p>Order before 2 PM — Rs. 600</p>
            </div>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem', marginTop: '1.25rem' }}>
            {[
              { icon: AlertCircle, text: 'Orders placed before 2 PM (Monday-Saturday) are dispatched the same day.' },
              { icon: Clock,       text: 'Business days are Monday–Saturday, excluding public holidays.' },
              { icon: MapPin,      text: 'We deliver to all major cities: Karachi, Lahore, Islamabad, Faisalabad, Multan, Peshawar, Quetta & more.' },
              { icon: Package,     text: 'A tracking number is sent via SMS and email once your order is dispatched.' },
            ].map(({ icon: Icon, text }, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.875rem', color: '#4b5563' }}>
                <Icon size={16} style={{ flexShrink: 0, marginTop: 2, color: '#6b7280' }} />
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <div className="policy-warning" style={{ marginTop: '1.25rem' }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span><strong>Note:</strong> Delivery to remote areas may take 1-2 additional business days. We partner with TCS, Leopards Courier, and M&amp;P for reliable nationwide delivery.</span>
          </div>
        </div>

        {/* Returns */}
        <div className="policy-card">
          <h2>Return Policy</h2>

          <div className="policy-highlight">
            <CheckCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span><strong>14-Day Hassle-Free Returns</strong> — Not happy? Return it within 14 days of delivery, no questions asked.</span>
          </div>

          <h3>Conditions for Return</h3>
          <ul>
            <li>Item must be unworn, unwashed, and unused</li>
            <li>Original tags and labels must still be attached</li>
            <li>Item must be in original packaging (bag or box)</li>
            <li>Proof of purchase (order confirmation email) required</li>
            <li>Sale items (20%+ discount) and customized/personalized products are non-refundable</li>
            <li>Defective or incorrect items are eligible for free return/exchange</li>
          </ul>

          <h3 style={{ marginTop: '1.5rem' }}>How to Return</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            {[
              'Email us at support@mentastic.com with your Order ID and reason.',
              'We\'ll confirm and send you the return shipping address.',
              'Ship the item back. Refund is processed within 3–5 business days.',
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#0f0f0f', color: 'white', fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#4b5563', paddingTop: 2 }}>{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="policy-contact-banner">
          <p>Still have questions? <Link to="/contact">Contact our support team →</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ShippingReturns;
