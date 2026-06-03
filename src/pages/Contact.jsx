import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Button from '../components/Button';
import './Contact.css';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    e.target.reset();
  };

  return (
    <div className="contact-page section container">
      <div className="contact-header text-center mb-4">
        <h1>Contact Us</h1>
        <p className="text-muted mt-2">Have a question or feedback? We'd love to hear from you.</p>
      </div>

      <div className="contact-grid">
        {/* Contact Form */}
        <div className="contact-form-container">
          <h2>Send a Message</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" required placeholder="John Doe" />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" required placeholder="john@example.com" />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" required placeholder="How can we help?" />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" rows="5" required placeholder="Your message here..."></textarea>
            </div>

            <Button type="submit" size="lg" className="w-full">Send Message</Button>
          </form>
        </div>

        {/* Contact Info & Map */}
        <div className="contact-info-container">
          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon"><MapPin /></div>
              <div>
                <h3>Our Store</h3>
                <p className="text-muted">Lahore<br />Imtiaz markeet <br />Pakistan</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon"><Phone /></div>
              <div>
                <h3>Phone</h3>
                <p className="text-muted">+923175992862<br />Mon-Fri, 9am-6pm EST</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon"><Mail /></div>
              <div>
                <h3>Email</h3>
                <p className="text-muted">support@Mentastic.com<br />taimooralam870@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="map-placeholder">
            <div className="map-embed">
              {/* Note: In a real app, you would use an iframe from Google Maps or a map component */}
              <div className="map-dummy-content">
                <MapPin size={48} className="text-accent mb-2" />
                <p>Interactive Map View</p>
                <span className="text-sm text-muted">lahor Imtiaz Markeet Pakistan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
