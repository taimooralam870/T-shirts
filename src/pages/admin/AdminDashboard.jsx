import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Pencil, Trash2, LogOut, Package, ShoppingCart,
  X, Check, Search, ChevronDown, ChevronUp, AlertTriangle,
  Upload, ImagePlus, Loader2, Users, BarChart2, Download,
  TrendingUp, TrendingDown, PhoneCall, Mail, MapPin,
  Clock, CheckCircle2, XCircle, Truck, RefreshCw,
  Filter, Calendar, DollarSign, Repeat2, Target,
  ArrowUpRight, ArrowDownRight, CreditCard, Banknote,
  ShoppingBag, Activity, Award, Tag
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import './Admin.css';

const EMPTY_PRODUCT = {
  id: '', sku: '', name: '', description: '',
  price: '', originalPrice: '',
  category: 'Unisex', color: '',
  sizes: [], rating: 4.5, reviews: 0,
  image: '', images: [],
  isNewArrival: false, isPopular: false, stock: 0,
};

const ALL_SIZES  = ['S', 'M', 'L', 'XL', 'XXL'];
const CATEGORIES = ['Men', 'Women', 'Unisex'];
const BUCKET     = 'product-images';

/* ─── Upload helper ─── */
const uploadImage = async (file, folder = 'main') => {
  const ext  = file.name.split('.').pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { cacheControl: '3600', upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
};

/* ─── Image upload box ─── */
const ImageUploadBox = ({ label, value, onChange, uploading }) => {
  const ref = useRef();
  return (
    <div className="img-upload-box">
      <span className="img-upload-label">{label}</span>
      {value ? (
        <div className="img-upload-preview-wrap">
          <img src={value} alt={label} className="img-upload-preview" />
          <button type="button" className="img-upload-remove" onClick={() => onChange('')}><X size={14}/></button>
        </div>
      ) : (
        <button type="button" className="img-upload-btn" onClick={() => ref.current.click()} disabled={uploading}>
          {uploading ? <Loader2 size={22} className="spin"/> : <><ImagePlus size={22}/><span>Upload</span></>}
        </button>
      )}
      <input ref={ref} type="file" accept="image/*" style={{display:'none'}} onChange={e => e.target.files[0] && onChange(e.target.files[0])}/>
    </div>
  );
};

/* ─── Pro Bar Chart ─── */
const ProBarChart = ({ data, color = '#6366f1', height = 180, showValues = true }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="pro-bar-chart" style={{height}}>
      <div className="pro-bar-chart-inner">
        {data.map((d, i) => (
          <div key={i} className="pro-bar-col">
            {showValues && d.value > 0 && (
              <span className="pro-bar-value">
                {d.value >= 1000 ? `${(d.value/1000).toFixed(1)}k` : d.value}
              </span>
            )}
            <div className="pro-bar-track">
              <div
                className="pro-bar-fill"
                style={{ height: `${(d.value / max) * 100}%`, background: color }}
                title={`${d.label}: Rs. ${d.value.toLocaleString()}`}
              />
            </div>
            <span className="pro-bar-label">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Donut Chart (CSS-only) ─── */
const DonutChart = ({ segments }) => {
  const total = segments.reduce((s, x) => s + x.value, 0);
  let offset = 25;
  return (
    <div className="donut-wrap">
      <svg viewBox="0 0 36 36" className="donut-svg">
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3.5"/>
        {segments.map((seg, i) => {
          const pct = total ? (seg.value / total) * 100 : 0;
          const el = (
            <circle key={i} cx="18" cy="18" r="15.9" fill="none"
              stroke={seg.color} strokeWidth="3.5"
              strokeDasharray={`${pct} ${100 - pct}`}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          );
          offset -= pct;
          return el;
        })}
        <text x="18" y="20.35" textAnchor="middle" className="donut-center-text">{total}</text>
      </svg>
      <div className="donut-legend">
        {segments.map((seg, i) => (
          <div key={i} className="donut-legend-item">
            <span className="donut-dot" style={{background: seg.color}}/>
            <span className="donut-leg-label">{seg.label}</span>
            <span className="donut-leg-val">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Trend indicator ─── */
const Trend = ({ current, previous }) => {
  if (!previous) return null;
  const pct = Math.round(((current - previous) / previous) * 100);
  const up = pct >= 0;
  return (
    <span className={`trend-badge ${up ? 'up' : 'down'}`}>
      {up ? <ArrowUpRight size={13}/> : <ArrowDownRight size={13}/>}
      {Math.abs(pct)}%
    </span>
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
  const [orderSearch,    setOrderSearch]    = useState('');
  const [userSearch,     setUserSearch]     = useState('');
  const [orderFilter,    setOrderFilter]    = useState('all');
  const [showModal,      setShowModal]      = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData,       setFormData]       = useState(EMPTY_PRODUCT);
  const [formError,      setFormError]      = useState('');
  const [saving,         setSaving]         = useState(false);
  const [deleteConfirm,  setDeleteConfirm]  = useState(null);
  const [expandedOrder,  setExpandedOrder]  = useState(null);
  const [expandedUser,   setExpandedUser]   = useState(null);
  const [toast,          setToast]          = useState(null);
  const [uploading,      setUploading]      = useState({});

  /* ── Coupons state ── */
  const EMPTY_COUPON = { code: '', type: 'percentage', value: '', min_order: '', max_uses: '', expires_at: '', is_active: true };
  const [coupons,        setCoupons]        = useState([]);
  const [couponModal,    setCouponModal]    = useState(false);
  const [editingCoupon,  setEditingCoupon]  = useState(null);
  const [couponForm,     setCouponForm]     = useState(EMPTY_COUPON);
  const [couponFormErr,  setCouponFormErr]  = useState('');
  const [savingCoupon,   setSavingCoupon]   = useState(false);
  const [delCoupon,      setDelCoupon]      = useState(null);

  /* ── Date range for analytics ── */
  const today    = new Date().toISOString().slice(0, 10);
  const ago30    = new Date(Date.now() - 29 * 86400000).toISOString().slice(0, 10);
  const [dateFrom,   setDateFrom]   = useState(ago30);
  const [dateTo,     setDateTo]     = useState(today);
  const [datePreset, setDatePreset] = useState('30d');

  const applyPreset = (preset) => {
    setDatePreset(preset);
    const now = new Date();
    const toStr = now.toISOString().slice(0, 10);
    const map = {
      '7d':  7, '14d': 14, '30d': 30,
      '90d': 90, '180d': 180, '365d': 365,
    };
    if (map[preset]) {
      setDateFrom(new Date(Date.now() - (map[preset] - 1) * 86400000).toISOString().slice(0, 10));
      setDateTo(toStr);
    }
    if (preset === 'mtd') {
      setDateFrom(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10));
      setDateTo(toStr);
    }
    if (preset === 'ytd') {
      setDateFrom(new Date(now.getFullYear(), 0, 1).toISOString().slice(0, 10));
      setDateTo(toStr);
    }
    if (preset === 'custom') { /* keep */ }
  };

  /* ── auth guard ── */
  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') !== 'true') navigate('/admin');
  }, [navigate]);

  useEffect(() => { fetchProducts(); fetchOrders(); fetchCoupons(); }, []);

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
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders(data || []);
  };

  const handleLogout = () => { sessionStorage.removeItem('admin_auth'); navigate('/admin'); };

  /* ── modal helpers ── */
  const openAddModal  = () => { setEditingProduct(null); setFormData(EMPTY_PRODUCT); setFormError(''); setShowModal(true); };
  const openEditModal = (p) => {
    setEditingProduct(p);
    setFormData({ ...p, price: String(p.price), originalPrice: p.originalPrice ? String(p.originalPrice) : '', stock: String(p.stock), sku: p.sku || '', images: p.images || [] });
    setFormError(''); setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditingProduct(null); setFormData(EMPTY_PRODUCT); setFormError(''); setUploading({}); };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const toggleSize = (s) =>
    setFormData(prev => ({ ...prev, sizes: prev.sizes.includes(s) ? prev.sizes.filter(x => x !== s) : [...prev.sizes, s] }));

  const handleImageUpload = async (fileOrEmpty, slot) => {
    if (fileOrEmpty === '') {
      if (slot === 'main') { setFormData(prev => ({ ...prev, image: '' })); }
      else { const idx = parseInt(slot.replace('v', '')); setFormData(prev => { const imgs = [...(prev.images||[])]; imgs[idx]=''; return {...prev, images:imgs}; }); }
      return;
    }
    setUploading(prev => ({ ...prev, [slot]: true }));
    try {
      const url = await uploadImage(fileOrEmpty, slot === 'main' ? 'main' : 'variants');
      if (slot === 'main') { setFormData(prev => ({ ...prev, image: url })); }
      else { const idx = parseInt(slot.replace('v', '')); setFormData(prev => { const imgs = [...(prev.images||[null,null,null])]; while(imgs.length<3)imgs.push(''); imgs[idx]=url; return {...prev, images:imgs}; }); }
      showToast('Image uploaded!');
    } catch (err) { showToast('Upload failed: ' + err.message, 'error'); }
    finally { setUploading(prev => ({ ...prev, [slot]: false })); }
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Product name is required';
    if (!formData.price || isNaN(formData.price)) return 'Valid price is required';
    if (!formData.category) return 'Category is required';
    if (!formData.image.trim()) return 'Main product image is required';
    if (formData.sizes.length === 0) return 'Select at least one size';
    if (!editingProduct && !formData.id.trim()) return 'Product ID is required';
    return '';
  };

  const handleSave = async () => {
    const err = validateForm();
    if (err) { setFormError(err); return; }
    setSaving(true);
    const payload = {
      sku: formData.sku.trim() || null, name: formData.name.trim(), description: formData.description.trim(),
      price: parseInt(formData.price), originalPrice: formData.originalPrice ? parseInt(formData.originalPrice) : null,
      category: formData.category, color: formData.color.trim(), sizes: formData.sizes,
      rating: parseFloat(formData.rating) || 4.5, reviews: parseInt(formData.reviews) || 0,
      image: formData.image.trim(), images: (formData.images || []).filter(Boolean),
      isNewArrival: formData.isNewArrival, isPopular: formData.isPopular, stock: parseInt(formData.stock) || 0,
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
    await fetchProducts(); closeModal(); setSaving(false);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) { showToast('Delete failed', 'error'); return; }
    showToast('Product deleted!'); setDeleteConfirm(null); fetchProducts();
  };

  const handleOrderStatus = async (orderId, status) => {
    await supabase.from('orders').update({ status }).eq('id', orderId);
    fetchOrders(); showToast('Status updated!');
  };

  /* ── Coupon CRUD ── */
  const fetchCoupons = async () => {
    const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    setCoupons(data || []);
  };

  const openAddCoupon = () => { setEditingCoupon(null); setCouponForm(EMPTY_COUPON); setCouponFormErr(''); setCouponModal(true); };
  const openEditCoupon = (c) => { setEditingCoupon(c); setCouponForm({ code: c.code, type: c.type, value: String(c.value), min_order: c.min_order ? String(c.min_order) : '', max_uses: c.max_uses ? String(c.max_uses) : '', expires_at: c.expires_at ? c.expires_at.slice(0, 10) : '', is_active: c.is_active }); setCouponFormErr(''); setCouponModal(true); };
  const closeCouponModal = () => { setCouponModal(false); setEditingCoupon(null); setCouponForm(EMPTY_COUPON); setCouponFormErr(''); };

  const handleCouponSave = async () => {
    if (!couponForm.code.trim()) { setCouponFormErr('Coupon code is required'); return; }
    if (!couponForm.value || isNaN(couponForm.value) || Number(couponForm.value) <= 0) { setCouponFormErr('Valid discount value is required'); return; }
    if (couponForm.type === 'percentage' && Number(couponForm.value) > 100) { setCouponFormErr('Percentage cannot exceed 100'); return; }
    setSavingCoupon(true);
    const payload = {
      code: couponForm.code.trim().toUpperCase(),
      type: couponForm.type,
      value: parseInt(couponForm.value),
      min_order: couponForm.min_order ? parseInt(couponForm.min_order) : 0,
      max_uses: couponForm.max_uses ? parseInt(couponForm.max_uses) : null,
      expires_at: couponForm.expires_at ? new Date(couponForm.expires_at + 'T23:59:59').toISOString() : null,
      is_active: couponForm.is_active,
    };
    if (editingCoupon) {
      const { error } = await supabase.from('coupons').update(payload).eq('id', editingCoupon.id);
      if (error) { setCouponFormErr('Update failed: ' + error.message); setSavingCoupon(false); return; }
      showToast('Coupon updated!');
    } else {
      const { error } = await supabase.from('coupons').insert([payload]);
      if (error) { setCouponFormErr(error.message.includes('unique') ? 'This coupon code already exists.' : 'Error: ' + error.message); setSavingCoupon(false); return; }
      showToast('Coupon created!');
    }
    await fetchCoupons(); closeCouponModal(); setSavingCoupon(false);
  };

  const handleDeleteCoupon = async (id) => {
    await supabase.from('coupons').delete().eq('id', id);
    showToast('Coupon deleted!'); setDelCoupon(null); fetchCoupons();
  };

  const toggleCouponActive = async (coupon) => {
    await supabase.from('coupons').update({ is_active: !coupon.is_active }).eq('id', coupon.id);
    fetchCoupons(); showToast(coupon.is_active ? 'Coupon disabled!' : 'Coupon enabled!');
  };

  /* ── Users derived from orders ── */
  const usersData = useMemo(() => {
    const map = {};
    orders.forEach(order => {
      const key = order.email;
      if (!map[key]) map[key] = { email: order.email, name: `${order.first_name} ${order.last_name}`, phone: order.phone, city: order.city, province: order.province, orders: [], totalSpent: 0, firstOrder: order.created_at, lastOrder: order.created_at };
      map[key].orders.push(order);
      map[key].totalSpent += order.total || 0;
      if (new Date(order.created_at) < new Date(map[key].firstOrder)) map[key].firstOrder = order.created_at;
      if (new Date(order.created_at) > new Date(map[key].lastOrder)) map[key].lastOrder = order.created_at;
    });
    return Object.values(map).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  /* ── Analytics (date-filtered) ── */
  const analyticsData = useMemo(() => {
    const from = new Date(dateFrom + 'T00:00:00');
    const to   = new Date(dateTo   + 'T23:59:59');

    const filtered = orders.filter(o => {
      const d = new Date(o.created_at);
      return d >= from && d <= to;
    });

    // Previous period (same length)
    const rangeMs = to - from;
    const prevTo  = new Date(from - 1);
    const prevFrom= new Date(from - rangeMs - 1);
    const prevPeriod = orders.filter(o => {
      const d = new Date(o.created_at);
      return d >= prevFrom && d <= prevTo;
    });

    /* ── Daily revenue within range ── */
    const diffDays = Math.round(rangeMs / 86400000) + 1;
    const dailyRevenue = [];
    for (let i = 0; i < Math.min(diffDays, 60); i++) {
      const d = new Date(from);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      const label = diffDays <= 14
        ? d.toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })
        : diffDays <= 60
          ? d.toLocaleDateString('en-PK', { day: 'numeric' })
          : d.toLocaleDateString('en-PK', { month: 'short' });
      const value = filtered.filter(o => o.created_at?.slice(0,10) === dateStr).reduce((s, o) => s + (o.total||0), 0);
      dailyRevenue.push({ label, value, date: dateStr });
    }

    /* ── If range > 60 days: bucket by week or month ── */
    let revenueChart = dailyRevenue;
    if (diffDays > 60) {
      const monthly = {};
      filtered.forEach(o => {
        const d = new Date(o.created_at);
        const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
        const label = d.toLocaleDateString('en-PK', { month: 'short', year: '2-digit' });
        if (!monthly[key]) monthly[key] = { label, value: 0 };
        monthly[key].value += o.total || 0;
      });
      revenueChart = Object.values(monthly);
    }

    /* ── KPIs ── */
    const totalRevenue    = filtered.reduce((s, o) => s + (o.total||0), 0);
    const prevRevenue     = prevPeriod.reduce((s, o) => s + (o.total||0), 0);
    const deliveredRev    = filtered.filter(o => o.status==='delivered').reduce((s,o)=>s+(o.total||0),0);
    const avgOrderValue   = filtered.length ? Math.round(totalRevenue / filtered.length) : 0;
    const prevAvgOrder    = prevPeriod.length ? Math.round(prevPeriod.reduce((s,o)=>s+(o.total||0),0) / prevPeriod.length) : 0;
    const totalOrders     = filtered.length;
    const prevOrders      = prevPeriod.length;

    /* ── Repeat customers ── */
    const custMap = {};
    filtered.forEach(o => { custMap[o.email] = (custMap[o.email]||0) + 1; });
    const repeatCustomers = Object.values(custMap).filter(c => c > 1).length;
    const newCustomers    = Object.values(custMap).length;
    const repeatRate      = newCustomers ? Math.round((repeatCustomers / newCustomers) * 100) : 0;

    /* ── Top products ── */
    const productSales = {};
    filtered.forEach(order => {
      (order.items||[]).forEach(item => {
        if (!productSales[item.name]) productSales[item.name] = { qty: 0, revenue: 0, image: item.image };
        productSales[item.name].qty     += item.quantity || 1;
        productSales[item.name].revenue += (item.price||0) * (item.quantity||1);
      });
    });
    const topProducts = Object.entries(productSales).map(([name,d])=>({name,...d})).sort((a,b)=>b.revenue-a.revenue).slice(0,5);

    /* ── Category breakdown ── */
    const catSales = {};
    filtered.forEach(order => {
      (order.items||[]).forEach(item => {
        // find category from products
        const prod = products.find(p => p.name === item.name);
        const cat  = prod?.category || 'Other';
        if (!catSales[cat]) catSales[cat] = 0;
        catSales[cat] += (item.price||0) * (item.quantity||1);
      });
    });
    const categoryBreakdown = Object.entries(catSales).map(([name, value]) => ({ name, value })).sort((a,b)=>b.value-a.value);

    /* ── Orders by status ── */
    const byStatus = {
      pending:    filtered.filter(o=>o.status==='pending').length,
      processing: filtered.filter(o=>o.status==='processing').length,
      shipped:    filtered.filter(o=>o.status==='shipped').length,
      delivered:  filtered.filter(o=>o.status==='delivered').length,
      cancelled:  filtered.filter(o=>o.status==='cancelled').length,
    };

    /* ── Payment method split ── */
    const cod         = filtered.filter(o => o.payment_method === 'cod').length;
    const bankTransfer= filtered.filter(o => o.payment_method !== 'cod').length;

    /* ── City-wise orders ── */
    const cityMap = {};
    filtered.forEach(o => { cityMap[o.city] = (cityMap[o.city]||0) + 1; });
    const topCities = Object.entries(cityMap).map(([city, count]) => ({ city, count })).sort((a,b)=>b.count-a.count).slice(0,8);

    /* ── Hourly order distribution (peak hours) ── */
    const hourly = Array(24).fill(0);
    filtered.forEach(o => { const h = new Date(o.created_at).getHours(); hourly[h]++; });
    const peakHour = hourly.indexOf(Math.max(...hourly));
    const hourlyChart = hourly.map((v, h) => ({ label: h % 3 === 0 ? `${h}:00` : '', value: v }));

    /* ── Cancelled revenue loss ── */
    const cancelledLoss = filtered.filter(o=>o.status==='cancelled').reduce((s,o)=>s+(o.total||0),0);

    return {
      revenueChart, totalRevenue, prevRevenue, deliveredRev, avgOrderValue, prevAvgOrder,
      totalOrders, prevOrders, repeatCustomers, newCustomers, repeatRate,
      topProducts, categoryBreakdown, byStatus, cod, bankTransfer,
      topCities, hourlyChart, peakHour, cancelledLoss, diffDays,
    };
  }, [orders, products, dateFrom, dateTo]);

  /* ── Low stock ── */
  const lowStockProducts = products.filter(p => p.stock <= 5);

  /* ── Export CSV ── */
  const exportOrdersCSV = () => {
    const headers = ['Order ID','Customer','Email','Phone','City','Province','Total','Status','Payment','Date'];
    const rows = orders.map(o => [o.order_id,`${o.first_name} ${o.last_name}`,o.email,o.phone,o.city,o.province,o.total,o.status,o.payment_method==='cod'?'COD':'Bank Transfer',new Date(o.created_at).toLocaleDateString('en-PK')]);
    const csv = [headers,...rows].map(r=>r.map(v=>`"${v}"`).join(',')).join('\n');
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv],{type:'text/csv'})), download: `orders-${Date.now()}.csv` });
    a.click(); showToast('Orders exported!');
  };
  const exportUsersCSV = () => {
    const headers = ['Name','Email','Phone','City','Province','Total Orders','Total Spent','Last Order'];
    const rows = usersData.map(u=>[u.name,u.email,u.phone,u.city,u.province,u.orders.length,u.totalSpent,new Date(u.lastOrder).toLocaleDateString('en-PK')]);
    const csv = [headers,...rows].map(r=>r.map(v=>`"${v}"`).join(',')).join('\n');
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv],{type:'text/csv'})), download: `customers-${Date.now()}.csv` });
    a.click(); showToast('Customers exported!');
  };

  /* ── Filters ── */
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredOrders = orders.filter(o => {
    const q = orderSearch.toLowerCase();
    const matchSearch = !q || o.order_id?.toLowerCase().includes(q) || `${o.first_name} ${o.last_name}`.toLowerCase().includes(q) || o.city?.toLowerCase().includes(q) || o.email?.toLowerCase().includes(q);
    return matchSearch && (orderFilter === 'all' || o.status === orderFilter);
  });
  const filteredUsers = usersData.filter(u => !userSearch || u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()) || u.city.toLowerCase().includes(userSearch.toLowerCase()));

  const stats = {
    totalProducts: products.length,
    totalOrders:   orders.length,
    pendingOrders: orders.filter(o=>o.status==='pending').length,
    revenue:       orders.reduce((s,o)=>s+(o.total||0),0),
    totalCustomers:usersData.length,
    lowStock:      lowStockProducts.length,
  };

  const statusColor = s => ({ pending:'#f59e0b', processing:'#3b82f6', shipped:'#8b5cf6', delivered:'#10b981', cancelled:'#ef4444' }[s] || '#6b7280');
  const statusIcon  = s => ({ pending:<Clock size={13}/>, processing:<RefreshCw size={13}/>, shipped:<Truck size={13}/>, delivered:<CheckCircle2 size={13}/>, cancelled:<XCircle size={13}/> }[s] || null);
  const variantImg  = idx => (formData.images || [])[idx] || '';

  const PRESETS = [
    { label:'7D', val:'7d' }, { label:'14D', val:'14d' }, { label:'30D', val:'30d' },
    { label:'90D', val:'90d' }, { label:'MTD', val:'mtd' }, { label:'YTD', val:'ytd' }, { label:'Custom', val:'custom' },
  ];

  /* ════════════════════════════════ RENDER ════════════════ */
  return (
    <div className="admin-dashboard">

      {toast && (
        <div className={`admin-toast ${toast.type}`}>
          {toast.type==='success' ? <Check size={18}/> : <AlertTriangle size={18}/>}
          {toast.message}
        </div>
      )}

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header"><Package size={28}/><span>Admin Panel</span></div>
        <nav className="admin-nav">
          <button className={`admin-nav-item ${activeTab==='products'?'active':''}`} onClick={()=>setActiveTab('products')}>
            <Package size={20}/> Products
            {lowStockProducts.length > 0 && <span className="admin-badge warning">{lowStockProducts.length}</span>}
          </button>
          <button className={`admin-nav-item ${activeTab==='orders'?'active':''}`} onClick={()=>setActiveTab('orders')}>
            <ShoppingCart size={20}/> Orders
            {stats.pendingOrders > 0 && <span className="admin-badge">{stats.pendingOrders}</span>}
          </button>
          <button className={`admin-nav-item ${activeTab==='users'?'active':''}`} onClick={()=>setActiveTab('users')}>
            <Users size={20}/> Customers
            <span className="admin-badge-count">{stats.totalCustomers}</span>
          </button>
          <button className={`admin-nav-item ${activeTab==='analytics'?'active':''}`} onClick={()=>setActiveTab('analytics')}>
            <BarChart2 size={20}/> Analytics
          </button>
          <button className={`admin-nav-item ${activeTab==='coupons'?'active':''}`} onClick={()=>setActiveTab('coupons')}>
            <Tag size={20}/> Coupons
          </button>
        </nav>
        <button className="admin-logout-btn" onClick={handleLogout}><LogOut size={18}/> Logout</button>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <div className="admin-top-bar">
          <h1>
            {activeTab==='products'  && 'Products'}
            {activeTab==='orders'    && 'Orders'}
            {activeTab==='users'     && 'Customers'}
            {activeTab==='analytics' && 'Analytics'}
            {activeTab==='coupons'   && 'Coupons'}
          </h1>
          <a href="/" target="_blank" className="admin-view-store">View Store →</a>
        </div>

        {/* Global stats strip */}
        <div className="admin-stats">
          <div className="admin-stat-card"><span className="stat-number">{stats.totalProducts}</span><span className="stat-label">Products</span></div>
          <div className="admin-stat-card"><span className="stat-number">{stats.totalOrders}</span><span className="stat-label">Total Orders</span></div>
          <div className="admin-stat-card"><span className="stat-number pending">{stats.pendingOrders}</span><span className="stat-label">Pending</span></div>
          <div className="admin-stat-card"><span className="stat-number">Rs.{stats.revenue.toLocaleString()}</span><span className="stat-label">Revenue</span></div>
          <div className="admin-stat-card"><span className="stat-number blue">{stats.totalCustomers}</span><span className="stat-label">Customers</span></div>
          <div className="admin-stat-card"><span className={`stat-number ${stats.lowStock>0?'red':''}`}>{stats.lowStock}</span><span className="stat-label">Low Stock</span></div>
        </div>

        {/* ══ PRODUCTS ══ */}
        {activeTab==='products' && (
          <div className="admin-section">
            {lowStockProducts.length > 0 && (
              <div className="admin-lowstock-banner">
                <AlertTriangle size={16}/>
                <span><strong>{lowStockProducts.length} product(s)</strong> with low stock (≤5):</span>
                <div className="lowstock-names">
                  {lowStockProducts.map(p => <span key={p.id} className="lowstock-chip" onClick={()=>openEditModal(p)}>{p.name} ({p.stock})</span>)}
                </div>
              </div>
            )}
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
                  <thead><tr><th>Image</th><th>Name</th><th>SKU</th><th>Category</th><th>Price</th><th>Stock</th><th>Tags</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filteredProducts.map(p => (
                      <tr key={p.id}>
                        <td><img src={p.image} alt={p.name} className="admin-product-thumb"/></td>
                        <td><div className="admin-product-name">{p.name}</div><div className="admin-product-id">ID: {p.id}</div></td>
                        <td>{p.sku ? <span className="admin-sku-pill">{p.sku}</span> : <span className="admin-sku-empty">—</span>}</td>
                        <td><span className="admin-category-pill">{p.category}</span></td>
                        <td><div className="admin-price">Rs. {p.price?.toLocaleString()}</div>{p.originalPrice && <div className="admin-original-price">Rs. {p.originalPrice?.toLocaleString()}</div>}</td>
                        <td><span className={`admin-stock ${p.stock<=5?'low':''}`}>{p.stock}</span></td>
                        <td><div className="admin-flags">{p.isNewArrival&&<span className="admin-flag new">New</span>}{p.isPopular&&<span className="admin-flag popular">Popular</span>}</div></td>
                        <td><div className="admin-actions"><button className="admin-edit-btn" onClick={()=>openEditModal(p)}><Pencil size={16}/></button><button className="admin-delete-btn" onClick={()=>setDeleteConfirm(p.id)}><Trash2 size={16}/></button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredProducts.length===0 && <div className="admin-empty">No products found</div>}
              </div>
            )}
          </div>
        )}

        {/* ══ ORDERS ══ */}
        {activeTab==='orders' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <div className="admin-search-box" style={{maxWidth:'280px'}}>
                <Search size={18}/>
                <input placeholder="Search by name, ID, city…" value={orderSearch} onChange={e=>setOrderSearch(e.target.value)}/>
              </div>
              <div className="admin-filter-row">
                <Filter size={16} style={{color:'#6b7280'}}/>
                <select className="admin-status-select" value={orderFilter} onChange={e=>setOrderFilter(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button className="admin-export-btn" onClick={exportOrdersCSV}><Download size={16}/> Export CSV</button>
              </div>
            </div>
            <div className="admin-orders-list">
              {filteredOrders.length===0 ? <div className="admin-empty">No orders found</div> : filteredOrders.map(order=>(
                <div key={order.id} className="admin-order-card">
                  <div className="admin-order-header" onClick={()=>setExpandedOrder(expandedOrder===order.id?null:order.id)}>
                    <div className="admin-order-left">
                      <span className="admin-order-id">{order.order_id}</span>
                      <span className="admin-order-customer">{order.first_name} {order.last_name}</span>
                      <span className="admin-order-city">{order.city}, {order.province}</span>
                    </div>
                    <div className="admin-order-right">
                      <span className="admin-order-total">Rs. {order.total?.toLocaleString()}</span>
                      <span className="admin-order-status" style={{background:statusColor(order.status)+'22',color:statusColor(order.status)}}>{statusIcon(order.status)} {order.status}</span>
                      <select className="admin-status-select" value={order.status} onClick={e=>e.stopPropagation()} onChange={e=>handleOrderStatus(order.id,e.target.value)}>
                        <option value="pending">Pending</option><option value="processing">Processing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option>
                      </select>
                      {expandedOrder===order.id ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                    </div>
                  </div>
                  {expandedOrder===order.id && (
                    <div className="admin-order-details">
                      <div className="admin-order-info-grid">
                        <div><h4>Contact</h4><p><Mail size={12} style={{verticalAlign:'middle',marginRight:4}}/>{order.email}</p><p><PhoneCall size={12} style={{verticalAlign:'middle',marginRight:4}}/>{order.phone}</p></div>
                        <div><h4>Address</h4><p><MapPin size={12} style={{verticalAlign:'middle',marginRight:4}}/>{order.address}</p><p>{order.city}, {order.province} {order.postal_code}</p></div>
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
                        <div className="order-total-row"><span>Total</span><span className="order-total-val">Rs. {order.total?.toLocaleString()}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ CUSTOMERS ══ */}
        {activeTab==='users' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <div className="admin-search-box" style={{maxWidth:'300px'}}>
                <Search size={18}/>
                <input placeholder="Search customers…" value={userSearch} onChange={e=>setUserSearch(e.target.value)}/>
              </div>
              <div className="admin-filter-row">
                <span className="admin-customers-count"><Users size={16}/> {filteredUsers.length} customers</span>
                <button className="admin-export-btn" onClick={exportUsersCSV}><Download size={16}/> Export CSV</button>
              </div>
            </div>
            {usersData.length===0 ? <div className="admin-empty">No customers yet.</div> : (
              <div className="admin-users-list">
                {filteredUsers.map((user,idx)=>(
                  <div key={user.email} className="admin-user-card">
                    <div className="admin-user-header" onClick={()=>setExpandedUser(expandedUser===user.email?null:user.email)}>
                      <div className="admin-user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                      <div className="admin-user-info">
                        <div className="admin-user-name">
                          {user.name}
                          {idx===0 && <span className="vip-badge">⭐ Top Customer</span>}
                          {user.orders.length>=3 && idx!==0 && <span className="repeat-badge"><Repeat2 size={11}/> Repeat</span>}
                        </div>
                        <div className="admin-user-meta">
                          <span><Mail size={12}/> {user.email}</span>
                          <span><PhoneCall size={12}/> {user.phone}</span>
                          <span><MapPin size={12}/> {user.city}, {user.province}</span>
                        </div>
                      </div>
                      <div className="admin-user-stats">
                        <div className="user-stat"><span className="user-stat-val">{user.orders.length}</span><span className="user-stat-label">Orders</span></div>
                        <div className="user-stat"><span className="user-stat-val green">Rs. {user.totalSpent.toLocaleString()}</span><span className="user-stat-label">Spent</span></div>
                        <div className="user-stat"><span className="user-stat-val">Rs. {Math.round(user.totalSpent/user.orders.length).toLocaleString()}</span><span className="user-stat-label">Avg Order</span></div>
                      </div>
                      {expandedUser===user.email ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                    </div>
                    {expandedUser===user.email && (
                      <div className="admin-user-orders">
                        <div className="admin-user-orders-header">
                          <h4>Order History</h4>
                          <span className="user-member-since">Member since {new Date(user.firstOrder).toLocaleDateString('en-PK',{year:'numeric',month:'short'})}</span>
                        </div>
                        <table className="admin-table user-orders-table">
                          <thead><tr><th>Order ID</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
                          <tbody>
                            {user.orders.map(order=>(
                              <tr key={order.id}>
                                <td><span className="admin-order-id">{order.order_id}</span></td>
                                <td><div className="user-order-items-preview">{(order.items||[]).slice(0,3).map((item,i)=><img key={i} src={item.image} alt={item.name} className="user-order-item-thumb" title={item.name}/>)}{order.items?.length>3&&<span className="user-order-items-more">+{order.items.length-3}</span>}</div></td>
                                <td><strong>Rs. {order.total?.toLocaleString()}</strong></td>
                                <td><span className="admin-order-status" style={{background:statusColor(order.status)+'22',color:statusColor(order.status),display:'inline-flex',alignItems:'center',gap:4,fontSize:'0.78rem',padding:'0.2rem 0.6rem',borderRadius:999,fontWeight:700}}>{statusIcon(order.status)} {order.status}</span></td>
                                <td style={{fontSize:'0.82rem',color:'#6b7280'}}>{new Date(order.created_at).toLocaleDateString('en-PK',{month:'short',day:'numeric',year:'numeric'})}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ ANALYTICS ══ */}
        {activeTab==='analytics' && (
          <div className="admin-analytics">

            {/* ── Date Range Toolbar ── */}
            <div className="analytics-toolbar">
              <div className="analytics-presets">
                {PRESETS.map(p => (
                  <button
                    key={p.val}
                    className={`preset-btn ${datePreset===p.val?'active':''}`}
                    onClick={()=>applyPreset(p.val)}
                  >{p.label}</button>
                ))}
              </div>
              <div className="analytics-date-inputs">
                <Calendar size={16} style={{color:'#6b7280',flexShrink:0}}/>
                <input
                  type="date" value={dateFrom} max={dateTo}
                  onChange={e=>{setDateFrom(e.target.value);setDatePreset('custom');}}
                  className="analytics-date-input"
                />
                <span className="date-sep">→</span>
                <input
                  type="date" value={dateTo} min={dateFrom} max={today}
                  onChange={e=>{setDateTo(e.target.value);setDatePreset('custom');}}
                  className="analytics-date-input"
                />
                <span className="analytics-range-label">{analyticsData.diffDays} days</span>
              </div>
            </div>

            {/* ── KPI Cards ── */}
            <div className="analytics-kpi-row">
              <div className="analytics-kpi-card">
                <div className="kpi-icon" style={{background:'#ede9fe'}}><Activity size={22} color="#7c3aed"/></div>
                <div className="kpi-body">
                  <div className="kpi-value">Rs. {analyticsData.totalRevenue.toLocaleString()}</div>
                  <div className="kpi-label">Total Revenue</div>
                  <Trend current={analyticsData.totalRevenue} previous={analyticsData.prevRevenue}/>
                </div>
              </div>
              <div className="analytics-kpi-card">
                <div className="kpi-icon" style={{background:'#dcfce7'}}><CheckCircle2 size={22} color="#16a34a"/></div>
                <div className="kpi-body">
                  <div className="kpi-value">Rs. {analyticsData.deliveredRev.toLocaleString()}</div>
                  <div className="kpi-label">Confirmed Revenue</div>
                </div>
              </div>
              <div className="analytics-kpi-card">
                <div className="kpi-icon" style={{background:'#fef9c3'}}><ShoppingBag size={22} color="#ca8a04"/></div>
                <div className="kpi-body">
                  <div className="kpi-value">{analyticsData.totalOrders}</div>
                  <div className="kpi-label">Orders</div>
                  <Trend current={analyticsData.totalOrders} previous={analyticsData.prevOrders}/>
                </div>
              </div>
              <div className="analytics-kpi-card">
                <div className="kpi-icon" style={{background:'#dbeafe'}}><DollarSign size={22} color="#2563eb"/></div>
                <div className="kpi-body">
                  <div className="kpi-value">Rs. {analyticsData.avgOrderValue.toLocaleString()}</div>
                  <div className="kpi-label">Avg Order Value</div>
                  <Trend current={analyticsData.avgOrderValue} previous={analyticsData.prevAvgOrder}/>
                </div>
              </div>
              <div className="analytics-kpi-card">
                <div className="kpi-icon" style={{background:'#fce7f3'}}><Repeat2 size={22} color="#db2777"/></div>
                <div className="kpi-body">
                  <div className="kpi-value">{analyticsData.repeatRate}%</div>
                  <div className="kpi-label">Repeat Customer Rate</div>
                </div>
              </div>
              <div className="analytics-kpi-card">
                <div className="kpi-icon" style={{background:'#fee2e2'}}><Target size={22} color="#ef4444"/></div>
                <div className="kpi-body">
                  <div className="kpi-value">Rs. {analyticsData.cancelledLoss.toLocaleString()}</div>
                  <div className="kpi-label">Cancelled Loss</div>
                </div>
              </div>
            </div>

            {/* ── Revenue Chart (full width) ── */}
            <div className="analytics-card full-width">
              <div className="analytics-card-header">
                <h3>
                  <TrendingUp size={17} style={{verticalAlign:'middle',marginRight:6,color:'#6366f1'}}/>
                  Revenue Over Time
                </h3>
                <span className="chart-sub">Rs. {analyticsData.totalRevenue.toLocaleString()} total</span>
              </div>
              <ProBarChart data={analyticsData.revenueChart} color="#6366f1" height={200}/>
            </div>

            {/* ── Mid Row ── */}
            <div className="analytics-mid-row">

              {/* Orders by Status — Donut */}
              <div className="analytics-card">
                <div className="analytics-card-header">
                  <h3><ShoppingCart size={16} style={{verticalAlign:'middle',marginRight:6,color:'#f59e0b'}}/> Orders by Status</h3>
                </div>
                <div style={{padding:'1rem 1.25rem'}}>
                  <DonutChart segments={[
                    {label:'Pending',    value:analyticsData.byStatus.pending,    color:'#f59e0b'},
                    {label:'Processing', value:analyticsData.byStatus.processing, color:'#3b82f6'},
                    {label:'Shipped',    value:analyticsData.byStatus.shipped,    color:'#8b5cf6'},
                    {label:'Delivered',  value:analyticsData.byStatus.delivered,  color:'#10b981'},
                    {label:'Cancelled',  value:analyticsData.byStatus.cancelled,  color:'#ef4444'},
                  ]}/>
                </div>
              </div>

              {/* Payment Method Split */}
              <div className="analytics-card">
                <div className="analytics-card-header">
                  <h3><CreditCard size={16} style={{verticalAlign:'middle',marginRight:6,color:'#10b981'}}/> Payment Methods</h3>
                </div>
                <div style={{padding:'1rem 1.25rem'}}>
                  <DonutChart segments={[
                    {label:'Cash on Delivery', value:analyticsData.cod,          color:'#f59e0b'},
                    {label:'Bank Transfer',    value:analyticsData.bankTransfer, color:'#3b82f6'},
                  ]}/>
                </div>
              </div>

              {/* Peak Hours */}
              <div className="analytics-card">
                <div className="analytics-card-header">
                  <h3><Clock size={16} style={{verticalAlign:'middle',marginRight:6,color:'#8b5cf6'}}/> Peak Order Hours</h3>
                  <span className="chart-sub">Peak: {analyticsData.peakHour}:00</span>
                </div>
                <ProBarChart data={analyticsData.hourlyChart} color="#8b5cf6" height={120} showValues={false}/>
              </div>
            </div>

            {/* ── Bottom Row ── */}
            <div className="analytics-bottom-row">

              {/* Top Products */}
              <div className="analytics-card wide">
                <div className="analytics-card-header">
                  <h3><Award size={16} style={{verticalAlign:'middle',marginRight:6,color:'#f59e0b'}}/> Top Selling Products</h3>
                </div>
                {analyticsData.topProducts.length===0 ? <div className="admin-empty">No sales data yet</div> : (
                  <div className="top-products-list">
                    {analyticsData.topProducts.map((p,i)=>{
                      const maxRev = analyticsData.topProducts[0]?.revenue || 1;
                      return (
                        <div key={p.name} className="top-product-row">
                          <span className={`top-rank ${i===0?'gold':i===1?'silver':i===2?'bronze':''}`}>#{i+1}</span>
                          {p.image && <img src={p.image} alt={p.name} className="top-product-img"/>}
                          <div className="top-product-info">
                            <span className="top-product-name">{p.name}</span>
                            <div className="top-product-bar-wrap">
                              <div className="top-product-bar" style={{width:`${(p.revenue/maxRev)*100}%`}}/>
                            </div>
                            <span className="top-product-qty">{p.qty} units sold</span>
                          </div>
                          <span className="top-product-revenue">Rs. {p.revenue.toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* City Breakdown */}
              <div className="analytics-card">
                <div className="analytics-card-header">
                  <h3><MapPin size={16} style={{verticalAlign:'middle',marginRight:6,color:'#ef4444'}}/> Top Cities</h3>
                </div>
                <div className="city-breakdown">
                  {analyticsData.topCities.length===0 ? <div className="admin-empty" style={{padding:'1.5rem'}}>No data</div> :
                    analyticsData.topCities.map((c,i)=>{
                      const max = analyticsData.topCities[0]?.count || 1;
                      return (
                        <div key={c.city} className="city-row">
                          <span className="city-rank">#{i+1}</span>
                          <span className="city-name">{c.city}</span>
                          <div className="status-bar-wrap">
                            <div className="status-bar-fill" style={{width:`${(c.count/max)*100}%`,background:'#ef4444'}}/>
                          </div>
                          <span className="city-count">{c.count}</span>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            </div>

            {/* ── Category Revenue ── */}
            {analyticsData.categoryBreakdown.length > 0 && (
              <div className="analytics-card full-width">
                <div className="analytics-card-header">
                  <h3><Package size={16} style={{verticalAlign:'middle',marginRight:6,color:'#10b981'}}/> Revenue by Category</h3>
                </div>
                <div className="city-breakdown" style={{padding:'0.5rem 1.25rem 1rem'}}>
                  {analyticsData.categoryBreakdown.map((c,i)=>{
                    const max = analyticsData.categoryBreakdown[0]?.value || 1;
                    const colors = ['#10b981','#3b82f6','#f59e0b','#8b5cf6','#ef4444'];
                    return (
                      <div key={c.name} className="city-row">
                        <span className="city-name" style={{fontWeight:700,width:80}}>{c.name}</span>
                        <div className="status-bar-wrap">
                          <div className="status-bar-fill" style={{width:`${(c.value/max)*100}%`,background:colors[i%colors.length]}}/>
                        </div>
                        <span className="city-count" style={{width:130,textAlign:'right'}}>Rs. {c.value.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Summary Table ── */}
            <div className="analytics-card full-width">
              <div className="analytics-card-header">
                <h3><Banknote size={16} style={{verticalAlign:'middle',marginRight:6,color:'#6366f1'}}/> Period Summary</h3>
                <span className="chart-sub">{new Date(dateFrom).toLocaleDateString('en-PK',{day:'numeric',month:'short',year:'numeric'})} — {new Date(dateTo).toLocaleDateString('en-PK',{day:'numeric',month:'short',year:'numeric'})}</span>
              </div>
              <div className="summary-grid">
                <div className="summary-item"><span className="summary-label">Total Orders</span><span className="summary-val">{analyticsData.totalOrders}</span></div>
                <div className="summary-item"><span className="summary-label">Total Revenue</span><span className="summary-val">Rs. {analyticsData.totalRevenue.toLocaleString()}</span></div>
                <div className="summary-item"><span className="summary-label">Delivered</span><span className="summary-val">{analyticsData.byStatus.delivered}</span></div>
                <div className="summary-item"><span className="summary-label">Confirmed Revenue</span><span className="summary-val">Rs. {analyticsData.deliveredRev.toLocaleString()}</span></div>
                <div className="summary-item"><span className="summary-label">Cancelled</span><span className="summary-val red">{analyticsData.byStatus.cancelled}</span></div>
                <div className="summary-item"><span className="summary-label">Revenue Lost</span><span className="summary-val red">Rs. {analyticsData.cancelledLoss.toLocaleString()}</span></div>
                <div className="summary-item"><span className="summary-label">Avg Order Value</span><span className="summary-val">Rs. {analyticsData.avgOrderValue.toLocaleString()}</span></div>
                <div className="summary-item"><span className="summary-label">Unique Customers</span><span className="summary-val">{analyticsData.newCustomers}</span></div>
                <div className="summary-item"><span className="summary-label">Repeat Customers</span><span className="summary-val">{analyticsData.repeatCustomers}</span></div>
                <div className="summary-item"><span className="summary-label">Repeat Rate</span><span className="summary-val">{analyticsData.repeatRate}%</span></div>
                <div className="summary-item"><span className="summary-label">COD Orders</span><span className="summary-val">{analyticsData.cod}</span></div>
                <div className="summary-item"><span className="summary-label">Bank Transfer</span><span className="summary-val">{analyticsData.bankTransfer}</span></div>
              </div>
            </div>

          </div>
        )}

        {/* ══ COUPONS ══ */}
        {activeTab==='coupons' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2 style={{fontSize:'1.1rem',fontWeight:700,color:'var(--primary,#111827)'}}>
                <Tag size={18} style={{verticalAlign:'middle',marginRight:6}}/>
                Coupon Codes
              </h2>
              <button className="admin-add-btn" onClick={openAddCoupon}><Plus size={18}/> Create Coupon</button>
            </div>

            {coupons.length === 0 ? (
              <div className="admin-empty">No coupons yet. Create your first one!</div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Type</th>
                      <th>Discount</th>
                      <th>Min Order</th>
                      <th>Uses</th>
                      <th>Expires</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map(c => (
                      <tr key={c.id}>
                        <td><span className="coupon-admin-code">{c.code}</span></td>
                        <td><span className="admin-category-pill">{c.type === 'percentage' ? 'Percentage' : 'Fixed'}</span></td>
                        <td><strong>{c.type === 'percentage' ? `${c.value}%` : `Rs. ${c.value.toLocaleString()}`}</strong></td>
                        <td>{c.min_order > 0 ? `Rs. ${c.min_order.toLocaleString()}` : <span style={{color:'#9ca3af'}}>None</span>}</td>
                        <td>
                          <span className="coupon-uses">
                            {c.used_count}
                            {c.max_uses ? ` / ${c.max_uses}` : ' / ∞'}
                          </span>
                        </td>
                        <td style={{fontSize:'0.82rem',color:'#6b7280'}}>
                          {c.expires_at ? new Date(c.expires_at).toLocaleDateString('en-PK',{day:'numeric',month:'short',year:'numeric'}) : <span style={{color:'#9ca3af'}}>No expiry</span>}
                        </td>
                        <td>
                          <button
                            className={`coupon-toggle-btn ${c.is_active ? 'active' : 'inactive'}`}
                            onClick={() => toggleCouponActive(c)}
                          >
                            {c.is_active ? <><Check size={13}/> Active</> : <><X size={13}/> Disabled</>}
                          </button>
                        </td>
                        <td>
                          <div className="admin-actions">
                            <button className="admin-edit-btn" onClick={() => openEditCoupon(c)}><Pencil size={16}/></button>
                            <button className="admin-delete-btn" onClick={() => setDelCoupon(c.id)}><Trash2 size={16}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ══ ADD / EDIT MODAL ══ */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={e=>e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingProduct?'Edit Product':'Add New Product'}</h2>
              <button onClick={closeModal}><X size={22}/></button>
            </div>
            <div className="admin-modal-body">
              {!editingProduct && (
                <div className="admin-form-row">
                  <div className="admin-form-group"><label>Product ID *</label><input name="id" value={formData.id} onChange={handleFormChange} placeholder="e.g. 9"/></div>
                  <div className="admin-form-group"><label>SKU <span className="label-hint">(optional)</span></label><input name="sku" value={formData.sku} onChange={handleFormChange} placeholder="e.g. TSH-BLK-001"/></div>
                </div>
              )}
              {editingProduct && (
                <div className="admin-form-row">
                  <div className="admin-form-group"><label>SKU <span className="label-hint">(optional)</span></label><input name="sku" value={formData.sku} onChange={handleFormChange} placeholder="e.g. TSH-BLK-001"/></div>
                </div>
              )}
              <div className="admin-form-row">
                <div className="admin-form-group full"><label>Product Name *</label><input name="name" value={formData.name} onChange={handleFormChange} placeholder="Product name"/></div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group full"><label>Description</label><textarea name="description" value={formData.description} onChange={handleFormChange} rows={3} placeholder="Product description"/></div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group"><label>Price (Rs.) *</label><input type="number" name="price" value={formData.price} onChange={handleFormChange} placeholder="1500"/></div>
                <div className="admin-form-group"><label>Original Price (Rs.)</label><input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleFormChange} placeholder="2000"/></div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group"><label>Category *</label><select name="category" value={formData.category} onChange={handleFormChange}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></div>
                <div className="admin-form-group"><label>Color</label><input name="color" value={formData.color} onChange={handleFormChange} placeholder="Black, White…"/></div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group"><label>Stock</label><input type="number" name="stock" value={formData.stock} onChange={handleFormChange} placeholder="10"/></div>
                <div className="admin-form-group"><label>Rating</label><input type="number" name="rating" value={formData.rating} onChange={handleFormChange} step="0.1" min="1" max="5" placeholder="4.5"/></div>
              </div>
              <div className="admin-images-section">
                <div className="admin-images-label"><Upload size={16}/><span>Product Images</span></div>
                <div className="admin-images-grid">
                  <ImageUploadBox label="Main Image *" value={formData.image} uploading={!!uploading['main']} onChange={f=>handleImageUpload(f,'main')}/>
                  {[0,1,2].map(idx=><ImageUploadBox key={idx} label={`Variant ${idx+1}`} value={variantImg(idx)} uploading={!!uploading[`v${idx}`]} onChange={f=>handleImageUpload(f,`v${idx}`)}/>)}
                </div>
                <p className="admin-images-hint">Upload from your device. Main image required. Variants optional.</p>
              </div>
              <div className="admin-form-group" style={{marginBottom:'0.75rem'}}>
                <label>Sizes *</label>
                <div className="admin-size-selector">
                  {ALL_SIZES.map(s=><button key={s} type="button" className={`admin-size-btn ${formData.sizes.includes(s)?'active':''}`} onClick={()=>toggleSize(s)}>{s}</button>)}
                </div>
              </div>
              <div className="admin-form-row" style={{marginBottom:'0.5rem'}}>
                <label className="admin-checkbox-label"><input type="checkbox" name="isNewArrival" checked={formData.isNewArrival} onChange={handleFormChange}/> New Arrival</label>
                <label className="admin-checkbox-label"><input type="checkbox" name="isPopular" checked={formData.isPopular} onChange={handleFormChange}/> Popular</label>
              </div>
              {formError && <div className="admin-form-error">{formError}</div>}
            </div>
            <div className="admin-modal-footer">
              <button className="admin-cancel-btn" onClick={closeModal}>Cancel</button>
              <button className="admin-save-btn" onClick={handleSave} disabled={saving}>{saving?'Saving…':editingProduct?'Update Product':'Add Product'}</button>
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

      {/* ══ COUPON MODAL ══ */}
      {couponModal && (
        <div className="admin-modal-overlay" onClick={closeCouponModal}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{maxWidth:480}}>
            <div className="admin-modal-header">
              <h2><Tag size={18} style={{verticalAlign:'middle',marginRight:6}}/>{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</h2>
              <button onClick={closeCouponModal}><X size={22}/></button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-row">
                <div className="admin-form-group full">
                  <label>Coupon Code *</label>
                  <input
                    value={couponForm.code}
                    onChange={e => setCouponForm(p => ({...p, code: e.target.value.toUpperCase()}))}
                    placeholder="e.g. SAVE20"
                    style={{letterSpacing:'0.06em',fontWeight:700}}
                    disabled={!!editingCoupon}
                  />
                  {editingCoupon && <span style={{fontSize:'0.75rem',color:'#9ca3af',marginTop:'0.2rem',display:'block'}}>Code cannot be changed after creation</span>}
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Discount Type *</label>
                  <select value={couponForm.type} onChange={e => setCouponForm(p => ({...p, type: e.target.value}))}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (Rs.)</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>{couponForm.type === 'percentage' ? 'Discount %' : 'Discount Amount (Rs.)'} *</label>
                  <input
                    type="number"
                    value={couponForm.value}
                    onChange={e => setCouponForm(p => ({...p, value: e.target.value}))}
                    placeholder={couponForm.type === 'percentage' ? '20' : '200'}
                    min="1"
                    max={couponForm.type === 'percentage' ? '100' : undefined}
                  />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Min Order Amount (Rs.)</label>
                  <input
                    type="number"
                    value={couponForm.min_order}
                    onChange={e => setCouponForm(p => ({...p, min_order: e.target.value}))}
                    placeholder="0 = no minimum"
                    min="0"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Max Uses</label>
                  <input
                    type="number"
                    value={couponForm.max_uses}
                    onChange={e => setCouponForm(p => ({...p, max_uses: e.target.value}))}
                    placeholder="Leave empty = unlimited"
                    min="1"
                  />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Expiry Date</label>
                  <input
                    type="date"
                    value={couponForm.expires_at}
                    onChange={e => setCouponForm(p => ({...p, expires_at: e.target.value}))}
                  />
                </div>
                <div className="admin-form-group" style={{display:'flex',alignItems:'center',paddingTop:'1.5rem'}}>
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={couponForm.is_active}
                      onChange={e => setCouponForm(p => ({...p, is_active: e.target.checked}))}
                    />
                    Active (customers can use this)
                  </label>
                </div>
              </div>
              {couponFormErr && <div className="admin-form-error">{couponFormErr}</div>}
            </div>
            <div className="admin-modal-footer">
              <button className="admin-cancel-btn" onClick={closeCouponModal}>Cancel</button>
              <button className="admin-save-btn" onClick={handleCouponSave} disabled={savingCoupon}>
                {savingCoupon ? 'Saving…' : editingCoupon ? 'Update Coupon' : 'Create Coupon'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Coupon delete confirm */}
      {delCoupon && (
        <div className="admin-modal-overlay" onClick={() => setDelCoupon(null)}>
          <div className="admin-confirm-modal" onClick={e => e.stopPropagation()}>
            <AlertTriangle size={40} className="confirm-icon"/>
            <h3>Delete Coupon?</h3>
            <p>This cannot be undone.</p>
            <div className="confirm-actions">
              <button className="admin-cancel-btn" onClick={() => setDelCoupon(null)}>Cancel</button>
              <button className="admin-delete-confirm-btn" onClick={() => handleDeleteCoupon(delCoupon)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
