import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Pencil, Trash2, LogOut, Package, ShoppingCart,
  X, Check, Search, ChevronDown, ChevronUp, AlertTriangle,
  Upload, ImagePlus, Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import './Admin.css';

const EMPTY_PRODUCT = {
  id: '', name: '', description: '',
  price: '', originalPrice: '',
  category: 'Unisex', color: '',
  sizes: [], rating: 4.5, reviews: 0,
  image: '', images: [],
  isNewArrival: false, isPopular: false, stock: 0,
};

const ALL_SIZES  = ['S', 'M', 'L', 'XL', 'XXL'];
const CATEGORIES = ['Men', 'Women', 'Unisex'];
const BUCKET     = 'product-images';

/* ─── helper: upload one File to Supabase Storage ─────────── */
const uploadImage = async (file, folder = 'main') => {
  const ext  = file.name.split('.').pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600', upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
};

/* ─── single image upload box ─────────────────────────────── */
const ImageUploadBox = ({ label, value, onChange, uploading }) => {
  const ref = useRef();
  return (
    <div className="img-upload-box">
      <span className="img-upload-label">{label}</span>
      {value ? (
        <div className="img-upload-preview-wrap">
          <img src={value} alt={label} className="img-upload-preview" />
          <button
            type="button"
            className="img-upload-remove"
            onClick={() => onChange('')}
          ><X size={14} /></button>
        </div>
      ) : (
        <button
          type="button"
          className="img-upload-btn"
          onClick={() => ref.current.click()}
          disabled={uploading}
        >
          {uploading
            ? <Loader2 size={22} className="spin" />
            : <><ImagePlus size={22} /><span>Upload</span></>
          }
        </button>
      )}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => e.target.files[0] && onChange(e.target.files[0])}
      />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════ */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab,      setActiveTab]      = useState('products');
  const [products,       setProducts]       = useState([]);
  const [orders,         setOrders]         = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [searchQuery,    setSearchQuery]    = useState('');
  const [showModal,      setShowModal]      = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData,       setFormData]       = useState(EMPTY_PRODUCT);
  const [formError,      setFormError]      = useState('');
  const [saving,         setSaving]         = useState(false);
  const [deleteConfirm,  setDeleteConfirm]  = useState(null);
  const [expandedOrder,  setExpandedOrder]  = useState(null);
  const [toast,          setToast]          = useState(null);

  // per-slot uploading flags: { main: bool, v0: bool, v1: bool, v2: bool }
  const [uploading, setUploading] = useState({});

  /* ── auth guard ── */
  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') !== 'true') navigate('/admin');
  }, [navigate]);

  useEffect(() => { fetchProducts(); fetchOrders(); }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('id');
    setProducts(data || []);
    setLoading(false);
  };

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders').select('*').order('created_at', { ascending: false });
    setOrders(data || []);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    navigate('/admin');
  };

  /* ── modal helpers ── */
  const openAddModal = () => {
    setEditingProduct(null);
    setFormData(EMPTY_PRODUCT);
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setFormData({
      ...p,
      price:         String(p.price),
      originalPrice: p.originalPrice ? String(p.originalPrice) : '',
      stock:         String(p.stock),
      images:        p.images || [],
    });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData(EMPTY_PRODUCT);
    setFormError('');
    setUploading({});
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const toggleSize = (s) =>
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(s)
        ? prev.sizes.filter(x => x !== s)
        : [...prev.sizes, s],
    }));

  /* ── image upload handler ── */
  const handleImageUpload = async (fileOrEmpty, slot) => {
    // slot: 'main' | 'v0' | 'v1' | 'v2'
    if (fileOrEmpty === '') {
      // remove
      if (slot === 'main') {
        setFormData(prev => ({ ...prev, image: '' }));
      } else {
        const idx = parseInt(slot.replace('v', ''));
        setFormData(prev => {
          const imgs = [...(prev.images || [])];
          imgs[idx] = '';
          return { ...prev, images: imgs };
        });
      }
      return;
    }

    setUploading(prev => ({ ...prev, [slot]: true }));
    try {
      const url = await uploadImage(fileOrEmpty, slot === 'main' ? 'main' : 'variants');
      if (slot === 'main') {
        setFormData(prev => ({ ...prev, image: url }));
      } else {
        const idx = parseInt(slot.replace('v', ''));
        setFormData(prev => {
          const imgs = [...(prev.images || [null, null, null])];
          while (imgs.length < 3) imgs.push('');
          imgs[idx] = url;
          return { ...prev, images: imgs };
        });
      }
      showToast('Image uploaded!');
    } catch (err) {
      showToast('Upload failed: ' + err.message, 'error');
    } finally {
      setUploading(prev => ({ ...prev, [slot]: false }));
    }
  };

  /* ── validate & save ── */
  const validateForm = () => {
    if (!formData.name.trim())                  return 'Product name is required';
    if (!formData.price || isNaN(formData.price)) return 'Valid price is required';
    if (!formData.category)                     return 'Category is required';
    if (!formData.image.trim())                 return 'Main product image is required';
    if (formData.sizes.length === 0)            return 'Select at least one size';
    if (!editingProduct && !formData.id.trim()) return 'Product ID is required';
    return '';
  };

  const handleSave = async () => {
    const err = validateForm();
    if (err) { setFormError(err); return; }

    setSaving(true);
    const payload = {
      name:          formData.name.trim(),
      description:   formData.description.trim(),
      price:         parseInt(formData.price),
      originalPrice: formData.originalPrice ? parseInt(formData.originalPrice) : null,
      category:      formData.category,
      color:         formData.color.trim(),
      sizes:         formData.sizes,
      rating:        parseFloat(formData.rating) || 4.5,
      reviews:       parseInt(formData.reviews) || 0,
      image:         formData.image.trim(),
      images:        (formData.images || []).filter(Boolean),
      isNewArrival:  formData.isNewArrival,
      isPopular:     formData.isPopular,
      stock:         parseInt(formData.stock) || 0,
    };

    if (editingProduct) {
      const { error } = await supabase.from('products').update(payload).eq('id', editingProduct.id);
      if (error) { setFormError('Update failed: ' + error.message); setSaving(false); return; }
      showToast('Product updated!');
    } else {
      const { error } = await supabase.from('products').insert([{ id: formData.id.trim(), ...payload }]);
      if (error) { setFormError('Insert failed: ' + error.message); setSaving(false); return; }
      showToast('Product added!');
    }

    await fetchProducts();
    closeModal();
    setSaving(false);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) { showToast('Delete failed', 'error'); return; }
    showToast('Product deleted!');
    setDeleteConfirm(null);
    fetchProducts();
  };

  const handleOrderStatus = async (orderId, status) => {
    await supabase.from('orders').update({ status }).eq('id', orderId);
    fetchOrders();
    showToast('Status updated!');
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalProducts: products.length,
    totalOrders:   orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    revenue:       orders.reduce((s, o) => s + (o.total || 0), 0),
  };

  const statusColor = (s) =>
    ({ pending:'#f59e0b', processing:'#3b82f6', shipped:'#8b5cf6', delivered:'#10b981', cancelled:'#ef4444' }[s] || '#6b7280');

  /* helper to get variant image value */
  const variantImg = (idx) => (formData.images || [])[idx] || '';

  /* ════════════════════════════════════════ RENDER ══════════ */
  return (
    <div className="admin-dashboard">

      {/* Toast */}
      {toast && (
        <div className={`admin-toast ${toast.type}`}>
          {toast.type === 'success' ? <Check size={18}/> : <AlertTriangle size={18}/>}
          {toast.message}
        </div>
      )}

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header"><Package size={28}/><span>Admin Panel</span></div>
        <nav className="admin-nav">
          <button className={`admin-nav-item ${activeTab==='products'?'active':''}`} onClick={()=>setActiveTab('products')}>
            <Package size={20}/> Products
          </button>
          <button className={`admin-nav-item ${activeTab==='orders'?'active':''}`} onClick={()=>setActiveTab('orders')}>
            <ShoppingCart size={20}/> Orders
            {stats.pendingOrders>0 && <span className="admin-badge">{stats.pendingOrders}</span>}
          </button>
        </nav>
        <button className="admin-logout-btn" onClick={handleLogout}><LogOut size={18}/> Logout</button>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <div className="admin-top-bar">
          <h1>{activeTab==='products'?'Products':'Orders'}</h1>
          <a href="/" target="_blank" className="admin-view-store">View Store →</a>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          <div className="admin-stat-card"><span className="stat-number">{stats.totalProducts}</span><span className="stat-label">Products</span></div>
          <div className="admin-stat-card"><span className="stat-number">{stats.totalOrders}</span><span className="stat-label">Orders</span></div>
          <div className="admin-stat-card"><span className="stat-number pending">{stats.pendingOrders}</span><span className="stat-label">Pending</span></div>
          <div className="admin-stat-card"><span className="stat-number">Rs.{stats.revenue.toLocaleString()}</span><span className="stat-label">Revenue</span></div>
        </div>

        {/* ── PRODUCTS ── */}
        {activeTab==='products' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <div className="admin-search-box">
                <Search size={18}/>
                <input placeholder="Search products..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/>
              </div>
              <button className="admin-add-btn" onClick={openAddModal}><Plus size={18}/> Add Product</button>
            </div>

            {loading ? <div className="admin-loading">Loading…</div> : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Tags</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filteredProducts.map(p => (
                      <tr key={p.id}>
                        <td><img src={p.image} alt={p.name} className="admin-product-thumb"/></td>
                        <td>
                          <div className="admin-product-name">{p.name}</div>
                          <div className="admin-product-id">ID: {p.id}</div>
                        </td>
                        <td><span className="admin-category-pill">{p.category}</span></td>
                        <td>
                          <div className="admin-price">Rs. {p.price?.toLocaleString()}</div>
                          {p.originalPrice && <div className="admin-original-price">Rs. {p.originalPrice?.toLocaleString()}</div>}
                        </td>
                        <td><span className={`admin-stock ${p.stock<=5?'low':''}`}>{p.stock}</span></td>
                        <td>
                          <div className="admin-flags">
                            {p.isNewArrival && <span className="admin-flag new">New</span>}
                            {p.isPopular    && <span className="admin-flag popular">Popular</span>}
                          </div>
                        </td>
                        <td>
                          <div className="admin-actions">
                            <button className="admin-edit-btn"   onClick={()=>openEditModal(p)}><Pencil size={16}/></button>
                            <button className="admin-delete-btn" onClick={()=>setDeleteConfirm(p.id)}><Trash2 size={16}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredProducts.length===0 && <div className="admin-empty">No products found</div>}
              </div>
            )}
          </div>
        )}

        {/* ── ORDERS ── */}
        {activeTab==='orders' && (
          <div className="admin-section">
            <div className="admin-orders-list">
              {orders.length===0 ? <div className="admin-empty">No orders yet</div> : orders.map(order=>(
                <div key={order.id} className="admin-order-card">
                  <div className="admin-order-header" onClick={()=>setExpandedOrder(expandedOrder===order.id?null:order.id)}>
                    <div className="admin-order-left">
                      <span className="admin-order-id">{order.order_id}</span>
                      <span className="admin-order-customer">{order.first_name} {order.last_name}</span>
                      <span className="admin-order-city">{order.city}, {order.province}</span>
                    </div>
                    <div className="admin-order-right">
                      <span className="admin-order-total">Rs. {order.total?.toLocaleString()}</span>
                      <span className="admin-order-status" style={{background:statusColor(order.status)+'22',color:statusColor(order.status)}}>{order.status}</span>
                      <select className="admin-status-select" value={order.status} onClick={e=>e.stopPropagation()} onChange={e=>handleOrderStatus(order.id,e.target.value)}>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {expandedOrder===order.id ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                    </div>
                  </div>
                  {expandedOrder===order.id && (
                    <div className="admin-order-details">
                      <div className="admin-order-info-grid">
                        <div><h4>Contact</h4><p>{order.email}</p><p>{order.phone}</p></div>
                        <div><h4>Address</h4><p>{order.address}</p><p>{order.city}, {order.province} {order.postal_code}</p></div>
                        <div><h4>Payment</h4><p>{order.payment_method==='cod'?'Cash on Delivery':'Bank Transfer'}</p></div>
                        <div><h4>Date</h4><p>{new Date(order.created_at).toLocaleDateString('en-PK',{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}</p></div>
                      </div>
                      <div className="admin-order-items">
                        <h4>Items</h4>
                        {(order.items||[]).map((item,i)=>(
                          <div key={i} className="admin-order-item">
                            <img src={item.image} alt={item.name}/>
                            <div><span className="item-name">{item.name}</span><span className="item-meta">Size: {item.selectedSize} | Qty: {item.quantity}</span></div>
                            <span className="item-price">Rs. {(item.price*item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ══ ADD / EDIT MODAL ══════════════════════════════════ */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={e=>e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingProduct?'Edit Product':'Add New Product'}</h2>
              <button onClick={closeModal}><X size={22}/></button>
            </div>

            <div className="admin-modal-body">

              {/* ID (add only) */}
              {!editingProduct && (
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Product ID *</label>
                    <input name="id" value={formData.id} onChange={handleFormChange} placeholder="e.g. 9"/>
                  </div>
                </div>
              )}

              {/* Name */}
              <div className="admin-form-row">
                <div className="admin-form-group full">
                  <label>Product Name *</label>
                  <input name="name" value={formData.name} onChange={handleFormChange} placeholder="Product name"/>
                </div>
              </div>

              {/* Description */}
              <div className="admin-form-row">
                <div className="admin-form-group full">
                  <label>Description</label>
                  <textarea name="description" value={formData.description} onChange={handleFormChange} rows={3} placeholder="Product description"/>
                </div>
              </div>

              {/* Price / Original Price */}
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Price (Rs.) *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleFormChange} placeholder="1500"/>
                </div>
                <div className="admin-form-group">
                  <label>Original Price (Rs.)</label>
                  <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleFormChange} placeholder="2000"/>
                </div>
              </div>

              {/* Category / Color */}
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Category *</label>
                  <select name="category" value={formData.category} onChange={handleFormChange}>
                    {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Color</label>
                  <input name="color" value={formData.color} onChange={handleFormChange} placeholder="Black, White…"/>
                </div>
              </div>

              {/* Stock / Rating */}
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Stock</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleFormChange} placeholder="10"/>
                </div>
                <div className="admin-form-group">
                  <label>Rating</label>
                  <input type="number" name="rating" value={formData.rating} onChange={handleFormChange} step="0.1" min="1" max="5" placeholder="4.5"/>
                </div>
              </div>

              {/* ── IMAGE UPLOAD SECTION ────────────────────── */}
              <div className="admin-images-section">
                <div className="admin-images-label">
                  <Upload size={16}/>
                  <span>Product Images</span>
                </div>

                <div className="admin-images-grid">
                  {/* Main Image */}
                  <ImageUploadBox
                    label="Main Image *"
                    value={formData.image}
                    uploading={!!uploading['main']}
                    onChange={(f) => handleImageUpload(f, 'main')}
                  />
                  {/* 3 Variant Images */}
                  {[0,1,2].map(idx => (
                    <ImageUploadBox
                      key={idx}
                      label={`Variant ${idx+1}`}
                      value={variantImg(idx)}
                      uploading={!!uploading[`v${idx}`]}
                      onChange={(f) => handleImageUpload(f, `v${idx}`)}
                    />
                  ))}
                </div>

                <p className="admin-images-hint">
                  Upload from your device. Main image is required. Variants are optional (shown in product gallery).
                </p>
              </div>
              {/* ─────────────────────────────────────────────── */}

              {/* Sizes */}
              <div className="admin-form-group" style={{marginBottom:'0.75rem'}}>
                <label>Sizes *</label>
                <div className="admin-size-selector">
                  {ALL_SIZES.map(s=>(
                    <button key={s} type="button"
                      className={`admin-size-btn ${formData.sizes.includes(s)?'active':''}`}
                      onClick={()=>toggleSize(s)}>{s}</button>
                  ))}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="admin-form-row" style={{marginBottom:'0.5rem'}}>
                <label className="admin-checkbox-label">
                  <input type="checkbox" name="isNewArrival" checked={formData.isNewArrival} onChange={handleFormChange}/>
                  New Arrival
                </label>
                <label className="admin-checkbox-label">
                  <input type="checkbox" name="isPopular" checked={formData.isPopular} onChange={handleFormChange}/>
                  Popular
                </label>
              </div>

              {formError && <div className="admin-form-error">{formError}</div>}
            </div>

            <div className="admin-modal-footer">
              <button className="admin-cancel-btn" onClick={closeModal}>Cancel</button>
              <button className="admin-save-btn" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={()=>setDeleteConfirm(null)}>
          <div className="admin-confirm-modal" onClick={e=>e.stopPropagation()}>
            <AlertTriangle size={40} className="confirm-icon"/>
            <h3>Delete Product?</h3>
            <p>This action cannot be undone.</p>
            <div className="confirm-actions">
              <button className="admin-cancel-btn" onClick={()=>setDeleteConfirm(null)}>Cancel</button>
              <button className="admin-delete-confirm-btn" onClick={()=>handleDelete(deleteConfirm)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
