import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import './PolicyPages.css';
import './FAQ.css';

const faqs = [
  {
    category: 'Orders & Checkout',
    items: [
      {
        q: 'How do I place an order?',
        a: 'Browse our shop, select your desired product and size, add to cart, and proceed to checkout. Fill in your delivery details, choose a payment method (COD or Bank Transfer), and confirm your order. You\'ll receive a confirmation via email and SMS.',
      },
      {
        q: 'Can I modify or cancel my order after placing it?',
        a: 'Yes! You can cancel or modify your order within 2 hours of placing it. Contact us immediately at support@mentastic.com or call +92 317 5992862. Once the order is dispatched, modifications are not possible.',
      },
      {
        q: 'Will I receive an order confirmation?',
        a: 'Absolutely! You\'ll receive an order confirmation via email and SMS immediately after placing your order. This includes your order number, items ordered, and estimated delivery date.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept Cash on Delivery (COD) across Pakistan and Bank Transfer. For bank transfers, order details will be sent via email. Online card payments are coming soon!',
      },
      {
        q: 'Do you offer bulk or wholesale orders?',
        a: 'Yes! For bulk orders (10+ items), please contact us at orders@mentastic.com for special pricing and customization options.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    items: [
      {
        q: 'How long does delivery take?',
        a: 'Standard delivery takes 5–7 business days across Pakistan. Express delivery (2–3 business days) is available for major cities for an additional Rs. 400. Orders placed before 2 PM are dispatched the same day.',
      },
      {
        q: 'Is there free shipping?',
        a: 'Yes! Orders above Rs. 3,000 qualify for FREE standard shipping anywhere in Pakistan. For orders below Rs. 3,000, standard shipping costs Rs. 200.',
      },
      {
        q: 'Which cities do you deliver to?',
        a: 'We deliver to all major cities in Pakistan including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, and more. Remote areas may take 1-2 additional days.',
      },
      {
        q: 'Do you deliver outside Pakistan?',
        a: 'Currently we deliver within Pakistan only. International shipping to USA, UK, UAE, and Canada is coming soon! Stay tuned.',
      },
      {
        q: 'How do I track my order?',
        a: 'Once your order is dispatched, you\'ll receive a tracking number via SMS and email. Visit our Track Order page and enter your tracking number to see real-time delivery status.',
      },
      {
        q: 'What if I\'m not available at delivery time?',
        a: 'Our courier partner will attempt delivery 2-3 times. If unavailable, they\'ll leave a contact card. You can also reschedule delivery by calling the courier directly.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    items: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 14-day hassle-free return policy from the date of delivery. Items must be unworn, unwashed, with original tags attached, and in original packaging. We want you to be 100% satisfied with your purchase!',
      },
      {
        q: 'How do I initiate a return?',
        a: 'Email us at support@mentastic.com with your Order ID, reason for return, and photos of the item (if defective). We\'ll send you a return shipping label and instructions within 24 hours.',
      },
      {
        q: 'When will I receive my refund?',
        a: 'Refunds are processed within 3–5 business days after we receive and inspect the returned item. The amount will be credited back to your original payment method or as store credit.',
      },
      {
        q: 'Who pays for return shipping?',
        a: 'For defective or incorrect items, we cover return shipping costs. For change of mind returns, customers cover the return shipping fee (Rs. 200).',
      },
      {
        q: 'Are sale items returnable?',
        a: 'Sale items (marked 20% off or more) and customized/personalized products are final sale and non-refundable. All other items can be returned within our standard policy.',
      },
      {
        q: 'Can I exchange instead of returning?',
        a: 'Yes! If you need a different size or color, we offer free exchanges. Just mention "exchange" when initiating your return and specify what you\'d like instead.',
      },
    ],
  },
  {
    category: 'Products & Quality',
    items: [
      {
        q: 'How do I find the right size?',
        a: (
          <>
            Check our detailed <Link to="/size-guide">Size Guide</Link> for accurate chest, waist, and length measurements for both men and women. Still unsure? Contact us and we'll help you choose the perfect fit!
          </>
        ),
      },
      {
        q: 'What fabric are your t-shirts made of?',
        a: 'Our t-shirts are made from premium 100% combed cotton (180 GSM) for ultimate comfort, breathability, and durability. The fabric is pre-shrunk and soft on skin, perfect for daily wear.',
      },
      {
        q: 'How should I care for my t-shirt?',
        a: 'Machine wash cold (30°C) with similar colors. Do not bleach. Tumble dry on low heat or hang dry. Iron on low/medium heat if needed, inside out to protect prints. Avoid harsh detergents to maintain print quality.',
      },
      {
        q: 'Will the print fade or crack?',
        a: 'Our prints use high-quality screen printing and DTG (Direct-to-Garment) technology designed to last 50+ washes when cared for properly. Follow wash instructions for best longevity.',
      },
      {
        q: 'Are your t-shirts unisex?',
        a: 'Yes! Most of our designs are unisex and available in both men\'s and women\'s fits. Product pages specify the fit style.',
      },
      {
        q: 'Do you offer gift wrapping?',
        a: 'Yes! Add gift wrapping at checkout for Rs. 100. We\'ll include a premium gift box and a personalized note card with your message.',
      },
    ],
  },
  {
    category: 'Payment & Security',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept Cash on Delivery (COD) across Pakistan and direct Bank Transfer to HBL, Meezan Bank, or JazzCash/EasyPaisa. Online card payment gateway is coming soon!',
      },
      {
        q: 'Is Cash on Delivery (COD) available everywhere?',
        a: 'Yes! COD is available in all cities we deliver to. Just pay in cash when your order arrives at your doorstep. Make sure to have exact change if possible.',
      },
      {
        q: 'Is it safe to shop on your website?',
        a: 'Absolutely! Our website uses secure SSL encryption. We never store sensitive payment information. Your personal data is protected as per our Privacy Policy.',
      },
      {
        q: 'Can I get an invoice for my order?',
        a: 'Yes! An invoice is automatically generated and emailed to you after your order is placed. You can also request a physical invoice with your delivery.',
      },
    ],
  },
  {
    category: 'Account & Membership',
    items: [
      {
        q: 'Do I need to create an account to place an order?',
        a: 'No, you can checkout as a guest. However, creating an account lets you track orders, save addresses, view order history, and get exclusive member discounts.',
      },
      {
        q: 'How do I reset my password?',
        a: 'Click "Forgot Password" on the login page and enter your email. We\'ll send you a password reset link within minutes.',
      },
      {
        q: 'Do you have a loyalty program?',
        a: 'Yes! Join our Mentastic VIP Club and earn points on every purchase. Redeem points for discounts, early access to new designs, and birthday surprises!',
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
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && <div className="faq-answer">{a}</div>}
    </div>
  );
};

const FAQ = () => {
  return (
    <div className="policy-page">
      {/* Hero */}
      <div className="policy-hero-banner">
        <div className="container">
          <div className="policy-breadcrumb">
            <Link to="/">Home</Link> / <span>FAQ</span>
          </div>
          <div className="policy-hero-icon"><HelpCircle size={24} /></div>
          <h1>Frequently Asked Questions</h1>
          <p>Quick answers to the most common questions about orders, shipping, and returns.</p>
        </div>
      </div>

      <div className="container">
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
    </div>
  );
};

export default FAQ;
