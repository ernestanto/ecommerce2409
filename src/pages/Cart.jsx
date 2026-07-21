import React, { useEffect, useRef, useState }from 'react';
import { useSelector } from 'react-redux';
import { selectCart } from '../features/cartSlice';
import CartItem from '../components/CartItem';
import useCartSummary from '../hooks/useCartSummary';
import { saveCartItem, getUserCart, clearUserCart } from '../services/firebaseCartService';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cartSlice'; // Adjust path if needed
import { Link } from "react-router-dom";



const Cart = () => {
  const cart = useSelector(selectCart);
  const { totalItems, totalPrice } = useCartSummary();
  const [suggestedProducts,setSuggestedProducts]=useState([]);

  const dispatch = useDispatch();


  useEffect(()=> {

     const fetchProducts= async() => {

      try {

const productsSnapshot=await getDocs(collection(db,"products"));

const allProducts=productsSnapshot.docs.map((doc)=>({id:doc.id,
  ...doc.data()

}))

const cartIDs= cart.map((item)=>item.id);

const filtered= allProducts.filter((product)=> !cartIDs.includes(product.id) );

const shuffled = filtered.sort(() => 0.5 - Math.random());
      const randomItems = shuffled.slice(0, 10); // adjust to show 7 or 10

      setSuggestedProducts(randomItems);

      console.log("Suggested Products =>", randomItems);


      



     }catch (error){
  
      console.error("error fetching products:",error);

     }

    };

    fetchProducts();

  },[cart]);

return (
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      padding: '1rem',
      gap: '2rem',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
    }}
  >
    {/* LEFT: Cart Items */}
    <div style={{ flex: '0 0 45%', minWidth: '320px' }}>
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
          <hr />
          <p><strong>Total Items:</strong> {totalItems}</p>
          <p><strong>Total Price:</strong> ${totalPrice.toFixed(2)}</p>
          <Link to="/checkout">
          <button
            style={{
              padding: '12px 24px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%',
              maxWidth: '300px',
              transition: 'background-color 0.3s ease',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#218838')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#28a745')}
          >
            Proceed to Checkout
          </button>
          </Link>
        </>
      )}
    </div>

    {/* RIGHT: Freely Floating Suggested Products */}
   {suggestedProducts.length > 0 && (
   

  <div
    style={{
      flex: '1 1 50%',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      alignContent: 'flex-start',
    }}
  >
    <h3 style={{ width: '100%' }}>You have more products to add</h3>
    {suggestedProducts.map((item) => (




<Link
    key={item.id}
    to={`/product/${item.id}`}
    style={{ textDecoration: "none", color: "inherit" }}
  >
      <div
        key={item.id}
        style={{
          padding: '6px',
          minWidth: '130px',
          maxWidth: '150px',
          textAlign: 'left',
          background: 'transparent',
          display: 'inline-block',
        }}
      >
        {/* ✅ Product Image */}
        {item.images?.[0] ? (
  <img
    src={item.images[0]}
    alt={item.title || item.name}
    style={{
      width: '100%',
      height: 'auto',
      borderRadius: '4px',
      marginBottom: '8px',
      objectFit: 'cover'
    }}
  />
) : (
  <div
    style={{
      width: '100%',
      height: '100px',
      backgroundColor: '#eee',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '4px',
      fontSize: '0.8rem'
    }}
  >
    No Image
  </div>
)}


        {/* ✅ Product Name */}
        <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>{item.name}</h4>

        {/* ✅ Ensure Price is displayed as a number */}
        <p style={{ margin: '0 0 6px 0' }}>${Number(item.price).toFixed(2)}</p>

        {/* ✅ Add to Cart Button */}
       <button
  onClick={async () => {
    const cartItem = {
      id: item.id,
      name: item.title || item.name, // fallback to 'title' if needed
      image: item.images?.[0] || "",
      price: Number(item.price),
      quantity: 1
    };

    dispatch(addToCart(cartItem)); // Add to Redux

    try {
      await saveCartItem(user.uid, cartItem); // ✅ Save to Firestore
    } catch (error) {
      console.error("Error saving cart item to Firestore:", error);
    }
  }}
  style={{
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  }}
  onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
  onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
>
  Add to Cart
</button>

      </div>
      </Link>
    ))}
  </div>
)}

  </div>
);


};

export default Cart;


