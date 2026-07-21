import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { addToCart } from '../features/cartSlice';
import { saveCartItem } from '../services/firebaseCartService';
import { useParams } from "react-router-dom";
import { fetchProducts } from '../features/productsSlice';
import { Link } from "react-router-dom";

const Product = ({ user }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.products);

  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [selectedQty, setSelectedQty] = useState(1);
  const [addedStatus, setAddedStatus] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
  setCurrentImageIndex((prevIndex) =>
    prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
  );
};

const handleNextImage = () => {
  setCurrentImageIndex((prevIndex) =>
    prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
  );
};

  console.log("🟡 useParams id =>", id);

  // 🔁 Fetch products into Redux store if empty
  useEffect(() => {
    if (items.length === 0) {
      console.log("🟠 Dispatching fetchProducts...");
      dispatch(fetchProducts());
    } else {
      console.log("✅ Products already in store:", items);
    }
  }, [dispatch, items.length]);

  // 🛍️ Suggested products fetch (independent)
  useEffect(() => {
    const fetchSuggested = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'products'));
        const allProducts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        const filtered = allProducts.filter(p => p.id !== id);
        const shuffled = filtered.sort(() => 0.5 - Math.random());
        setSuggestedProducts(shuffled.slice(0, 30));
        console.log("🟦 Suggested Products:", shuffled.slice(0, 30));
      } catch (error) {
        console.error('Error fetching suggested products:', error);
      }
    };

    fetchSuggested();
  }, [id]);

  // ✅ Logic BELOW hooks
  const product = items.find((p) => String(p.id) === String(id));

  // 🛑 Conditional returns BELOW all hooks
  if (!items || items.length === 0) {
    return <p>Loading product details...</p>;
  }

  if (!product) {
    console.log("❌ Product not found with id:", id);
    return <p>Product not found.</p>;
  }

  console.log("🟢 Product found:", product);

  


  

  // ✅ Safe access AFTER product is confirmed
  const imageUrl = product.images?.[0] || "https://via.placeholder.com/150";
  const handleAddToCart = async () => {
    const cartItem = {
      id: product.id,
      name: product.title || product.name,
      image: imageUrl,
      price: Number(product.price),
      quantity: selectedQty,
    };

    dispatch(addToCart(cartItem));
    setAddedStatus(true);
    setTimeout(() => setAddedStatus(false), 2000);

    try {
      if (user?.uid) {
        await saveCartItem(user.uid, cartItem);
      }
    } catch (error) {
      console.error('Error saving to Firestore:', error);
    }
  };

  


return (
  <div
    style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    }}
  >
    {/* Wrap Section 1 & 2 for center alignment */}
    <div
  style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh', // Ensures it takes full viewport height
    width: '100%',
    padding: '20px', // Optional: for spacing on small screens
    boxSizing: 'border-box', // Ensures padding doesn't break layout
    marginLeft:'190px',
  }}
>
      {/* 🔍 Section 1: Product Image Slider */}
      <div style={{ width: '100%', maxWidth: '600px', marginBottom: '2rem' }}>
        {product.images?.length > 0 ? (
          <div style={{ position: 'relative', width: '100%' }}>
            <img
              src={product.images[currentImageIndex]}
              alt={product.title || product.name}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '6px',
                objectFit: 'cover',
              }}
            />
            <button
              onClick={handlePrevImage}
              style={{
                position: 'absolute',
                top: '50%',
                left: '10px',
                transform: 'translateY(-50%)',
                backgroundColor: '#00000080',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                padding: '5px 10px',
                cursor: 'pointer',
              }}
            >
              ‹
            </button>
            <button
              onClick={handleNextImage}
              style={{
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                backgroundColor: '#00000080',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                padding: '5px 10px',
                cursor: 'pointer',
              }}
            >
              ›
            </button>
          </div>
        ) : (
          <div
            style={{
              width: '100%',
              height: '300px',
              backgroundColor: '#eee',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '4px',
            }}
          >
            No Image
          </div>
        )}
      </div>

      {/* 🧾 Section 2: Product Details */}
      <div style={{ width: '100%', maxWidth: '600px', marginBottom: '3rem' }}>
        <h2>{product.title || product.name}</h2>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
          ₹{Number(product.price).toFixed(2)}
        </p>

        <div style={{ margin: '1rem 0' }}>
          <label htmlFor={`qty-${product.id}`}>Quantity: </label>
          <select
            id={`qty-${product.id}`}
            value={selectedQty}
            onChange={(e) => setSelectedQty(Number(e.target.value))}
            style={{ padding: '4px 8px', marginLeft: '10px' }}
          >
            {[...Array(15)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAddToCart}
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          {addedStatus ? '✔ Added to Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>

    {/* ❤️ Section 3: You Might Also Like */}
    <div style={{ textAlign: 'center', marginTop: '20px',marginLeft:'290px', }}>
      <h3>You might also like</h3>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          marginTop: '20px',
          
        }}
      >
        {suggestedProducts.map((item) => (
          <Link
              key={item.id}
              to={`/product/${item.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
          <div
            key={item.id}
            style={{
              width: '150px',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              textAlign: 'center',
              backgroundColor: '#f9f9f9',
            }}
          >
            <img
              src={item.images?.[0] || '/placeholder.png'}
              alt={item.title || item.name}
              style={{
                width: '100%',
                height: '150px',
                objectFit: 'cover',
                borderRadius: '6px',
              }}
            />
            <h4 style={{ marginTop: '10px', fontSize: '1rem' }}>
              {item.title || item.name}
            </h4>
            <p style={{ fontWeight: 'bold' }}>
              ₹{Number(item.price).toFixed(2)}
            </p>
          </div>
          </Link>
        ))}
      </div>
    </div>
  </div>
);

};

export default Product;
