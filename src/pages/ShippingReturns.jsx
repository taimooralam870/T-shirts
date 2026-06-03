import { Link } from 'react-router-dom';
import { Truck, RefreshCcw, Clock, MapPin, Package, AlertCircle } from 'lucide-react';
import './PolicyPages.css';

const ShippingReturns = () => {
  return (
    <div className="policy-page section container">
      <div className="policy-breadcrumb">
        <Link to="/">Home</Link> / <span>Shipping & Returns</span>
      </div>

      <div className="policy-hero">
        <Truck size={40} />
        <h1>Shipping & Returns</h1>
        <p>Everything you need to know about delivery and our return policy.</p>
      </div>

      <div className="policy-grid">
        {/* Shipping Info */}
        <div className="policy-card">
          <div className="policy-card-icon"><Truck size={24} /></div>
          <h2>Shipping Information</h2>

          <div className="policy-table">
            <div className="policy-table-row header">
              <span>Order Type</span>
              <span>Delivery Time</span>
              <span>Cost</span>
            </div>
            <div className="policy-table-row">
              <span>Standard (Under Rs. 3000)</span>
              <span>5–7 business days</span>
              <span>Rs. 200</span>
            </div>
            <div className="policy-table-row highlight">
              <span>Free Shipping (Rs. 3000+)</span>
              <span>5–7 business days</span>
              <span className="free-tag">FREE</span>
            </div>
            <div className="policy-table-row">
              <span>Express Delivery</span>
              <span>2–3 business days</span>
              <span>Rs. 400</span>
            </div>
          </div>

          <ul className="policy-list">
            <li><AlertCircle size={16} /><span>Orders placed before 2 PM are dispatched the same day.</span></li>
            <li><Clock size={16} /><span>Business days are Monday–Saturday, excluding public holidays.</span></li>
            <li><MapPin size={16} /><span>We deliver across all major cities in Pakistan.</span></li>
            <li><Package size={16} /><span>A tracking number is sent via SMS/email once your order is dispatched.</span></li>
          </ul>
        </div>

        {/* Returns Info */}
        <div className="policy-card">
          <div className="policy-card-icon"><RefreshCcw size={24} /></div>
          <h2>Return Policy</h2>

          <div className="policy-highlight-box">
            <h3>14-Day Hassle-Free Returns</h3>
            <p>Not happy with your purchase? Return it within 14 days of delivery — no questions asked.</p>
          </div>

          <h3 className="policy-subtitle">Conditions for Return</h3>
          <ul className="policy-list">
            <li><span>✓</span><span>Item must be unworn and unwashed.</span></li>
            <li><span>✓</span><span>Original tags must still be attached.</span></li>
            <li><span>✓</span><span>Item must be in original packaging.</span></li>
            <li><span>✗</span><span>Sale items and customized products are non-refundable.</span></li>
          </ul>

          <h3 className="policy-subtitle">How to Return</h3>
          <div className="policy-steps">
            <div className="policy-step">
              <span className="step-num">1</span>
              <span>Email us at <strong>taimooralam870@gmail.com</strong> with your Order ID and reason.</span>
            </div>
            <div className="policy-step">
              <span className="step-num">2</span>
              <span>We'll confirm and send you the return address.</span>
            </div>
            <div className="policy-step">
              <span className="step-num">3</span>
              <span>Ship the item back. Refund is processed within 3–5 business days after we receive it.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="policy-contact-banner">
        <p>Still have questions? <Link to="/contact">Contact our support team →</Link></p>
      </div>
    </div>
  );
};

export default ShippingReturns;
