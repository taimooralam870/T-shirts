import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import './Shop.css';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products: allProducts, loading } = useProducts();
  
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  
  // Filters state
  const [category, setCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState('All');
  const [size, setSize] = useState('All');
  const [sort, setSort] = useState('popular');
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const categories = ['All', 'Men', 'Women', 'Unisex'];
  const sizes = ['All', 'S', 'M', 'L', 'XL'];
  const priceRanges = [
    { label: 'All', min: 0, max: 100000 },
    { label: 'Under Rs. 1500', min: 0, max: 1500 },
    { label: 'Rs. 1500 - Rs. 2500', min: 1500, max: 2500 },
    { label: 'Over Rs. 2500', min: 2500, max: 100000 }
  ];

  // Derived Trending Picks
  const trendingPicks = useMemo(() => {
    return [...allProducts]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3); // Top 3 rated
  }, [allProducts]);

  useEffect(() => {
    // Update local state when URL params change
    const urlCategory = searchParams.get('category');
    const urlSearch = searchParams.get('search');
    if (urlCategory) setCategory(urlCategory);
    if (urlSearch !== null) setSearchQuery(urlSearch);
  }, [searchParams]);

  useEffect(() => {
    let filtered = [...allProducts];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (category !== 'All') {
      filtered = filtered.filter(p => p.category === category);
    }

    // Size filter
    if (size !== 'All') {
      filtered = filtered.filter(p => p.sizes.includes(size));
    }

    // Price filter
    if (priceRange !== 'All') {
      const range = priceRanges.find(r => r.label === priceRange);
      if (range) {
        filtered = filtered.filter(p => p.price >= range.min && p.price < range.max);
      }
    }

    // Sorting
    switch (sort) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNewArrival === a.isNewArrival ? 0 : b.isNewArrival ? 1 : -1));
        break;
      case 'popular':
      default:
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    setProducts(filtered);
  }, [category, priceRange, size, sort, searchQuery, allProducts]);

  const clearFilters = () => {
    setCategory('All');
    setPriceRange('All');
    setSize('All');
    setSearchQuery('');
    setSort('popular');
    setSearchParams({});
  };

  const activeFiltersCount = (priceRange !== 'All' ? 1 : 0) + (size !== 'All' ? 1 : 0);

  return (
    <div className="shop-page">
      {/* Hero / Header Section */}
      <div className="shop-header-container container">
        <h1 className="shop-title">The Collection</h1>
        <p className="shop-subtitle">Discover our latest arrivals and timeless classics.</p>
        {searchQuery && <p className="search-results-text">Search results for "{searchQuery}"</p>}
      </div>

      {/* Trending Picks Section */}
      {!searchQuery && category === 'All' && (
        <section className="trending-section container">
          <h2 className="section-title">Trending Now</h2>
          <div className="trending-grid">
            {trendingPicks.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Filter Bar */}
      <div className="sticky-filter-bar">
        <div className="container filter-bar-inner">
          {/* Categories Pills */}
          <div className="category-pills">
            {categories.map(c => (
              <button 
                key={c}
                className={`pill-btn ${category === c ? 'active' : ''}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Inline Filters */}
          <div className="inline-filters">
            <div className="filter-dropdown">
              <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                <option value="All">Price: All</option>
                {priceRanges.filter(r => r.label !== 'All').map(r => (
                  <option key={r.label} value={r.label}>{r.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="dropdown-icon" />
            </div>

            <div className="filter-dropdown">
              <select value={size} onChange={(e) => setSize(e.target.value)}>
                <option value="All">Size: All</option>
                {sizes.filter(s => s !== 'All').map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown size={14} className="dropdown-icon" />
            </div>

            <div className="filter-dropdown sort-dropdown">
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="popular">Sort: Popular</option>
                <option value="newest">Sort: Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown size={14} className="dropdown-icon" />
            </div>
            
            {activeFiltersCount > 0 && (
              <button className="clear-filters-text" onClick={clearFilters}>
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <main className="shop-main container">
        <div className="results-header">
          <p className="results-count">{products.length} Products</p>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading products...</div>
        ) : products.length > 0 ? (
          <div className="product-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-content">
              <h3>No products found</h3>
              <p>Try adjusting your filters or searching for something else.</p>
              <button className="btn btn-primary mt-4" onClick={clearFilters}>Clear All Filters</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Shop;
