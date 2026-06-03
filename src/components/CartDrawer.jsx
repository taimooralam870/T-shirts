import { X, ShoppingBag, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import productsData from '../data/products.json';
import Button from './Button';
import './CartDrawer.css';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, addToCart } = useCart();
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (isOpen && cartItems.length > 0) {
      const cartItemIds = new Set(cartItems.map(item => item.id));
      const cartCategories = new Set(cartItems.map(item => item.category));
      
      const recommended = productsData
        .filter(p => !cartItemIds.has(p.id) && cartCategories.has(p.category))
        .slice(0, 3);
      
      setSuggestions(recommended);
    }
  }, [isOpen, cartItems]);

  return (
    <>
      <div 
        className={`cart-drawer-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />

      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-drawer-header">
          <h2>
            <ShoppingBag size={24} />
            Shopping Cart
          </h2>
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
        </div>

        <div className="cart-drawer-content">
          {cartItems.length === 0 ? (
            <div className="cart-drawer-empty">
              <div className="empty-icon">
                <ShoppingBag size={48} />
              </div>
              <h3>Your cart is empty</h3>
              <p>Add items to get started</p>
            </div>
          ) : (
            <>
              <div className="cart-drawer-items">
                <div className="drawer-success-badge">
                  <Sparkles size={16} />
                  <span>Item added to cart!</span>
                </div>

                {cartItems.map(item => (
                  <div key={`${item.id}-${item.selectedSize}`} className="cart-drawer-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-details">
                      <Link 
                        to={`/product/${item.id}`} 
                        onClick={onClose}
                        className="item-name"
                      >
                        {item.name}
                      </Link>
                      <p className="item-size">Size: {item.selectedSize}</p>
                      <div className="item-bottom">
                        <div className="quantity-controls">
                          <button 
                            onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <p className="item-price">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                    <button 
                      className="item-remove"
                      onClick={() => removeFromCart(item.id, item.selectedSize)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}

                {suggestions.length > 0 && (
                  <div className="drawer-suggestions">
                    <div className="suggestions-header">
                      <Sparkles size={18} />
                      <h3>You May Also Like</h3>
                    </div>
                    <div className="suggestions-grid">
                      {suggestions.map(product => (
                        <div key={product.id} className="suggestion-card">
                          <Link to={`/product/${product.id}`} onClick={onClose}>
                            <img src={product.image} alt={product.name} />
                          </Link>
                          <div className="suggestion-info">
                            <Link to={`/product/${product.id}`} onClick={onClose} className="suggestion-name">
                              {product.name}
                            </Link>
                            <p className="suggestion-price">Rs. {product.price.toLocaleString()}</p>
                            <button 
                              className="suggestion-add-btn"
                              onClick={() => addToCart(product, 1, product.sizes[0])}
                            >
                              Quick Add
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="cart-drawer-footer">
                <div className="subtotal">
                  <span>Subtotal</span>
                  <span className="subtotal-amount">Rs. {cartTotal.toLocaleString()}</span>
                </div>
                <p className="shipping-note">Shipping and taxes calculated at checkout</p>
                <div className="footer-buttons">
                  <Link to="/cart" onClick={onClose} className="view-cart-link">
                    <Button variant="secondary" size="lg" className="w-full">
                      View Cart
                    </Button>
                  </Link>
                  <Button size="lg" className="w-full checkout-drawer-btn">
                    Checkout <ArrowRight size={18} />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
