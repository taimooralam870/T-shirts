import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import './PolicyPages.css';
import './FAQ.css';

const faqs = [
  {
    category: 'Orders',
    items: [
      {
        q: 'How do I place an order?',
        a: 'Browse our shop, select your size and quantity, add to cart, and proceed to checkout. Fill in your delivery details and confirm your order.',
      },
      {
        q: 'Can I modify or cancel my order after placing it?',
        a: 'You can cancel or modify your order within 2 hours of placing it. Contact us at taimooralam870@gmail.com or call +923175992862 as soon as possible.',
      },
      {
        q: 'Will I receive an order confirmation?',
        a: 'Yes, an order confirmation is sent via email/SMS once your order is successfully placed.',
      },
    ],
  },
  {
    category: 'Shipping',
    items: [
      {
        q: 'How long does delivery take?',
        a: 'Standard delivery takes 5–7 business days. Express delivery is available in 2–3 business days for an additional Rs. 400.',
      },
      {
        q: 'Is there free shipping?',
        a: 'Yes! Orders above Rs. 3000 qualify for free standard shipping across Pakistan.',
      },
      {
        q: 'Do you deliver outside Pakistan?',
        a: 'Currently we deliver within Pakistan only. International shipping is coming soon.',
      },
      {
        q: 'How do I track my order?',
        a: 'Once your order is dispatched, you will receive a tracking number via SMS/email that you can use to track your delivery.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    items: [
      {
        q: 'What is your return policy?',
        a: 'We offer hassle-free returns within 14 days of delivery. Items must be unworn, unwashed, and in original packaging with tags attached.',
      },
      {
        q: 'How do I initiate a return?',
        a: 'Email us at taimooralam870@gmail.com with your Order ID and reason for return. We will guide you through the process.',
      },
      {
        q: 'When will I receive my refund?',
        a: 'Refunds are processed within 3–5 business days after we receive and inspect the returned item.',
      },
      {
        q: 'Are sale items returnable?',
        a: 'Sale items and customized/personalized products are non-refundable.',
      },
    ],
  },
  {
    category: 'Products',
    items: [
      {
        q: 'How do I find the right size?',
        a: (
          <>
            Check our detailed <Link to="/size-guide">Size Guide</Link> for chest, waist, and length measurements for both men and women.
          </>
        ),
      },
      {
        q: 'What fabric are your t-shirts made of?',
        a: 'Our t-shirts are made from high-quality 100% cotton for comfort and durability.',
      },
      {
        q: 'How should I wash my t-shirt?',
        a: 'Machine wash cold with similar colors. Do not bleach. Tumble dry low. Iron on low heat if needed.',
      },
    ],
  },
  {
    category: 'Payment',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept Cash on Delivery (COD) and Bank Transfer.',
      },
      {
        q: 'Is it safe to shop on your website?',
        a: 'Absolutely. Our website uses secure connections and we never store sensitive payment information.',
      },
    ],
  },
];

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button className="faq-question" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && <div className="faq-answer">{a}</div>}
    </div>
  );
};

const FAQ = () => {
  return (
    <div className="policy-page section container">
      <div className="policy-breadcrumb">
        <Link to="/">Home</Link> / <span>FAQ</span>
      </div>

      <div className="policy-hero">
        <HelpCircle size={40} />
        <h1>Frequently Asked Questions</h1>
        <p>Find quick answers to the most common questions.</p>
      </div>

      {faqs.map((group) => (
        <div className="policy-card faq-group" key={group.category}>
          <h2>{group.category}</h2>
          <div className="faq-list">
            {group.items.map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      ))}

      <div className="policy-contact-banner">
        <p>Didn't find your answer? <Link to="/contact">Contact us →</Link></p>
      </div>
    </div>
  );
};

export default FAQ;
