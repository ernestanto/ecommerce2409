import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add to cart or update quantity if item exists
    addToCart: (state, action) => {
      const existingItem = state.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.push({ ...action.payload });
      }
    },

    // Set the entire cart (useful for loading from Firestore)
    setCart: (state, action) => {
      return action.payload;
    },

    // Update quantity explicitly (e.g. from input field)
    updateQuantity: (state, action) => {
      const item = state.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },

    // Increase quantity by 1
    increaseQuantity: (state, action) => {
      const item = state.find(item => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },

    // Decrease quantity by 1 or remove if it's the last one
    decreaseQuantity: (state, action) => {
      const index = state.findIndex(item => item.id === action.payload);
      if (index !== -1) {
        if (state[index].quantity > 1) {
          state[index].quantity -= 1;
        } else {
          state.splice(index, 1);
        }
      }
    },

    // Remove item completely
    removeFromCart: (state, action) => {
      return state.filter(item => item.id !== action.payload);
    },

    // Clear the entire cart (after checkout)
    clearCart: () => {
      return [];
    }
  }
});

// Export actions
export const {
  addToCart,
  setCart,
  updateQuantity,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart
} = cartSlice.actions;

// Selector
export const selectCart = (state) => state.cart;

// Reducer
export default cartSlice.reducer;

