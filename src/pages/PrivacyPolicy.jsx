import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import './PolicyPages.css';

const PrivacyPolicy = () => {
  return (
    <div className="policy-page section container">
      <div className="policy-breadcrumb">
        <Link to="/">Home</Link> / <span>Privacy Policy</span>
      </div>

      <div className="policy-hero">
        <Shield size={40} />
        <h1>Privacy Policy</h1>
        <p>Last updated: June 2026</p>
      </div>

      <div className="policy-card prose-card">
        <section className="policy-section">
          <h2>1. Information We Collect</h2>
          <p>When you place an order or contact us, we collect the following information:</p>
          <ul>
            <li>Name, email address, and phone number</li>
            <li>Shipping address</li>
            <li>Order history and preferences</li>
            <li>Device and browser information (via cookies)</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process and fulfill your orders</li>
            <li>Send order confirmations and shipping updates</li>
            <li>Respond to your inquiries and support requests</li>
            <li>Improve our products and website experience</li>
            <li>Send promotional emails (you can unsubscribe anytime)</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>3. Data Sharing</h2>
          <p>We do <strong>not</strong> sell, trade, or rent your personal information to third parties. We may share data with:</p>
          <ul>
            <li>Delivery partners (for order fulfillment only)</li>
            <li>Payment processors (for secure transaction handling)</li>
            <li>Analytics tools (anonymized data only)</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>4. Cookies</h2>
          <p>We use cookies to enhance your shopping experience. Cookies help us remember your cart, preferences, and session. You can disable cookies in your browser settings, though some features may not work correctly.</p>
        </section>

        <section className="policy-section">
          <h2>5. Data Security</h2>
          <p>We implement industry-standard security measures to protect your personal data. All sensitive information is encrypted and transmitted securely. However, no method of transmission over the internet is 100% secure.</p>
        </section>

        <section className="policy-section">
          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt out of marketing communications at any time</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>7. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <p><strong>Email:</strong> taimooralam870@gmail.com</p>
          <p><strong>Phone:</strong> +923175992862</p>
        </section>
      </div>

      <div className="policy-contact-banner">
        <p>Questions about your data? <Link to="/contact">Contact us →</Link></p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
