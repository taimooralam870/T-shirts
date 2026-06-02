import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from './Button';
import './CartDrawer.css';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  return (
    <>
      {/* Overlay */}
      <div 
        className={`cart-drawer-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="cart-drawer-header">
          <h2>
            <ShoppingBag size={24} />
            Shopping Cart
          </h2>
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
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
              {/* Cart Items */}
              <div className="cart-drawer-items">
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
              </div>

              {/* Footer */}
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
