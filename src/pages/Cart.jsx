import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import productsData from '../data/products.json';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    // Get recommended products - exclude items already in cart
    const cartItemIds = new Set(cartItems.map(item => item.id));
    const recommended = productsData
      .filter(p => !cartItemIds.has(p.id) && p.isPopular)
      .slice(0, 4);
    setRecommendedProducts(recommended);
  }, [cartItems]);

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty section container text-center">
        <div className="empty-cart-icon">
          <ShoppingBag size={64} />
        </div>
        <h2>Your cart is empty</h2>
        <p className="text-muted mb-4">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page section container">
      <h1 className="mb-4">Shopping Cart</h1>

      <div className="cart-layout">
        <div className="cart-items-container">
          <div className="cart-header">
            <span>Product</span>
            <span>Quantity</span>
            <span>Total</span>
          </div>

          <div className="cart-items-list">
            {cartItems.map(item => (
              <div key={`${item.id}-${item.selectedSize}`} className="cart-item">
                <div className="cart-item-product">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-info">
                    <h3><Link to={`/product/${item.id}`}>{item.name}</Link></h3>
                    <p className="text-muted">Size: {item.selectedSize}</p>
                    <p className="cart-item-price-mobile">Rs. {item.price.toLocaleString()}</p>
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id, item.selectedSize)}
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </div>

                <div className="cart-item-quantity">
                  <div className="quantity-selector-small">
                    <button onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}>+</button>
                  </div>
                </div>

                <div className="cart-item-total">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span className="text-muted">Subtotal</span>
            <span>Rs. {cartTotal.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span className="text-muted">Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-row">
            <span className="text-muted">Tax</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row total-row">
            <span>Total</span>
            <span>Rs. {cartTotal.toLocaleString()}</span>
          </div>
          <Button size="lg" className="checkout-btn mt-4 w-full">
            Proceed to Checkout <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </div>

      {/* Recommended Products Section */}
      {recommendedProducts.length > 0 && (
        <div className="recommended-products mt-12 pt-10 border-t border-gray-100">
          <h2 className="section-title text-center mb-8 text-3xl font-bold">Recommended For You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
