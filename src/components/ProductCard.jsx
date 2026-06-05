import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-image-link">
        <div className="product-image-container">
          <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
          {product.isNewArrival && <span className="product-badge">New</span>}
          {discount > 0 && !product.isNewArrival && (
            <span className="product-badge sale">-{discount}%</span>
          )}
          <div className="product-quick-action">View Product</div>
        </div>
      </Link>
      <div className="product-card-info">
        <div className="product-header">
          <h3 className="product-title">
            <Link to={`/product/${product.id}`}>{product.name}</Link>
          </h3>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <span className="product-price">Rs. {product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="product-original-price" style={{ display: 'block' }}>
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
        <p className="product-category">{product.category}</p>
        <div className="product-rating">
          <Star className="star-icon" size={13} />
          <span>{product.rating}</span>
          <span className="text-muted">({product.reviews})</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
