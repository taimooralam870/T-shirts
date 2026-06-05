import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            {/* Brand */}
            <div className="footer-brand">
              <Link to="/" className="footer-logo">Mentastic</Link>
              <p className="footer-tagline">
                Premium quality tees crafted for everyday comfort. Made for those who care about what they wear.
              </p>
              <div className="footer-social">
                <a href="#" className="social-icon" aria-label="Facebook">
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href="#" className="social-icon" aria-label="Instagram">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                <a href="#" className="social-icon" aria-label="Twitter/X">
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-col">
              <h4 className="footer-heading">Shop</h4>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/shop">All Products</Link></li>
                <li><Link to="/shop?category=Men">Men's</Link></li>
                <li><Link to="/shop?category=Women">Women's</Link></li>
                <li><Link to="/shop?category=Unisex">Unisex</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div className="footer-col">
              <h4 className="footer-heading">Support</h4>
              <ul className="footer-links">
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/track-order">Track Order</Link></li>
                <li><Link to="/shipping-returns">Shipping & Returns</Link></li>
                <li><Link to="/size-guide">Size Guide</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="footer-col">
              <h4 className="footer-heading">Get in Touch</h4>
              <ul className="footer-contact">
                <li>
                  <MapPin size={14} />
                  <span>Imtiaz Market, Lahore, Pakistan</span>
                </li>
                <li>
                  <Phone size={14} />
                  <span>+92 317 5992862</span>
                </li>
                <li>
                  <Mail size={14} />
                  <span>support@mentastic.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-inner">
            <p className="footer-copyright">
              © {new Date().getFullYear()} Mentastic. All rights reserved.
            </p>
            <div className="footer-legal">
              <Link to="/privacy-policy">Privacy</Link>
              <span className="footer-separator"></span>
              <Link to="/terms-of-service">Terms</Link>
              <span className="footer-separator"></span>
              <Link to="/shipping-returns">Shipping</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
