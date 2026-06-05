import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Truck, Shield, CreditCard, Tag, X, Loader2, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import Button from '../components/Button';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    paymentMethod: 'cod'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Coupon state ──
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const discountAmount = appliedCoupon
    ? appliedCoupon.type === 'percentage'
      ? Math.round((cartTotal * appliedCoupon.value) / 100)
      : Math.min(appliedCoupon.value, cartTotal)
    : 0;

  const finalTotal = cartTotal - discountAmount;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.province.trim()) newErrors.province = 'Province is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Apply coupon ──
  const applyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setCouponLoading(true);
    setCouponError('');

    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .single();

    setCouponLoading(false);

    if (error || !data) {
      setCouponError('Invalid or expired coupon code.');
      return;
    }

    // Check expiry
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      setCouponError('This coupon has expired.');
      return;
    }

    // Check max uses
    if (data.max_uses !== null && data.used_count >= data.max_uses) {
      setCouponError('This coupon has reached its usage limit.');
      return;
    }

    // Check minimum order
    if (cartTotal < data.min_order) {
      setCouponError(`Minimum order of Rs. ${data.min_order.toLocaleString()} required for this coupon.`);
      return;
    }

    setAppliedCoupon(data);
    setCouponInput('');
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  // ── Place Order ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    const newOrderId = 'ORD-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 7).toUpperCase();

    // 1. Save order to Supabase
    const { error: orderError } = await supabase.from('orders').insert([{
      order_id: newOrderId,
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      province: formData.province,
      postal_code: formData.postalCode,
      payment_method: formData.paymentMethod,
      items: cartItems,
      total: finalTotal,
      coupon_code: appliedCoupon?.code || null,
      discount: discountAmount,
      status: 'pending'
    }]);

    if (orderError) {
      console.error('Order error:', orderError);
    }

    // 2. Auto-decrement stock for each cart item
    for (const item of cartItems) {
      const { data: productData } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.id)
        .single();

      if (productData) {
        const newStock = Math.max(0, productData.stock - item.quantity);
        await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', item.id);
      }
    }

    // 3. Increment coupon usage count
    if (appliedCoupon) {
      await supabase
        .from('coupons')
        .update({ used_count: appliedCoupon.used_count + 1 })
        .eq('id', appliedCoupon.id);
    }

    setOrderId(newOrderId);
    setIsOrderComplete(true);
    clearCart();
    window.scrollTo(0, 0);
    setIsSubmitting(false);
  };

  if (cartItems.length === 0 && !isOrderComplete) {
    return (
      <div className="checkout-empty section container text-center">
        <h2>Your cart is empty</h2>
        <p className="text-muted mb-4">Add some items to your cart to checkout.</p>
        <Link to="/shop"><Button size="lg">Continue Shopping</Button></Link>
      </div>
    );
  }

  if (isOrderComplete) {
    return (
      <div className="order-complete section container">
        <div className="order-complete-card">
          <div className="success-icon"><CheckCircle size={80} /></div>
          <h1>Order Placed Successfully!</h1>
          <p className="order-id">Order ID: <strong>{orderId}</strong></p>
          <p className="order-message">
            Thank you for your purchase! Track your order anytime using your Order ID.
          </p>

          <div className="order-details-summary">
            <h3>Shipping Details</h3>
            <p>{formData.firstName} {formData.lastName}</p>
            <p>{formData.address}</p>
            <p>{formData.city}, {formData.province} - {formData.postalCode}</p>
            <p>Phone: {formData.phone}</p>
            <div className="payment-method-info">
              <h4>Payment Method</h4>
              <p>{formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}</p>
            </div>
            {discountAmount > 0 && (
              <div className="payment-method-info">
                <h4>Coupon Applied</h4>
                <p>Saved Rs. {discountAmount.toLocaleString()} with code <strong>{appliedCoupon?.code}</strong></p>
              </div>
            )}
          </div>

          <div className="order-actions" style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/track-order">
              <Button size="lg" variant="outline">Track Order</Button>
            </Link>
            <Link to="/shop">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page section container">
      <Link to="/cart" className="back-link mb-4 flex items-center gap-2">
        <ArrowLeft size={16} /> Back to Cart
      </Link>

      <h1 className="mb-4">Checkout</h1>

      <form onSubmit={handleSubmit} className="checkout-layout">
        <div className="checkout-form-container">

          {/* Contact Information */}
          <div className="checkout-section">
            <h2>Contact Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className={errors.firstName ? 'error' : ''} placeholder="Enter your first name" />
                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className={errors.lastName ? 'error' : ''} placeholder="Enter your last name" />
                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={errors.email ? 'error' : ''} placeholder="your@email.com" />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone *</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={errors.phone ? 'error' : ''} placeholder="03XX-XXXXXXX" />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="checkout-section">
            <h2>Shipping Address</h2>
            <div className="form-group full-width">
              <label htmlFor="address">Street Address *</label>
              <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className={errors.address ? 'error' : ''} placeholder="House/Flat no., Street name, Area" />
              {errors.address && <span className="error-text">{errors.address}</span>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} className={errors.city ? 'error' : ''} placeholder="Karachi, Lahore, etc." />
                {errors.city && <span className="error-text">{errors.city}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="province">Province *</label>
                <select id="province" name="province" value={formData.province} onChange={handleChange} className={errors.province ? 'error' : ''}>
                  <option value="">Select Province</option>
                  <option value="Sindh">Sindh</option>
                  <option value="Punjab">Punjab</option>
                  <option value="KPK">KPK</option>
                  <option value="Balochistan">Balochistan</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                  <option value="AJK">AJK</option>
                </select>
                {errors.province && <span className="error-text">{errors.province}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="postalCode">Postal Code *</label>
                <input type="text" id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} className={errors.postalCode ? 'error' : ''} placeholder="XXXXX" />
                {errors.postalCode && <span className="error-text">{errors.postalCode}</span>}
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="checkout-section">
            <h2>Payment Method</h2>
            <div className="payment-options">
              <label className={`payment-option ${formData.paymentMethod === 'cod' ? 'active' : ''}`}>
                <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} />
                <div className="payment-option-content">
                  <Truck size={24} />
                  <div>
                    <span className="payment-title">Cash on Delivery</span>
                    <span className="payment-desc">Pay when you receive your order</span>
                  </div>
                </div>
              </label>
              <label className={`payment-option ${formData.paymentMethod === 'bank' ? 'active' : ''}`}>
                <input type="radio" name="paymentMethod" value="bank" checked={formData.paymentMethod === 'bank'} onChange={handleChange} />
                <div className="payment-option-content">
                  <CreditCard size={24} />
                  <div>
                    <span className="payment-title">Bank Transfer</span>
                    <span className="payment-desc">Pay via bank transfer</span>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="checkout-summary">
          <h3>Order Summary</h3>

          <div className="checkout-items">
            {cartItems.map(item => (
              <div key={`${item.id}-${item.selectedSize}`} className="checkout-item">
                <img src={item.image} alt={item.name} />
                <div className="checkout-item-info">
                  <h4>{item.name}</h4>
                  <p>Size: {item.selectedSize} | Qty: {item.quantity}</p>
                </div>
                <span className="checkout-item-price">Rs. {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="summary-divider"></div>

          {/* Coupon Section */}
          {!appliedCoupon ? (
            <div className="coupon-section">
              <label className="coupon-label"><Tag size={15} /> Coupon Code</label>
              <div className="coupon-input-row">
                <input
                  type="text"
                  className="coupon-input"
                  placeholder="Enter coupon code"
                  value={couponInput}
                  onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), applyCoupon())}
                />
                <button
                  type="button"
                  className="coupon-apply-btn"
                  onClick={applyCoupon}
                  disabled={couponLoading || !couponInput.trim()}
                >
                  {couponLoading ? <Loader2 size={15} className="spin" /> : 'Apply'}
                </button>
              </div>
              {couponError && <p className="coupon-error">{couponError}</p>}
            </div>
          ) : (
            <div className="coupon-applied">
              <div className="coupon-applied-info">
                <Tag size={15} />
                <span className="coupon-code-text">{appliedCoupon.code}</span>
                <span className="coupon-savings">
                  -{appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}%` : `Rs. ${appliedCoupon.value.toLocaleString()}`}
                </span>
              </div>
              <button type="button" className="coupon-remove-btn" onClick={removeCoupon}>
                <X size={14} />
              </button>
            </div>
          )}

          <div className="summary-divider"></div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>Rs. {cartTotal.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span className="free-shipping">Free</span>
          </div>
          {discountAmount > 0 && (
            <div className="summary-row discount-row">
              <span>Discount ({appliedCoupon.code})</span>
              <span className="discount-amount">- Rs. {discountAmount.toLocaleString()}</span>
            </div>
          )}

          <div className="summary-divider"></div>

          <div className="summary-row total-row">
            <span>Total</span>
            <span>Rs. {finalTotal.toLocaleString()}</span>
          </div>

          <Button type="submit" size="lg" className="place-order-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Placing Order...' : 'Place Order'}
          </Button>

          <div className="trust-badges">
            <div className="trust-badge"><Shield size={18} /><span>Secure Checkout</span></div>
            <div className="trust-badge"><Truck size={18} /><span>Fast Delivery</span></div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
