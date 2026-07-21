// src/App.jsx
import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import { uploadProductsToFirestore } from './scripts/uploadProducts';
import Product from './pages/Product';

import { useDispatch, useSelector } from 'react-redux';
import { selectCart, setCart } from './features/cartSlice';
import { selectUser, setUser } from './features/userSlice';
import { getUserCart, saveCartToFirestore } from './services/firebaseCartService';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

const AppContent = () => {
  const location = useLocation();
  const cart = useSelector(selectCart);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const hideHeaderPaths = ['/', '/login'];

  // ⛔ Prevent syncing cart before it's fetched
  const [cartLoaded, setCartLoaded] = useState(false);
  const isFirstSync = useRef(true); // Skip first cart sync to avoid overwriting

  // Upload products once (uncomment manually when needed)
  useEffect(() => {
    const runUploadOnce = async () => {
      try {
        await uploadProductsToFirestore();
        console.log('✅ Products uploaded successfully!');
      } catch (error) {
        console.error('❌ Error uploading products:', error);
      }
    };

    // runUploadOnce(); // ⚠️ Only uncomment when needed to upload
  }, []);

  // 🔐 Auth + Fetch user's cart from Firestore once
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(setUser({ uid: user.uid, email: user.email }));

        const cartItems = await getUserCart(user.uid);
        dispatch(setCart(cartItems));
        setCartLoaded(true); // ✅ mark cart loaded
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  // 🛒 Sync Redux cart to Firestore only after cart is loaded
  useEffect(() => {
    if (!cartLoaded || !user?.uid) return;

    if (isFirstSync.current) {
      isFirstSync.current = false; // ✅ skip sync on first load
      return;
    }

    const syncCart = async () => {
      try {
        await saveCartToFirestore(user.uid, cart); // ✅ safe overwrite
        console.log('🛒 Cart synced to Firestore');
      } catch (err) {
        console.error('❌ Error syncing cart:', err);
      }
    };

    syncCart();
  }, [cart, user, cartLoaded]);

  return (
    <>
      {!hideHeaderPaths.includes(location.pathname) && <Header />}

      <div
        style={{
          padding: hideHeaderPaths.includes(location.pathname) ? '0' : '1rem',
          paddingTop: hideHeaderPaths.includes(location.pathname) ? '0' : '5rem',
        }}
      >
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/product/:id" element={<Product />} /> 
        </Routes>
      </div>
    </>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;





