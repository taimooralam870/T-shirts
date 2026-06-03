import { Link } from 'react-router-dom';
import { ShoppingCart, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './SimpleCartDrawer.css';

const SimpleCartDrawer = () => {
  const { isCartDrawerOpen, closeCartDrawer, cartItems, removeFromCart, cartTotal, cartCount } = useCart();

  return (
    <>
      {/* Overlay */}
      <div 
        className={`simple-cart-overlay ${isCartDrawerOpen ? 'show' : ''}`}
        onClick={closeCartDrawer}
      />
      
      {/* Drawer */}
      <div className={`simple-cart-drawer ${isCartDrawerOpen ? 'open' : ''}`}>
        
        {/* Header */}
        <div className="simple-cart-header">
          <div className="simple-cart-title">
            <ShoppingCart size={22} />
            <span>Shopping Cart ({cartCount})</span>
          </div>
          <button onClick={closeCartDrawer} className="simple-close-btn">
            <X size={22} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="simple-cart-items">
          {cartItems.length === 0 ? (
            <div className="simple-empty-cart">
              <p>Your cart is empty</p>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={`${item.id}-${item.selectedSize}`} className="simple-cart-item">
                <img src={item.image} alt={item.name} />
                <div className="simple-item-details">
                  <p className="simple-item-name">{item.name}</p>
                  <div className="simple-item-info">
                    <span className="simple-item-size">Size: {item.selectedSize}</span>
                    <span className="simple-item-quantity">Qty: {item.quantity}</span>
                  </div>
                  <p className="simple-item-price">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id, item.selectedSize)}
                  className="simple-remove-btn"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="simple-cart-footer">
          <div className="simple-cart-total">
            <span>Total:</span>
            <span className="simple-total-amount">Rs. {cartTotal.toLocaleString()}</span>
          </div>
          <Link 
            to="/checkout" 
            className="simple-checkout-btn"
            onClick={closeCartDrawer}
          >
            Checkout →
          </Link>
        </div>
      </div>
    </>
  );
};

export default SimpleCartDrawer;
