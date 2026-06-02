import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Truck, Shield, ArrowLeft, Zap, Eye, CheckCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import productsData from '../data/products.json';
// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/effect-fade';

import './ProductDetail.css';

// Simple Accordion Component
const AccordionItem = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="accordion-item">
      <button className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <span className="font-semibold">{title}</span>
        {isOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
      </button>
      <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
        <div className="accordion-inner">{children}</div>
      </div>
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [liveViewers, setLiveViewers] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  
  // Urgency Timer State
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 29, seconds: 59 });

  // Sticky Cart State
  const [showStickyCart, setShowStickyCart] = useState(false);
  const mainCartAreaRef = useRef(null);

  useEffect(() => {
    const foundProduct = productsData.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedSize(foundProduct.sizes[0]);
      
      // Find related products - first try category, then fallback to popular
      let related = productsData
        .filter(p => p.category === foundProduct.category && p.id !== id)
        .slice(0, 4);
      
      // If not enough related products, add popular ones
      if (related.length < 4) {
        const popularProducts = productsData
          .filter(p => p.isPopular && p.id !== id && !related.find(r => r.id === p.id))
          .slice(0, 4 - related.length);
        related = [...related, ...popularProducts];
      }
      
      setRelatedProducts(related);
      
      // Randomize live viewers for CRO effect
      setLiveViewers(Math.floor(Math.random() * 25) + 12);

      window.scrollTo(0, 0);
    } else {
      navigate('/shop');
    }
  }, [id, navigate]);

  // Countdown timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 4, minutes: 29, seconds: 59 }; // reset for demo
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Scroll listener for sticky cart
  useEffect(() => {
    const handleScroll = () => {
      if (mainCartAreaRef.current) {
        const rect = mainCartAreaRef.current.getBoundingClientRect();
        // Show sticky bar when main add to cart button is scrolled out of view (above viewport)
        setShowStickyCart(rect.bottom < 0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize);
    // Vibrate or show toast for feedback (simulated)
    if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="product-detail-page section container">
      <Link to="/shop" className="back-link mb-6 flex items-center gap-2">
        <ArrowLeft size={16} /> Back to Collection
      </Link>

      <div className="product-detail-grid">
        {/* Images Gallery with High-End Swiper */}
        <div className="product-gallery">
          <div className="main-image-container relative">
            <Swiper
              style={{
                '--swiper-navigation-color': '#111827',
                '--swiper-pagination-color': '#111827',
              }}
              spaceBetween={10}
              navigation={true}
              pagination={{ clickable: true, dynamicBullets: true }}
              effect={'fade'}
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              modules={[EffectFade, Navigation, Pagination, Thumbs, Autoplay]}
              className="main-swiper"
              autoplay={{ delay: 5000, disableOnInteraction: true }}
            >
              <SwiperSlide>
                <img src={product.image} alt={product.name} className="main-image" />
              </SwiperSlide>
              <SwiperSlide>
                <img src={product.image} alt={`${product.name} alternate view 1`} className="main-image" style={{ filter: 'brightness(1.05) contrast(1.05)' }} />
              </SwiperSlide>
              <SwiperSlide>
                <img src={product.image} alt={`${product.name} alternate view 2`} className="main-image" style={{ filter: 'grayscale(10%)' }} />
              </SwiperSlide>
            </Swiper>
            
            {discountPercentage > 0 && (
              <span className="sales-badge-large z-10">Save {discountPercentage}%</span>
            )}
          </div>
          
          <div className="thumbnail-list-container">
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={12}
              slidesPerView={4}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[Thumbs]}
              className="thumbs-swiper"
            >
              <SwiperSlide className="thumbnail-slide">
                <img src={product.image} alt="thumbnail 1" />
              </SwiperSlide>
              <SwiperSlide className="thumbnail-slide">
                <img src={product.image} alt="thumbnail 2" style={{ filter: 'brightness(1.05) contrast(1.05)' }} />
              </SwiperSlide>
              <SwiperSlide className="thumbnail-slide">
                <img src={product.image} alt="thumbnail 3" style={{ filter: 'grayscale(10%)' }} />
              </SwiperSlide>
            </Swiper>
          </div>
        </div>

        {/* Product Info - CRO Optimized */}
        <div className="product-info-container">
          {/* Social Proof Bar */}
          <div className="product-meta-bar">
            <div className="live-view-badge">
              <Eye size={16} className="pulse-icon text-accent" />
              <span><strong>{liveViewers}</strong> people are viewing this right now</span>
            </div>
            <span className="product-category-pill">{product.category}</span>
          </div>

          <h1 className="product-title-huge">{product.name}</h1>
          
          <div className="product-rating-cro mb-4 cursor-pointer hover-opacity">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill={i < Math.floor(product.rating) ? '#fbbf24' : 'transparent'} color={i < Math.floor(product.rating) ? '#fbbf24' : '#d1d5db'} />
              ))}
            </div>
            <span className="font-semibold text-gray-800">{product.rating}</span>
            <span className="text-gray-500 underline ml-1">({product.reviews} customer reviews)</span>
          </div>

          <div className="product-pricing-cro">
            <span className="price-current">Rs. {product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <>
                <span className="price-original">Rs. {product.originalPrice.toLocaleString()}</span>
                <span className="price-savings">You save Rs. {(product.originalPrice - product.price).toLocaleString()}</span>
              </>
            )}
          </div>
          
          {/* Urgency Timer */}
          <div className="urgency-banner">
            <div className="urgency-icon">
              <Clock size={22} className="text-danger" />
            </div>
            <div className="urgency-text">
              <p className="font-semibold text-gray-900">Order within <span className="text-danger">{String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s</span></p>
              <p className="text-sm text-gray-600">for dispatch today and next-day delivery.</p>
            </div>
          </div>
          
          <p className="product-description-premium">{product.description}</p>

          {/* Scarcity Indicator */}
          {product.stock && product.stock <= 10 && (
            <div className="stock-urgency-clean">
              <Zap size={18} className="text-danger" />
              <span>High demand! Only <strong>{product.stock} left</strong> in stock.</span>
            </div>
          )}

          {/* Size Selector */}
          <div className="size-selector-container">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-lg">Select Size</h4>
              <button className="size-guide-link">Size Guide</button>
            </div>
            <div className="size-options">
              {product.sizes.map(s => (
                <button
                  key={s}
                  className={`size-btn-premium ${selectedSize === s ? 'active' : ''}`}
                  onClick={() => setSelectedSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Main Add to Cart Block */}
          <div className="cart-actions-premium" ref={mainCartAreaRef}>
            <div className="quantity-selector-premium">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="qty-btn">-</button>
              <span className="qty-value">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="qty-btn">+</button>
            </div>
            <button className="add-to-cart-massive" onClick={handleAddToCart}>
              <span>Add to Cart</span>
              <span className="cart-btn-price">— Rs. {(product.price * quantity).toLocaleString()}</span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="trust-badges-premium">
            <div className="trust-stamp">
              <CheckCircle size={22} className="text-gray-700" />
              <span>Authentic Quality</span>
            </div>
            <div className="trust-stamp">
              <Shield size={22} className="text-gray-700" />
              <span>Secure Checkout</span>
            </div>
            <div className="trust-stamp">
              <Truck size={22} className="text-gray-700" />
              <span>Fast Delivery</span>
            </div>
          </div>

          {/* Accordions for Details */}
          <div className="product-accordions">
            <AccordionItem title="Product Details & Materials" defaultOpen={true}>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>100% Premium Cotton</li>
                <li>Breathable, moisture-wicking fabric</li>
                <li>Tailored fit for a modern look</li>
                <li>Pre-shrunk to maintain size</li>
              </ul>
            </AccordionItem>
            <AccordionItem title="Shipping & Returns">
              <p className="text-gray-600 mb-2"><strong>Free Nationwide Shipping</strong> on orders over Rs. 3000.</p>
              <p className="text-gray-600">We offer a 14-day hassle-free return policy. If you are not completely satisfied, simply return the item in its original condition.</p>
            </AccordionItem>
            <AccordionItem title="Care Instructions">
              <p className="text-gray-600">Machine wash cold inside out with like colors. Tumble dry low. Do not iron decoration.</p>
            </AccordionItem>
          </div>

        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="related-products mt-12 pt-10 border-t border-gray-100">
          <h2 className="section-title text-center mb-8 text-3xl font-bold">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(rp => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </div>
      )}

      {/* Sticky Cart Bar (Desktop/Mobile) */}
      <div className={`sticky-cart-bar ${showStickyCart ? 'visible' : ''}`}>
        <div className="container sticky-cart-inner">
          <div className="sticky-product-info">
            <img src={product.image} alt={product.name} className="sticky-img" />
            <div className="sticky-details">
              <h4 className="sticky-title">{product.name}</h4>
              <span className="sticky-price">Rs. {product.price.toLocaleString()}</span>
            </div>
          </div>
          <div className="sticky-actions">
            <button className="add-to-cart-massive compact" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProductDetail;
