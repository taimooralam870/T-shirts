import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageCircle, Mail, Phone, Clock, CheckCircle, Send, 
  ChevronDown, ChevronUp, Search, Headphones, HelpCircle,
  Package, Truck, CreditCard, RefreshCw, Shield, MapPin
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from '../components/Button';
import './Support.css';

const Support = () => {
  const [activeTab, setActiveTab] = useState('contact'); // contact | faq
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    issueType: 'general'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    // Save to Supabase support_tickets table
    const { error } = await supabase.from('support_tickets').insert([{
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
      issue_type: formData.issueType,
      status: 'open'
    }]);

    setIsSubmitting(false);

    if (!error) {
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        issueType: 'general'
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } else {
      console.error('Support ticket error:', error);
    }
  };

  // FAQ Data
  const faqs = [
    {
      id: 1,
      category: 'Order & Delivery',
      icon: Package,
      question: 'How long does delivery take?',
      answer: 'Standard delivery takes 3-5 business days for major cities (Karachi, Lahore, Islamabad) and 5-7 business days for other cities. We offer free shipping on all orders across Pakistan.'
    },
    {
      id: 2,
      category: 'Order & Delivery',
      icon: Truck,
      question: 'Can I track my order?',
      answer: 'Yes! Once your order is shipped, you will receive a tracking number via email and SMS. You can also track your order using your Order ID on our Track Order page.'
    },
    {
      id: 3,
      category: 'Order & Delivery',
      icon: MapPin,
      question: 'Do you deliver to my city?',
      answer: 'We deliver to all major cities and towns across Pakistan including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, and many more.'
    },
    {
      id: 4,
      category: 'Payment',
      icon: CreditCard,
      question: 'What payment methods do you accept?',
      answer: 'We accept Cash on Delivery (COD) and Bank Transfer. For COD, you pay when you receive your order. For bank transfer, account details will be provided after order placement.'
    },
    {
      id: 5,
      category: 'Payment',
      icon: Shield,
      question: 'Is Cash on Delivery available?',
      answer: 'Yes, COD is available for all cities across Pakistan. You can pay in cash when your order is delivered to your doorstep. No advance payment required.'
    },
    {
      id: 6,
      category: 'Returns & Refunds',
      icon: RefreshCw,
      question: 'What is your return policy?',
      answer: 'We offer a 7-day return policy. If you\'re not satisfied with your purchase, you can return it within 7 days of delivery. Product must be unused, unwashed, and in original packaging with tags attached.'
    },
    {
      id: 7,
      category: 'Returns & Refunds',
      icon: RefreshCw,
      question: 'How do I return an item?',
      answer: 'Contact our support team with your Order ID and reason for return. We will arrange a pickup or provide return instructions. Refund will be processed within 7-10 business days after receiving the returned item.'
    },
    {
      id: 8,
      category: 'Returns & Refunds',
      icon: CreditCard,
      question: 'When will I get my refund?',
      answer: 'Refunds are processed within 7-10 business days after we receive your returned item. The amount will be credited to your original payment method or bank account.'
    },
    {
      id: 9,
      category: 'Products',
      icon: Package,
      question: 'How do I choose the right size?',
      answer: 'Please refer to our Size Guide page for detailed measurements. We provide chest, length, and shoulder measurements for all sizes (S, M, L, XL, XXL). If you\'re between sizes, we recommend sizing up.'
    },
    {
      id: 10,
      category: 'Products',
      icon: Package,
      question: 'Are the colors accurate?',
      answer: 'We try our best to display accurate colors, but slight variations may occur due to screen settings and lighting. If the actual color differs significantly from the product photo, you can return it.'
    },
    {
      id: 11,
      category: 'Products',
      icon: Package,
      question: 'What material are the t-shirts made of?',
      answer: 'Most of our t-shirts are made from 100% premium cotton or cotton-blend fabric. Material details are mentioned on each product page. All fabrics are breathable, comfortable, and durable.'
    },
    {
      id: 12,
      category: 'Account',
      icon: HelpCircle,
      question: 'Do I need an account to place an order?',
      answer: 'No, you don\'t need to create an account. You can checkout as a guest. However, creating an account helps you track orders, save addresses, and get exclusive offers.'
    },
    {
      id: 13,
      category: 'Account',
      icon: HelpCircle,
      question: 'How do I track my order without an account?',
      answer: 'Visit our Track Order page and enter your Order ID and email address. You will see your order status, shipping details, and estimated delivery date.'
    },
    {
      id: 14,
      category: 'Other',
      icon: HelpCircle,
      question: 'Do you offer gift wrapping?',
      answer: 'Yes! You can request gift wrapping in the Order Notes field during checkout. We will carefully wrap your order at no extra cost.'
    },
    {
      id: 15,
      category: 'Other',
      icon: HelpCircle,
      question: 'Can I cancel or modify my order?',
      answer: 'Yes, you can cancel or modify your order within 2 hours of placement. Contact our support team immediately with your Order ID. Once shipped, orders cannot be cancelled.'
    }
  ];

  const issueTypes = [
    { value: 'general', label: 'General Inquiry', icon: HelpCircle },
    { value: 'order', label: 'Order Issue', icon: Package },
    { value: 'delivery', label: 'Delivery Problem', icon: Truck },
    { value: 'payment', label: 'Payment Issue', icon: CreditCard },
    { value: 'return', label: 'Return/Refund', icon: RefreshCw },
    { value: 'product', label: 'Product Quality', icon: Shield }
  ];

  const filteredFaqs = searchQuery
    ? faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  const faqsByCategory = filteredFaqs.reduce((acc, faq) => {
    if (!acc[faq.category]) acc[faq.category] = [];
    acc[faq.category].push(faq);
    return acc;
  }, {});

  return (
    <div className="support-page section container">
      <div className="support-header text-center mb-5">
        <div className="support-icon-circle">
          <Headphones size={48} />
        </div>
        <h1>Customer Support</h1>
        <p className="text-muted">
          We're here to help! Get answers to your questions or reach out to our team.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="support-stats">
        <div className="support-stat-card">
          <Clock size={24} />
          <div>
            <h3>Response Time</h3>
            <p>Within 2-4 hours</p>
          </div>
        </div>
        <div className="support-stat-card">
          <MessageCircle size={24} />
          <div>
            <h3>24/7 Support</h3>
            <p>Always available</p>
          </div>
        </div>
        <div className="support-stat-card">
          <Headphones size={24} />
          <div>
            <h3>Happy Customers</h3>
            <p>98% satisfaction rate</p>
          </div>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="contact-methods mb-5">
        <h2 className="text-center mb-4">Get in Touch</h2>
        <div className="contact-cards">
          <div className="contact-card">
            <Mail size={32} />
            <h3>Email Us</h3>
            <p>support@tshirtsstore.pk</p>
            <span className="contact-response">Response within 2-4 hours</span>
          </div>
          <div className="contact-card">
            <Phone size={32} />
            <h3>Call Us</h3>
            <p>+92 300 1234567</p>
            <span className="contact-response">Mon-Sat, 9 AM - 8 PM</span>
          </div>
          <div className="contact-card">
            <MessageCircle size={32} />
            <h3>WhatsApp</h3>
            <p>+92 300 1234567</p>
            <span className="contact-response">Quick replies</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="support-tabs">
        <button
          className={`support-tab ${activeTab === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          <Send size={18} />
          Send Message
        </button>
        <button
          className={`support-tab ${activeTab === 'faq' ? 'active' : ''}`}
          onClick={() => setActiveTab('faq')}
        >
          <HelpCircle size={18} />
          FAQs
        </button>
      </div>

      {/* Contact Form */}
      {activeTab === 'contact' && (
        <div className="support-content">
          {submitSuccess && (
            <div className="success-alert">
              <CheckCircle size={20} />
              <div>
                <strong>Message Sent Successfully!</strong>
                <p>Our team will contact you within 2-4 hours. Check your email for updates.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="support-form">
            <div className="form-section">
              <h3>Your Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'error' : ''}
                    placeholder="Enter your name"
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="your@email.com"
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'error' : ''}
                  placeholder="03XX-XXXXXXX"
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>
            </div>

            <div className="form-section">
              <h3>Issue Type</h3>
              <div className="issue-type-grid">
                {issueTypes.map(type => {
                  const Icon = type.icon;
                  return (
                    <label
                      key={type.value}
                      className={`issue-type-option ${formData.issueType === type.value ? 'active' : ''}`}
                    >
                      <input
                        type="radio"
                        name="issueType"
                        value={type.value}
                        checked={formData.issueType === type.value}
                        onChange={handleChange}
                      />
                      <Icon size={20} />
                      <span>{type.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="form-section">
              <h3>Your Message</h3>
              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={errors.subject ? 'error' : ''}
                  placeholder="Brief description of your issue"
                />
                {errors.subject && <span className="error-text">{errors.subject}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={errors.message ? 'error' : ''}
                  placeholder="Please describe your issue in detail. Include your Order ID if applicable."
                  rows="6"
                />
                {errors.message && <span className="error-text">{errors.message}</span>}
              </div>
            </div>

            <Button type="submit" size="lg" disabled={isSubmitting} className="submit-btn">
              {isSubmitting ? 'Sending...' : 'Send Message'}
              <Send size={18} />
            </Button>
          </form>
        </div>
      )}

      {/* FAQs */}
      {activeTab === 'faq' && (
        <div className="support-content">
          <div className="faq-search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="faq-container">
            {Object.keys(faqsByCategory).length === 0 ? (
              <div className="no-results">
                <HelpCircle size={48} />
                <p>No FAQs found matching your search.</p>
              </div>
            ) : (
              Object.entries(faqsByCategory).map(([category, categoryFaqs]) => (
                <div key={category} className="faq-category">
                  <h3 className="faq-category-title">{category}</h3>
                  <div className="faq-list">
                    {categoryFaqs.map(faq => {
                      const Icon = faq.icon;
                      return (
                        <div
                          key={faq.id}
                          className={`faq-item ${expandedFaq === faq.id ? 'expanded' : ''}`}
                        >
                          <button
                            className="faq-question"
                            onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                          >
                            <div className="faq-q-content">
                              <Icon size={20} className="faq-icon" />
                              <span>{faq.question}</span>
                            </div>
                            {expandedFaq === faq.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>
                          {expandedFaq === faq.id && (
                            <div className="faq-answer">
                              <p>{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="faq-footer">
            <p>Still have questions?</p>
            <Button onClick={() => setActiveTab('contact')}>Contact Support</Button>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="support-quick-links">
        <h3>Quick Links</h3>
        <div className="quick-links-grid">
          <Link to="/track-order" className="quick-link">
            <Package size={20} />
            <span>Track Order</span>
          </Link>
          <Link to="/shipping-returns" className="quick-link">
            <Truck size={20} />
            <span>Shipping Info</span>
          </Link>
          <Link to="/size-guide" className="quick-link">
            <HelpCircle size={20} />
            <span>Size Guide</span>
          </Link>
          <Link to="/terms" className="quick-link">
            <Shield size={20} />
            <span>Terms of Service</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Support;
