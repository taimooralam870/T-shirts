import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h3 className="footer-logo">MENTASTIC<span></span></h3>
            <p className="footer-text">
              Elevate your everyday style with our premium collection of comfortable and trendy t-shirts. Made for everyone.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon">FB</a>
              <a href="#" className="social-icon">TW</a>
              <a href="#" className="social-icon">IG</a>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shop">Shop All</Link></li>
              <li><Link to="/shop?category=Men">Men's Collection</Link></li>
              <li><Link to="/shop?category=Women">Women's Collection</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Customer Service</h4>
            <ul className="footer-links">
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/track-order">Track Order</Link></li>
              <li><Link to="/shipping-returns">Shipping &amp; Returns</Link></li>
              <li><Link to="/size-guide">Size Guide</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Contact Info</h4>
            <ul className="footer-contact">
              <li>
                <MapPin size={16} />
                <span>lahore Imtiaz Markeet Pakistan</span>
              </li>
              <li>
                <Phone size={16} />
                <span>+923175992862</span>
              </li>
              <li>
                <Mail size={16} />
                <span>taimooralam870@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Mentastic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
