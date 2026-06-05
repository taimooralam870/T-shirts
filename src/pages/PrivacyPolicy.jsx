import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import './PolicyPages.css';

const PrivacyPolicy = () => {
  return (
    <div className="policy-page">
      <div className="policy-hero-banner">
        <div className="container">
          <div className="policy-breadcrumb">
            <Link to="/">Home</Link> / <span>Privacy Policy</span>
          </div>
          <div className="policy-hero-icon"><Shield size={24} /></div>
          <h1>Privacy Policy</h1>
          <p>Last updated: June 2026</p>
        </div>
      </div>

      <div className="container">
        <div className="policy-card">
          <h2>1. Information We Collect</h2>
          <p>When you visit our website, place an order, or contact us, we collect:</p>
          <ul>
            <li><strong>Personal Information:</strong> Name, email address, phone number, and shipping/billing address</li>
            <li><strong>Order Data:</strong> Order history, product preferences, size selections, and purchase details</li>
            <li><strong>Payment Information:</strong> Payment method details (we do NOT store card numbers or bank account information)</li>
            <li><strong>Technical Data:</strong> IP address, browser type, device information, and browsing behavior (via cookies)</li>
            <li><strong>Communications:</strong> Any messages or feedback you send us via email, contact forms, or social media</li>
          </ul>
        </div>

        <div className="policy-card">
          <h2>2. How We Use Your Information</h2>
          <p>We use your information for the following purposes:</p>
          <ul>
            <li><strong>Order Processing:</strong> To process, fulfill, and deliver your orders accurately and on time</li>
            <li><strong>Communication:</strong> To send order confirmations, shipping updates, tracking information, and delivery notifications via SMS and email</li>
            <li><strong>Customer Support:</strong> To respond to your inquiries, resolve issues, and provide assistance</li>
            <li><strong>Personalization:</strong> To remember your preferences and provide a customized shopping experience</li>
            <li><strong>Marketing:</strong> To send promotional emails, special offers, and new product announcements (you can opt-out anytime)</li>
            <li><strong>Analytics:</strong> To analyze website usage, improve our services, and enhance user experience</li>
            <li><strong>Security:</strong> To prevent fraud, detect unauthorized access, and protect against security threats</li>
            <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our Terms of Service</li>
          </ul>
        </div>

        <div className="policy-card">
          <h2>3. Data Sharing & Third Parties</h2>
          <p>We respect your privacy. We do <strong>NOT</strong> sell, trade, or rent your personal information to third parties. We only share data when necessary with:</p>
          <ul>
            <li><strong>Delivery Partners:</strong> TCS, Leopards, or other courier services for order fulfillment and shipment tracking (name, phone, address only)</li>
            <li><strong>Payment Processors:</strong> Secure payment gateways for transaction processing (we do not store your card details)</li>
            <li><strong>Analytics & Tools:</strong> Google Analytics, Facebook Pixel (anonymized behavioral data only, no personally identifiable information)</li>
            <li><strong>Email Service Providers:</strong> For sending order confirmations and promotional emails (you can unsubscribe anytime)</li>
            <li><strong>Legal Authorities:</strong> When required by law, court order, or to protect our legal rights</li>
          </ul>
          <p style={{ marginTop: '0.75rem' }}>All third-party partners are contractually obligated to keep your information secure and confidential.</p>
        </div>

        <div className="policy-card">
          <h2>4. Cookies & Tracking Technologies</h2>
          <p>We use cookies and similar tracking technologies to enhance your shopping experience. Cookies are small text files stored on your device that help us:</p>
          <ul>
            <li>Remember items in your shopping cart</li>
            <li>Keep you logged in to your account</li>
            <li>Remember your preferences (language, currency, etc.)</li>
            <li>Analyze website traffic and user behavior</li>
            <li>Show relevant ads on social media platforms</li>
          </ul>
          <p style={{ marginTop: '0.75rem' }}><strong>Cookie Types:</strong></p>
          <ul>
            <li><strong>Essential Cookies:</strong> Required for website functionality (shopping cart, checkout)</li>
            <li><strong>Performance Cookies:</strong> Help us understand how visitors use our site (Google Analytics)</li>
            <li><strong>Marketing Cookies:</strong> Used to show relevant ads and measure campaign effectiveness</li>
          </ul>
          <p style={{ marginTop: '0.75rem' }}>You can control cookies through your browser settings. Disabling cookies may limit some website features.</p>
        </div>

        <div className="policy-card">
          <h2>5. Data Security</h2>
          <p>We take data security seriously and implement industry-standard measures to protect your personal information, including:</p>
          <ul>
            <li><strong>SSL Encryption:</strong> All data transmitted between your browser and our servers is encrypted using 256-bit SSL</li>
            <li><strong>Secure Hosting:</strong> Our website is hosted on secure servers with firewall protection and regular security audits</li>
            <li><strong>Access Controls:</strong> Only authorized personnel have access to customer data, and all access is logged</li>
            <li><strong>Regular Backups:</strong> Customer data is backed up regularly to prevent data loss</li>
            <li><strong>Payment Security:</strong> We do NOT store credit card numbers or bank account details</li>
          </ul>
          <p style={{ marginTop: '0.75rem' }}>While we strive to protect your information, no method of transmission over the internet is 100% secure. Please use strong passwords and keep your account credentials confidential.</p>
        </div>

        <div className="policy-card">
          <h2>6. Your Privacy Rights</h2>
          <p>You have the following rights regarding your personal data:</p>
          <ul>
            <li><strong>Right to Access:</strong> Request a copy of all personal data we hold about you</li>
            <li><strong>Right to Correction:</strong> Request correction of inaccurate or incomplete information</li>
            <li><strong>Right to Deletion:</strong> Request deletion of your personal data (subject to legal obligations)</li>
            <li><strong>Right to Opt-Out:</strong> Unsubscribe from marketing emails at any time (click "Unsubscribe" in any email)</li>
            <li><strong>Right to Data Portability:</strong> Request your data in a machine-readable format</li>
            <li><strong>Right to Object:</strong> Object to processing of your data for marketing purposes</li>
            <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for data processing at any time</li>
          </ul>
          <p style={{ marginTop: '0.75rem' }}>To exercise any of these rights, email us at <strong>support@mentastic.com</strong> with your request.</p>
        </div>

        <div className="policy-card">
          <h2>7. Data Retention</h2>
          <p>We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy:</p>
          <ul>
            <li><strong>Order Data:</strong> Kept for 3 years for accounting, warranty, and legal compliance</li>
            <li><strong>Account Data:</strong> Retained until you request account deletion</li>
            <li><strong>Marketing Data:</strong> Retained until you unsubscribe from marketing communications</li>
            <li><strong>Technical Data:</strong> Cookies and logs are retained for 12 months</li>
          </ul>
          <p style={{ marginTop: '0.75rem' }}>After the retention period, data is securely deleted or anonymized. You can request early deletion by contacting us.</p>
        </div>

        <div className="policy-card">
          <h2>8. Children's Privacy</h2>
          <p>Our services are not directed to individuals under 16 years of age. We do not knowingly collect personal information from children. If you believe we have accidentally collected data from a child, please contact us immediately and we will delete it promptly.</p>
        </div>

        <div className="policy-card">
          <h2>9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time to reflect changes in our practices or for legal compliance. The "Last Updated" date at the top will indicate when changes were made. We encourage you to review this page periodically. Continued use of our website after changes constitutes acceptance of the updated policy.</p>
        </div>

        <div className="policy-card">
          <h2>10. Contact Us</h2>
          <p>For questions, concerns, or requests about this Privacy Policy or your personal data, contact us at:</p>
          <div className="policy-info-grid" style={{ marginTop: '0.75rem' }}>
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
          <p>Questions about your data? <Link to="/contact">Contact us →</Link></p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
