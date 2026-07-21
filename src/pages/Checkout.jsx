// src/pages/Checkout.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCart, addToCart } from "../features/cartSlice";
import useCartSummary from "../hooks/useCartSummary";
import CartItem from "../components/CartItem";
import { Link } from "react-router-dom";

import { db } from "../firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

const S = {
  page: { display: "flex", gap: 24, padding: 24, background: "#f6f6f6",
          fontFamily: '"Amazon Ember", Arial, sans-serif' },
  leftCol: { flex: "1 1 60%", minWidth: 320 },
  rightCol: { flex: "0 0 320px", position: "sticky", top: 24 },
  box: { background: "#fff", border: "1px solid #d5d9d9", borderRadius: 8,
         padding: "16px 24px", marginBottom: 20 },
  section: { fontSize: 18, fontWeight: 700, marginBottom: 12 },
  radioRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 },
  orderBtn: { width: "100%", background: "#ffd814", border: "1px solid #fcd200",
              borderRadius: 8, padding: "10px 0", fontSize: 17, fontWeight: 700,
              cursor: "pointer" },
  suggestGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)", // ← exactly three per row
    columnGap: 12,
    rowGap: 16,
  },
  suggestCard: { border: "1px solid #e3e3e3", borderRadius: 6, padding: 8,
                 textAlign: "center", background: "#fff" },
  addBtn: { marginTop: 8, width: "100%", padding: "6px 0",
            background: "#f0c14b", border: "1px solid #a88734",
            borderRadius: 4, cursor: "pointer", fontSize: 13 },
  img: { width: "100%", height: "160px", objectFit: "cover",
         borderRadius: 4, marginBottom: 8 },
};

export default function Checkout() {
  const cart                   = useSelector(selectCart);
  const { totalItems, totalPrice } = useCartSummary();
  const dispatch               = useDispatch();

  const [payment, setPayment]  = useState("gpay");
  const [suggested, setSuggested] = useState([]);

  /* ---------- money math ---------- */
  const tax      = +(totalPrice * 0.18).toFixed(2);
  const shipping = totalPrice > 500 ? 0 : 40;
  const grand    = (totalPrice + tax + shipping).toFixed(2);

  /* ---------- fetch 10 random suggestions ---------- */
  useEffect(() => {
    const fetchSuggestions = async () => {
      const snap = await getDocs(collection(db, "products"));
      const all  = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const cartIDs = cart.map(c => c.id);
      // filter out cart items
      const filtered = all.filter(p => !cartIDs.includes(p.id));
      // shuffle and pick 10
      const picks = filtered.sort(() => 0.5 - Math.random()).slice(0, 10);
      setSuggested(picks);
    };
    fetchSuggestions();
  }, [cart]);

  /* ---------- place order ---------- */
  const placeOrder = async () => {
    await addDoc(collection(db, "orders"), {
      items: cart,
      total: grand,
      payment,
      createdAt: serverTimestamp(),
    });
    alert("Order placed!");
    // TODO: dispatch(clearCart()) if you have such action
  };

  /* ---------- JSX ---------- */
  return (
    <div style={S.page}>
      {/* LEFT COLUMN ------------------------------------------------ */}
      <div style={S.leftCol}>
        {/* Payment Method */}
        <div style={S.box}>
          <h3 style={S.section}>Payment Method</h3>
          {[
            ["gpay", "Google Pay"],
            ["phonepe", "PhonePe"],
            ["upi", "UPI ID"],
            ["card", "Credit / Debit Card"],
            ["cod", "Cash on Delivery"],
          ].map(([val, label]) => (
            <label key={val} style={S.radioRow}>
              <input
                type="radio"
                value={val}
                checked={payment === val}
                onChange={(e) => setPayment(e.target.value)}
              />
              {label}
            </label>
          ))}
        </div>

        {/* Cart Items */}
        <div style={S.box}>
          <h3 style={S.section}>Review Items</h3>
          {cart.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      
      {/* Suggested Products */}
        {suggested.length > 0 && (
          <div style={S.box}>
            <h3 style={S.section}>You might also like</h3>
            <div style={S.suggestGrid}>
              {suggested.map((item) => (
                <Link
    key={item.id}
    to={`/product/${item.id}`}
    style={{ textDecoration: "none", color: "inherit" }}
  >

                <div key={item.id} style={S.suggestCard}>
                  {item.images?.[0] ? (
                    <img src={item.images[0]} alt={item.title || item.name} style={S.img} />
                  ) : (
                    <div
                      style={{
                        ...S.img,
                        height: "160px",
                        background: "#eee",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "0.8rem",
                      }}
                    >
                      No Image
                    </div>
                  )}
                  <p style={{ fontSize: 13, height: 32, overflow: "hidden" }}>
                    {item.title || item.name}
                  </p>
                  <p style={{ fontWeight: 700, margin: "4px 0" }}>${item.price?.toFixed(2)}</p>
                <button
  style={S.addBtn}
  onClick={() =>
    dispatch(
      addToCart({
        ...item,
        price: Number(item.price) || 0,
        quantity: 1, // ✅ Add this line
      })
    )
  }
>
  Add to Cart
</button>

                </div>
                </Link>
              ))}
              
            </div>
          </div>
        )}

{/* RIGHT COLUMN ---------------------------------------------- */}
      <div style={S.rightCol}>
        {/* Order Summary */}
        <div style={S.box}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Order Summary</h3>
          <table style={{ width: "100%", fontSize: 14 }}>
            <tbody>
              <tr>
                <td>Items ({totalItems}):</td>
                <td style={{ textAlign: "right" }}>${totalPrice.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Shipping:</td>
                <td style={{ textAlign: "right" }}>
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </td>
              </tr>
              <tr>
                <td>GST (18%):</td>
                <td style={{ textAlign: "right" }}>${tax}</td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <hr />
                </td>
              </tr>
              <tr style={{ fontWeight: 700 }}>
                <td>Order Total:</td>
                <td style={{ textAlign: "right" }}>${grand}</td>
              </tr>
            </tbody>
          </table>
          <button style={S.orderBtn} onClick={placeOrder}>
            Place your order
          </button>
        </div>

        
      </div>

    </div>
  );
}
