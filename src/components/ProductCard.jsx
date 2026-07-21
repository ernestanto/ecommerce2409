import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectCart } from '../features/cartSlice';
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);

  const [selectedQty, setSelectedQty] = useState(1);
  const [addedStatus, setAddedStatus] = useState(false);

  const cartItem = cart.find((item) => item.id === product.id);
  const currentQty = cartItem?.quantity || 0;

  const imageUrl =
    product.image ||
    (product.images?.length > 0 && product.images[0]) ||
    'https://via.placeholder.com/200?text=No+Image';

  const productTitle = product.title || product.name || 'Untitled Product';

 const handleAddToCart = () => {
  dispatch(addToCart({ ...product, quantity: selectedQty }));

  setAddedStatus(true);
  setTimeout(() => setAddedStatus(false), 2000);
};

  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
    <div className="product-card">
      <img src={imageUrl} alt={productTitle} className="product-image" />
      <h3 className="product-title">{productTitle}</h3>
      <p className="product-price">${product.price}</p>

      <div className="dropdown-section">
        <label htmlFor={`qty-${product.id}`}>Qty:</label>
        <select
          id={`qty-${product.id}`}
          value={selectedQty}
          onChange={(e) => setSelectedQty(Number(e.target.value))}
          className="qty-dropdown"
        >
          {[...Array(15)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>

      <button className="add-to-cart-btn" onClick={handleAddToCart}>
        {addedStatus ? '✔ Added to Cart' : 'Add to Cart'}
      </button>

      {/* Scoped styles */}
      <style jsx="true">{`
        .product-card {
          border: 1px solid #eee;
          border-radius: 10px;
          padding: 1rem;
          width: 100%;
          max-width: 250px;
          background-color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s ease;
        }

        .product-card:hover {
          transform: translateY(-4px);
        }

        .product-image {
          width: 180px;
          height: 180px;
          object-fit: contain;
          margin-bottom: 0.8rem;
        }

        .product-title {
          font-size: 1rem;
          text-align: center;
          font-weight: 600;
          margin: 0.5rem 0;
        }

        .product-price {
          font-weight: 600;
          color: #2e7d32;
          margin-bottom: 0.8rem;
        }

        .dropdown-section {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          gap: 0.5rem;
        }

        .qty-dropdown {
          padding: 0.4rem 0.6rem;
          font-size: 1rem;
          border-radius: 4px;
          border: 1px solid #ccc;
          background-color: #fafafa;
        }

        .add-to-cart-btn {
          background-color: #1e88e5;
          color: white;
          padding: 0.6rem 1rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          width: 100%;
        }

        .add-to-cart-btn:hover {
          background-color: #1565c0;
        }

        @media (max-width: 768px) {
          .product-card {
            max-width: 100%;
            margin: 0 auto;
          }
        }
      `}</style>
    </div>
    </Link>
  );
};

export default ProductCard;
