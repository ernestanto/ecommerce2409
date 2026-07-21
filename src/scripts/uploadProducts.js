// src/scripts/uploadProducts.js

import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import products from '../data/products.json';

export const uploadProductsToFirestore = async () => {
  console.log('🟢 uploadProductsToFirestore() called');
  console.log('🗂️ Checking products JSON import...');

  if (!Array.isArray(products) || products.length === 0) {
    console.warn('⚠️ No products found in products.json. Please check the file path or contents.');
    return;
  }

  console.log(`✅ Loaded ${products.length} products from JSON.`);
  console.log('🛠️ Starting upload without duplication...\n');

  try {
    for (const [index, product] of products.entries()) {
      // Safely convert title to string and generate a valid ID
      const rawTitle = String(product.title || product.name || `Unnamed Product ${index + 1}`);
      const productId = (product.id || rawTitle)
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '') // remove special characters
        .trim();

      const productRef = doc(db, 'products', productId);

      // Merge: if product already exists, update it instead of creating duplicate
      await setDoc(productRef, product, { merge: true });

      console.log(`✅ (${index + 1}/${products.length}) Uploaded or updated: ${rawTitle} → ID: ${productId}`);
    }

    console.log(`🎉 All ${products.length} products uploaded or updated successfully!`);
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    console.error('📛 Full error object:', error);
  }
};


