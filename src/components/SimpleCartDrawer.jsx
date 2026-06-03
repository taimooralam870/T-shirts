import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import './SimpleCartDrawer.css';

const SimpleCartDrawer = () => {
  const {
    isCartDrawerOpen,
    closeCartDrawer,
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
    addToCart,
  } = useCart();

  const { products } = useProducts();
  const sliderRef = useRef(null);

  // Recommended: products NOT already in cart (max 6)
  const cartIds = cartItems.map(i => i.id);
  const recommended = (products || [])
    .filter(p => !cartIds.includes(p.id))
    .slice(0, 6);

  // Savings: sum of (originalPrice - price) * qty for items that have originalPrice
  const totalSavings = cartItems.reduce((acc, item) => {
    if (item.originalPrice && item.originalPrice > item.price) {
      acc += (item.originalPrice - item.price) * item.quantity;
    }
    return acc;
  }, 0);

  const freeShippingThreshold = 3000;
  const remaining = freeShippingThreshold - cartTotal;

  const scrollSlider = (dir) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: dir * 220, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`scd-overlay ${isCartDrawerOpen ? 'show' : ''}`}
        onClick={closeCartDrawer}
      />

      {/* Drawer */}
      <div className={`scd-drawer ${isCartDrawerOpen ? 'open' : ''}`}>

        {/* ── Header ── */}
        <div className="scd-header">
          <div className="scd-header-left">
            <ShoppingBag size={20} />
            <span>Your Cart</span>
            {cartCount > 0 && <span className="scd-count-badge">{cartCount}</span>}
          </div>
          <button className="scd-close" onClick={closeCartDrawer} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* ── Savings Banner ── */}
        {totalSavings > 0 && (
          <div className="scd-savings-banner">
            🎉 <strong>Congrats!</strong> You're saving <strong>Rs. {totalSavings.toLocaleString()}</strong> on this order
          </div>
        )}

        {/* ── Free Shipping Progress ── */}
        {cartTotal > 0 && (
          <div className="scd-shipping-bar">
            {remaining > 0 ? (
              <>
                <p>Add <strong>Rs. {remaining.toLocaleString()}</strong> more for <strong>Free Shipping</strong></p>
                <div className="scd-progress-track">
                  <div
                    className="scd-progress-fill"
                    style={{ width: `${Math.min((cartTotal / freeShippingThreshold) * 100, 100)}%` }}
                  />
                </div>
              </>
            ) : (
              <p className="scd-free-unlocked">🚚 You've unlocked <strong>Free Shipping!</strong></p>
            )}
          </div>
        )}

        {/* ── Cart Items ── */}
        <div className="scd-items">
          {cartItems.length === 0 ? (
            <div className="scd-empty">
              <ShoppingBag size={48} strokeWidth={1.2} />
              <p>Your cart is empty</p>
              <button onClick={closeCartDrawer} className="scd-continue-btn">Continue Shopping</button>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={`${item.id}-${item.selectedSize}`} className="scd-item">
                <div className="scd-item-img-wrap">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="scd-item-body">
                  <div className="scd-item-top">
                    <p className="scd-item-name">{item.name}</p>
                    <button
                      className="scd-item-remove"
                      onClick={() => removeFromCart(item.id, item.selectedSize)}
                      aria-label="Remove item"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <p className="scd-item-size">Size: <strong>{item.selectedSize}</strong></p>
                  <div className="scd-item-bottom">
                    <div className="scd-qty">
                      <button
                        onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <div className="scd-item-price-wrap">
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="scd-item-original">
                          Rs. {(item.originalPrice * item.quantity).toLocaleString()}
                        </span>
                      )}
                      <span className="scd-item-price">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Recommended Products ── */}
        {recommended.length > 0 && (
          <div className="scd-recommended">
            <div className="scd-rec-header">
              <span>You might also like</span>
              <div className="scd-rec-nav">
                <button onClick={() => scrollSlider(-1)} aria-label="Scroll left"><ChevronLeft size={16} /></button>
                <button onClick={() => scrollSlider(1)} aria-label="Scroll right"><ChevronRight size={16} /></button>
              </div>
            </div>
            <div className="scd-rec-slider" ref={sliderRef}>
              {recommended.map(product => (
                <div key={product.id} className="scd-rec-card">
                  <img src={product.image} alt={product.name} />
                  <div className="scd-rec-info">
                    <p className="scd-rec-name">{product.name}</p>
                    <p className="scd-rec-price">Rs. {product.price.toLocaleString()}</p>
                    <button
                      className="scd-rec-add"
                      onClick={() => addToCart(product, 1, product.sizes?.[0] || 'M')}
                    >
                      Add +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        {cartItems.length > 0 && (
          <div className="scd-footer">
            <div className="scd-subtotal-row">
              <span>Subtotal <span className="scd-item-count">({cartCount} {cartCount === 1 ? 'item' : 'items'})</span></span>
              <div className="scd-subtotal-right">
                {totalSavings > 0 && (
                  <span className="scd-original-total">
                    Rs. {(cartTotal + totalSavings).toLocaleString()}
                  </span>
                )}
                <span className="scd-subtotal-amount">Rs. {cartTotal.toLocaleString()}</span>
                {totalSavings > 0 && (
                  <span className="scd-savings-tag">Rs. {totalSavings.toLocaleString()} OFF</span>
                )}
              </div>
            </div>

            <Link to="/checkout" className="scd-checkout-btn" onClick={closeCartDrawer}>
              PROCEED TO CHECKOUT <span>›</span>
            </Link>

            <p className="scd-guarantee">✓ &nbsp;Hassle-Free 14-Day Returns</p>
          </div>
        )}
      </div>
    </>
  );
};

export default SimpleCartDrawer;
