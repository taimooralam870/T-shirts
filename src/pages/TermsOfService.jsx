import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import './PolicyPages.css';

const TermsOfService = () => {
  return (
    <div className="policy-page">
      <div className="policy-hero-banner">
        <div className="container">
          <div className="policy-breadcrumb">
            <Link to="/">Home</Link> / <span>Terms of Service</span>
          </div>
          <div className="policy-hero-icon"><FileText size={24} /></div>
          <h1>Terms of Service</h1>
          <p>Last updated: June 2026</p>
        </div>
      </div>

      <div className="container">
        {[
          {
            title: '1. Acceptance of Terms',
            content: 'By accessing or using the Mentastic website and placing orders, you agree to be bound by these Terms of Service. If you do not agree, please do not use our website.',
          },
          {
            title: '2. Products & Pricing',
            list: [
              'All prices are listed in Pakistani Rupees (Rs.) and are subject to change without notice.',
              'We reserve the right to limit quantities or refuse orders at our discretion.',
              'Product images are for illustrative purposes. Actual colors may vary slightly.',
              'We make every effort to display product descriptions accurately but do not warrant completeness.',
            ],
          },
          {
            title: '3. Orders & Payment',
            list: [
              'An order confirmation does not guarantee product availability.',
              'We accept Cash on Delivery (COD) and Bank Transfer.',
              'For COD orders, payment is due upon delivery.',
              'We reserve the right to cancel any order due to stock unavailability or pricing errors.',
            ],
          },
          {
            title: '4. Shipping & Delivery',
            content: 'Delivery timelines are estimates and not guaranteed. Mentastic is not responsible for delays caused by courier services or circumstances beyond our control.',
            linkTo: '/shipping-returns',
            linkText: 'See Shipping & Returns policy',
          },
          {
            title: '5. Returns & Refunds',
            content: 'Our return policy allows returns within 14 days of delivery under specific conditions.',
            linkTo: '/shipping-returns',
            linkText: 'See full return policy',
          },
          {
            title: '6. Intellectual Property',
            content: 'All content on this website — including logos, designs, text, and images — is the property of Mentastic and is protected under applicable intellectual property laws.',
          },
          {
            title: '7. Limitation of Liability',
            content: 'Mentastic shall not be liable for any indirect, incidental, or consequential damages. Our maximum liability is limited to the amount paid for the specific order in question.',
          },
          {
            title: '8. Changes to Terms',
            content: 'We reserve the right to update these Terms at any time. Continued use of the website after changes constitutes acceptance of the new terms.',
          },
        ].map((section, i) => (
          <div className="policy-card" key={i}>
            <h2>{section.title}</h2>
            {section.content && <p>{section.content}</p>}
            {section.linkTo && (
              <p><Link to={section.linkTo} style={{ color: '#0f0f0f', fontWeight: 600, textDecoration: 'underline' }}>{section.linkText} →</Link></p>
            )}
            {section.list && (
              <ul>
                {section.list.map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            )}
          </div>
        ))}

        <div className="policy-card">
          <h2>9. Contact</h2>
          <div className="policy-info-grid" style={{ marginTop: '0.5rem' }}>
            <div className="policy-info-item">
              <h4>Email</h4>
              <p>support@mentastic.com</p>
            </div>
            <div className="policy-info-item">
              <h4>Phone</h4>
              <p>+92 317 5992862</p>
            </div>
          </div>
        </div>

        <div className="policy-contact-banner">
          <p>Have questions? <Link to="/contact">Get in touch →</Link></p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
