import { useState } from 'react';
import { Search, Package, Truck, CheckCircle2, Clock, XCircle, RefreshCw, MapPin, Phone, Mail, Tag, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './TrackOrder.css';

const STATUS_STEPS = [
  { key: 'pending',    label: 'Order Placed',  icon: Clock,        desc: 'Your order has been received' },
  { key: 'processing', label: 'Processing',    icon: RefreshCw,    desc: 'We are preparing your items' },
  { key: 'shipped',    label: 'Shipped',        icon: Truck,        desc: 'Your order is on its way' },
  { key: 'delivered',  label: 'Delivered',      icon: CheckCircle2, desc: 'Package delivered successfully' },
];

const STATUS_ORDER = ['pending', 'processing', 'shipped', 'delivered'];

const statusBadgeStyle = (status) => ({
  pending:    { background: '#fef3c7', color: '#b45309' },
  processing: { background: '#dbeafe', color: '#1d4ed8' },
  shipped:    { background: '#ede9fe', color: '#6d28d9' },
  delivered:  { background: '#dcfce7', color: '#15803d' },
  cancelled:  { background: '#fee2e2', color: '#b91c1c' },
}[status] || { background: '#f3f4f6', color: '#374151' });

const TrackOrder = () => {
  const [inputId, setInputId]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [order, setOrder]       = useState(null);
  const [error, setError]       = useState('');
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

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-PK', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  return (
    <div className="track-order-page">

      {/* Hero */}
      <div className="track-hero">
        <div className="container">
          <div className="track-hero-inner">
            <div className="track-hero-icon"><Package size={24} /></div>
            <h1 className="track-hero-title">Track Your Order</h1>
            <p className="track-hero-sub">Enter your Order ID to get real-time status updates on your shipment.</p>
          </div>
        </div>
      </div>

      <div className="container">

        {/* Search */}
        <div className="track-search-card">
          <span className="track-search-label">Order ID</span>
          <form onSubmit={handleSearch}>
            <div className="track-search-row">
              <div className="track-input-wrap">
                <Search size={16} className="track-search-icon" />
                <input
                  type="text"
                  className="track-input"
                  placeholder="e.g. ORD-ABC123XYZ"
                  value={inputId}
                  onChange={e => { setInputId(e.target.value.toUpperCase()); setError(''); }}
                />
              </div>
              <button type="submit" className="track-search-btn" disabled={loading || !inputId.trim()}>
                {loading ? <><Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} /> Searching…</> : 'Track Order'}
              </button>
            </div>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="track-error">
            <XCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Result */}
        {order && (
          <div className="track-result">
            {/* Header */}
            <div className="track-result-header">
              <div>
                <p className="track-order-id">{order.order_id}</p>
                <p className="track-placed-date">Placed on {formatDate(order.created_at)}</p>
              </div>
              <span className="track-status-badge" style={statusBadgeStyle(order.status)}>
                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
              </span>
            </div>

            {/* Timeline */}
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
                          <Icon size={14} />
                        </div>
                        {index < STATUS_STEPS.length - 1 && (
                          <div className={`track-step-line ${index < currentStep ? 'filled' : ''}`} />
                        )}
                      </div>
                      <div className="track-step-info">
                        <p className="track-step-label">{step.label}</p>
                        <p className="track-step-desc">
                          {isActive ? step.desc : (isCompleted ? '✓ Done' : 'Pending')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="track-cancelled-banner">
                <XCircle size={18} />
                <span>This order has been cancelled.</span>
              </div>
            )}

            {/* Details */}
            <div className="track-details-grid">
              <div className="track-card">
                <h3><MapPin size={13} /> Shipping Details</h3>
                <p><strong>{order.first_name} {order.last_name}</strong></p>
                <p>{order.address}</p>
                <p>{order.city}, {order.province} {order.postal_code}</p>
                <p className="track-contact"><Phone size={12} /> {order.phone}</p>
                <p className="track-contact"><Mail size={12} /> {order.email}</p>
              </div>

              <div className="track-card">
                <h3><Tag size={13} /> Order Summary</h3>
                <div className="track-summary-row">
                  <span>Payment</span>
                  <span>{order.payment_method === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}</span>
                </div>
                {order.coupon_code && (
                  <div className="track-summary-row">
                    <span>Coupon</span>
                    <span className="track-coupon">{order.coupon_code} (–Rs. {order.discount?.toLocaleString()})</span>
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
                    {item.image && (
                      <img src={item.image} alt={item.name} className="track-item-img" />
                    )}
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

        {/* Empty Hint */}
        {!searched && !loading && (
          <div className="track-empty-hint">
            <Truck size={48} />
            <p>Enter your Order ID above</p>
            <span>Your Order ID was shown on the order confirmation page</span>
          </div>
        )}

      </div>
    </div>
  );
};

export default TrackOrder;
