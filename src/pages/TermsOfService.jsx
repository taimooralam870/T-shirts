import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import './PolicyPages.css';

const TermsOfService = () => {
  return (
    <div className="policy-page section container">
      <div className="policy-breadcrumb">
        <Link to="/">Home</Link> / <span>Terms of Service</span>
      </div>

      <div className="policy-hero">
        <FileText size={40} />
        <h1>Terms of Service</h1>
        <p>Last updated: June 2026</p>
      </div>

      <div className="policy-card prose-card">
        <section className="policy-section">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using the Mentastic website and placing orders, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.</p>
        </section>

        <section className="policy-section">
          <h2>2. Products & Pricing</h2>
          <ul>
            <li>All prices are listed in Pakistani Rupees (Rs.) and are subject to change without notice.</li>
            <li>We reserve the right to limit quantities or refuse orders at our discretion.</li>
            <li>Product images are for illustrative purposes. Actual colors may vary slightly due to screen settings.</li>
            <li>We make every effort to display product descriptions accurately, but we do not warrant that descriptions are complete or error-free.</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>3. Orders & Payment</h2>
          <ul>
            <li>An order confirmation does not guarantee product availability.</li>
            <li>We accept Cash on Delivery (COD) and Bank Transfer.</li>
            <li>For COD orders, payment is due upon delivery.</li>
            <li>We reserve the right to cancel any order due to stock unavailability or pricing errors.</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>4. Shipping & Delivery</h2>
          <p>Delivery timelines are estimates and not guaranteed. Mentastic is not responsible for delays caused by courier services, weather conditions, or circumstances beyond our control. Please refer to our <Link to="/shipping-returns">Shipping & Returns</Link> page for full details.</p>
        </section>

        <section className="policy-section">
          <h2>5. Returns & Refunds</h2>
          <p>Our return policy allows returns within 14 days of delivery under specific conditions. Please review our <Link to="/shipping-returns">Shipping & Returns</Link> policy for eligibility and process details.</p>
        </section>

        <section className="policy-section">
          <h2>6. Intellectual Property</h2>
          <p>All content on this website — including logos, designs, text, graphics, and images — is the property of Mentastic and is protected under applicable intellectual property laws. You may not reproduce, distribute, or use any content without our written permission.</p>
        </section>

        <section className="policy-section">
          <h2>7. Limitation of Liability</h2>
          <p>Mentastic shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our maximum liability is limited to the amount paid for the specific order in question.</p>
        </section>

        <section className="policy-section">
          <h2>8. Changes to Terms</h2>
          <p>We reserve the right to update these Terms of Service at any time. Changes will be effective immediately upon posting on the website. Continued use of the website after changes constitutes acceptance of the new terms.</p>
        </section>

        <section className="policy-section">
          <h2>9. Contact</h2>
          <p>For any questions regarding these terms, please contact:</p>
          <p><strong>Email:</strong> taimooralam870@gmail.com</p>
          <p><strong>Phone:</strong> +923175992862</p>
        </section>
      </div>

      <div className="policy-contact-banner">
        <p>Have questions? <Link to="/contact">Get in touch →</Link></p>
      </div>
    </div>
  );
};

export default TermsOfService;
