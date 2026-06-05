import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import './Home.css';

const Home = () => {
  const { products, loading } = useProducts();

  return (
    <div className="home-page">
      {/* Premium Immersive Hero */}
      <section className="hero-premium">
        {/* Dynamic Background */}
        <div className="hero-premium-bg">
          <img 
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2000" 
            alt="Premium Fashion" 
            className="hero-premium-image"
          />
          <div className="hero-premium-overlay"></div>
        </div>

        {/* Glassmorphism Content */}
        <div className="hero-premium-content glass-panel">
          <span className="premium-eyebrow">New Collection 2026</span>
          <h1 className="premium-title">Elevate Your<br/>Everyday.</h1>
          <p className="premium-subtitle">
            Discover garments crafted with uncompromising precision and the world's finest materials.
          </p>
          <div className="premium-actions">
            <Link to="/shop" className="btn-premium-primary">
              Shop Now <span className="arrow">→</span>
            </Link>
            <Link to="/shop" className="btn-premium-secondary">
              Explore Lookbook
            </Link>
          </div>
        </div>
      </section>

      {/* Massive Product Grid */}
      <section className="section-minimal">
        <div className="container-fluid">
          <div className="minimal-header">
            <h2 className="minimal-title">New Arrivals</h2>
            <Link to="/shop" className="minimal-link">View All</Link>
          </div>
          
          {loading ? (
            <div className="loading-spinner">Loading...</div>
          ) : (
            <div className="modern-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Edge-to-Edge Category Banners */}
      <section className="category-split">
        <Link to="/shop?category=Men" className="split-pane">
          <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=1200" alt="Men" />
          <div className="split-overlay">
            <h2>MENSWEAR</h2>
            <span className="split-overlay-btn">Shop Now →</span>
          </div>
        </Link>
        <Link to="/shop?category=Women" className="split-pane">
          <img src="https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&q=80&w=1200" alt="Women" />
          <div className="split-overlay">
            <h2>WOMENSWEAR</h2>
            <span className="split-overlay-btn">Shop Now →</span>
          </div>
        </Link>
      </section>

      <section className="minimal-cta">
        <h2>Stay in the loop.</h2>
        <p className="minimal-cta-sub">New drops, exclusive offers, and style tips — straight to your inbox.</p>
        <form className="minimal-subscribe" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="your@email.com" required />
          <button type="submit">→</button>
        </form>
      </section>
    </div>
  );
};

export default Home;
