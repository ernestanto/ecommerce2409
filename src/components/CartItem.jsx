import React from 'react';
import { useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../features/cartSlice';
import { Link } from "react-router-dom";


const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleQuantityChange = (e) => {
    dispatch(updateQuantity({
      id: item.id,
      quantity: Number(e.target.value),
    }));
  };

  const imageUrl =
    item.image ||
    (item.images?.length > 0 && item.images[0]) ||
    'https://via.placeholder.com/150?text=No+Image';

  return (
    <Link
    key={item.id}
    to={`/product/${item.id}`}
    style={{ textDecoration: "none", color: "inherit" }}
  >
    
    <div className="cart-item">
      <img src={imageUrl} alt={item.name || item.title} className="item-image" />

      <div className="item-details">
        <h4>{item.name || item.title}</h4>
        <p className="unit-price">
  Unit Price: ${Number(item.price || 0).toFixed(2)}
</p>


        <div className="qty-row">
          <label htmlFor={`qty-${item.id}`}>Qty:</label>
          <select
            id={`qty-${item.id}`}
            value={item.quantity}
            onChange={handleQuantityChange}
          >
            {[...Array(15)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

       <p className="total">
  Total: ${(item.quantity * Number(item.price || 0)).toFixed(2)}
</p>

      </div>

      <button className="remove-button" onClick={() => dispatch(removeFromCart(item.id))}>
        Remove product
      </button>

      <style jsx="true">{`
        .cart-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          background-color: #f9f9f9;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .item-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 6px;
        }

        .item-details {
          flex: 1;
        }

        h4 {
          margin: 0;
          font-size: 1rem;
          color: #333;
        }

        .unit-price,
        .total {
          margin: 0.4rem 0;
          color: #444;
        }

        .qty-row {
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        select {
          padding: 0.3rem 0.5rem;
          font-size: 1rem;
        }

        .remove-button {
          background-color: #e53935;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        }

        .remove-button:hover {
          background-color: #c62828;
        }

        @media (max-width: 600px) {
          .cart-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .remove-button {
            width: 100%;
            margin-top: 0.5rem;
          }
        }
      `}</style>
    </div>
    </Link>
    
  );
};

export default CartItem;


