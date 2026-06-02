import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-card-image-link">
        <div className="product-image-container">
          <img src={product.image} alt={product.name} className="product-image" />
          {product.isNewArrival && <span className="product-badge new">New</span>}
        </div>
      </Link>
      <div className="product-card-info">
        <div className="product-header">
          <h3 className="product-title">
            <Link to={`/product/${product.id}`}>{product.name}</Link>
          </h3>
          <span className="product-price">Rs. {product.price.toLocaleString()}</span>
        </div>
        <p className="product-category">{product.category}</p>
        <div className="product-rating">
          <Star className="star-icon" size={16} />
          <span>{product.rating}</span>
          <span className="text-muted">({product.reviews})</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
