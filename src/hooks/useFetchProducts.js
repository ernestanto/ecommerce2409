// src/hooks/useFetchProducts.js

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const useFetchProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);  // optional
  const [error, setError] = useState(null);      // optional

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("🟢 Fetching products from Firestore...");
        const snapshot = await getDocs(collection(db, 'products'));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,             // Firestore doc ID as unique key
          ...doc.data(),          // product fields
        }));

        setProducts(data);
        console.log(`✅ Fetched ${data.length} products.`);
      } catch (err) {
        console.error("❌ Error fetching products:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};

export default useFetchProducts;
