import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle2, Clock, XCircle, RefreshCw, MapPin, Phone, Mail, Tag, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from '../components/Button';
import './TrackOrder.css';

const STATUS_STEPS = [
  { key: 'pending',    label: 'Order Placed',  icon: Clock,        desc: 'Your order has been received' },
  { key: 'processing', label: 'Processing',    icon: RefreshCw,    desc: 'We are preparing your items' },
  { key: 'shipped',    label: 'Shipped',        icon: Truck,        desc: 'Your order is on its way' },
  { key: 'delivered',  label: 'Delivered',      icon: CheckCircle2, desc: 'Package delivered successfully' },
];

const STATUS_ORDER = ['pending', 'processing', 'shipped', 'delivered'];

const TrackOrder = () => {
  const [inputId, setInputId] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e?.preventDefault();
    const id = inputId.trim().toUpperCase();
    if (!id) return;

    setLoading(true);
    setError('');
    setOrder(null);
    setSearched(true);

    const { data, error: dbError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', id)
      .single();

    setLoading(false);

    if (dbError || !data) {
      setError('No order found with this ID. Please check and try again.');
      return;
    }

    setOrder(data);
  };

  const isCancelled = order?.status === 'cancelled';
  const currentStep = isCancelled ? -1 : STATUS_ORDER.indexOf(order?.status);

  const statusBadgeColor = (status) => ({
    pending:    { bg: '#fef3c7', color: '#b45309' },
    processing: { bg: '#dbeafe', color: '#1d4ed8' },
    shipped:    { bg: '#ede9fe', color: '#6d28d9' },
    delivered:  { bg: '#dcfce7', color: '#15803d' },
    cancelled:  { bg: '#fee2e2', color: '#b91c1c' },
  }[status] || { bg: '#f3f4f6', color: '#374151' });

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="track-order-page section container">
      <div className="track-order-header">
        <Package size={36} className="track-header-icon" />
        <h1>Track Your Order</h1>
        <p>Enter your Order ID to get real-time status updates</p>
      </div>

      <form className="track-search-box" onSubmit={handleSearch}>
        <div className="track-input-wrap">
          <Search size={18} className="track-search-icon" />
          <input
            type="text"
            className="track-input"
            placeholder="e.g. ORD-ABC123XYZ"
            value={inputId}
            onChange={e => { setInputId(e.target.value.toUpperCase()); setError(''); }}
          />
        </div>
        <Button type="submit" size="lg" disabled={loading || !inputId.trim()}>
          {loading ? <><Loader2 size={18} className="spin" /> Searching…</> : 'Track Order'}
        </Button>
      </form>

      {error && (
        <div className="track-error">
          <XCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {order && (
        <div className="track-result">

          {/* Header */}
          <div className="track-result-header">
            <div>
              <p className="track-order-id">{order.order_id}</p>
              <p className="track-placed-date">Placed on {formatDate(order.created_at)}</p>
            </div>
            <span
              className="track-status-badge"
              style={{ background: statusBadgeColor(order.status).bg, color: statusBadgeColor(order.status).color }}
            >
              {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
            </span>
          </div>

          {/* Progress Timeline */}
          {!isCancelled ? (
            <div className="track-timeline">
              {STATUS_STEPS.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index <= currentStep;
                const isActive    = index === currentStep;
                return (
                  <div key={step.key} className={`track-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                    <div className="track-step-connector">
                      <div className={`track-step-circle ${isCompleted ? 'filled' : ''}`}>
                        <Icon size={16} />
                      </div>
                      {index < STATUS_STEPS.length - 1 && (
                        <div className={`track-step-line ${index < currentStep ? 'filled' : ''}`} />
                      )}
                    </div>
                    <div className="track-step-info">
                      <p className="track-step-label">{step.label}</p>
                      <p className="track-step-desc">{isActive ? step.desc : (isCompleted ? '✓ Done' : 'Pending')}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="track-cancelled-banner">
              <XCircle size={20} />
              <span>This order has been cancelled.</span>
            </div>
          )}

          <div className="track-details-grid">
            {/* Shipping Info */}
            <div className="track-card">
              <h3><MapPin size={16} /> Shipping Details</h3>
              <p><strong>{order.first_name} {order.last_name}</strong></p>
              <p>{order.address}</p>
              <p>{order.city}, {order.province} {order.postal_code}</p>
              <p className="track-contact"><Phone size={13} /> {order.phone}</p>
              <p className="track-contact"><Mail size={13} /> {order.email}</p>
            </div>

            {/* Payment Info */}
            <div className="track-card">
              <h3><Tag size={16} /> Order Summary</h3>
              <div className="track-summary-row">
                <span>Payment</span>
                <span>{order.payment_method === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}</span>
              </div>
              {order.coupon_code && (
                <div className="track-summary-row">
                  <span>Coupon</span>
                  <span className="track-coupon">{order.coupon_code} (-Rs. {order.discount?.toLocaleString()})</span>
                </div>
              )}
              <div className="track-summary-row track-total-row">
                <span>Total</span>
                <span>Rs. {order.total?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="track-items-section">
            <h3>Items in this Order</h3>
            <div className="track-items-list">
              {(order.items || []).map((item, i) => (
                <div key={i} className="track-item">
                  {item.image && <img src={item.image} alt={item.name} className="track-item-img" />}
                  <div className="track-item-info">
                    <p className="track-item-name">{item.name}</p>
                    <p className="track-item-meta">Size: {item.selectedSize} · Qty: {item.quantity}</p>
                  </div>
                  <span className="track-item-price">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {!searched && !loading && (
        <div className="track-empty-hint">
          <Truck size={48} />
          <p>Enter your Order ID above to track your shipment</p>
          <span>Your Order ID was shown on the order confirmation page</span>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
