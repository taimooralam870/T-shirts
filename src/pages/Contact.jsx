import { MapPin, Phone, Mail, MessageSquare, Clock, ArrowRight } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you within 24 hours.');
    e.target.reset();
  };

  return (
    <div className="contact-page page-fade">

      {/* ── Hero ── */}
      <div className="contact-hero">
        <div className="container">
          <span className="section-label">
            <MessageSquare size={12} /> Contact
          </span>
          <h1 className="contact-hero-title">We're here<br />to help.</h1>
          <p className="contact-hero-sub">
            Questions, feedback, or just want to say hi — drop us a message and we'll get back to you within 24 hours.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="contact-layout">

          {/* ── Form ── */}
          <div className="contact-form-card">
            <h2 className="contact-form-title">Send a Message</h2>
            <p className="contact-form-sub">Fill in the form below and we'll respond promptly.</p>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form-row">
                <div className="cfield">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" required placeholder="John Doe" />
                </div>
                <div className="cfield">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" required placeholder="you@example.com" />
                </div>
              </div>

              <div className="cfield">
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" required placeholder="How can we help you?" />
              </div>

              <div className="cfield">
                <label htmlFor="message">Message</label>
                <textarea id="message" rows="5" required placeholder="Tell us more..."></textarea>
              </div>

              <button type="submit" className="contact-submit-btn">
                Send Message <ArrowRight size={16} />
              </button>
            </form>
          </div>

          {/* ── Info ── */}
          <div className="contact-info-panel">
            <div className="contact-info-card">
              <div className="contact-info-icon">
                <MapPin size={20} />
              </div>
              <div>
                <h3>Our Location</h3>
                <p>Shop #12, Imtiaz Market<br />Main Boulevard, Gulberg III<br />Lahore, Punjab 54000<br />Pakistan</p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">
                <Phone size={20} />
              </div>
              <div>
                <h3>Call Us</h3>
                <p>+92 317 5992862</p>
                <p>+92 321 4567890</p>
                <span>Available Mon – Sat, 10am – 8pm PKT</span>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">
                <Mail size={20} />
              </div>
              <div>
                <h3>Email Support</h3>
                <p>support@mentastic.com</p>
                <p>orders@mentastic.com</p>
                <span>Response time: Within 12-24 hours</span>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">
                <Clock size={20} />
              </div>
              <div>
                <h3>Store Hours</h3>
                <p>Monday – Saturday: 10 AM – 8 PM</p>
                <p>Sunday: 12 PM – 6 PM</p>
                <span>Public holidays may vary</span>
              </div>
            </div>

            {/* Map */}
            <div className="contact-map">
              <div className="contact-map-inner">
                <MapPin size={28} />
                <p>Visit Our Store</p>
                <span>Gulberg III, Lahore</span>
                <span style={{ fontSize: '0.7rem', marginTop: '0.25rem' }}>Parking available nearby</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
