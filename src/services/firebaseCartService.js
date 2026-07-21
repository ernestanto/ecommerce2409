import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';

// Save or update cart item
export const saveCartItem = async (userId, item) => {
  const cartRef = doc(db, 'users', userId);

  const userSnap = await getDoc(cartRef);

  if (userSnap.exists()) {
    const userCart = userSnap.data().cart || [];

    const existingItem = userCart.find(i => i.id === item.id);
    let updatedCart;

    if (existingItem) {
      updatedCart = userCart.map(i =>
        i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
      );
    } else {
      updatedCart = [...userCart, item];
    }

    await updateDoc(cartRef, { cart: updatedCart });
  } else {
    await setDoc(cartRef, {
      cart: [item]
    });
  }
};

// Get cart for a user
export const getUserCart = async (userId) => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  return userDoc.exists() ? userDoc.data().cart || [] : [];
};

// Clear cart for a user (e.g. after payment)
export const clearUserCart = async (userId) => {
  await updateDoc(doc(db, 'users', userId), { cart: [] });
};

// ✅ Save full cart at once (overwrite, not merge)
export const saveCartToFirestore = async (userId, cartItems) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { cart: cartItems });
};

