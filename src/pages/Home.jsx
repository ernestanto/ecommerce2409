// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import useFetchProducts from "../hooks/useFetchProducts";
import ProductCard from "../components/ProductCard";
import { classifyTitle } from "../utils/aiClassifier";   //  <-- batch helper
import { classifyAll } from "../utils/aiClassifier";

import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

const styles = {
  container: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    padding: "1rem",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: "1.5rem",
    fontWeight: 600,
    color: "#1e3c72",
    textAlign: "center",
    width: "100%",
    marginTop: "5rem",
    fontFamily: "Segoe UI, Roboto, sans-serif",
  },
  errorText: {
    fontSize: "1.2rem",
    color: "red",
    textAlign: "center",
    width: "100%",
    marginTop: "5rem",
    fontFamily: "Segoe UI, Roboto, sans-serif",
  },
  filterBar: {
    display: "flex",
    gap: "0.5rem",
    justifyContent: "center",
    marginTop: "1rem",
    marginBottom: "1rem",
  },
  filterBtn: (active) => ({
    padding: "6px 12px",
    borderRadius: 4,
    border: "1px solid #1e3c72",
    backgroundColor: active ? "#1e3c72" : "transparent",
    color: active ? "#fff" : "#1e3c72",
    cursor: "pointer",
    fontSize: 14,
  }),
};

export default function Home() {
  const { products, loading, error } = useFetchProducts();
  const [tagged, setTagged] = useState([]);  // products + aiCategory
  const [filter, setFilter] = useState("All");
  const [busy, setBusy]   = useState(false); // spinner while tagging

  /* Tag once (sequential, 2.5 s delay to avoid 429) */
  useEffect(() => {
  if (products.length === 0) return;
  let cancelled = false;

  (async () => {
    
    setBusy(true);

    /* ── STEP 1: gather titles that still need a label ── */
    const toTag = products.filter(p => typeof p.aiCategory !== "string");

    /* ── STEP 2: one OpenAI request for all titles ── */
    let labels = [];
    if (toTag.length) {
      try {
        labels = await classifyAll(toTag.map(p => p.title)); // ← ONE request
      } catch (err) {
        console.warn("❌ AI batch classification failed:", err);
        labels = toTag.map(() => "other");
      }

      /* ── STEP 3: write aiCategory to Firestore in parallel ── */
      console.table(
  toTag.map((p, i) => ({
    index: i,
    title: p.title,
    id: p.id,
    label: labels[i],
    idType: typeof p.id,
  }))
);

      await Promise.all(
  toTag.map((p, i) => {
    const docId = String(p.id || "").trim();
    if (!docId) return;

    return updateDoc(doc(db, "products", docId), {
      aiCategory: labels[i] || "other",
    });
  })
);

    }

    /* ── STEP 4: merge labels back into local state ── */
    const out = products.map(p => {
      if (typeof p.aiCategory === "string") return p;
      const idx = toTag.findIndex(x => x.id === p.id);
      return { ...p, aiCategory: labels[idx] || "other" };
    });

    if (!cancelled) {
      console.table(
        out.map(p => ({
          id: p.id,
          title: p.title,
          category: p.aiCategory,
        }))
      );
      setTagged(out);
      setBusy(false);
    }
  })();

  return () => {
    cancelled = true;
  };
}, [products]);


  /* Build category list */
  console.log("🔍 tagged array:", tagged);

  const categories = [
    "All",
    ...new Set(
      tagged
        .map((p) =>
          typeof p.aiCategory === "string"
            ? p.aiCategory.trim().toLowerCase()
            : null
        )
        .filter(Boolean)
    ),
  ];

  console.log("🔍 categories array:", categories);

  /* Filtered display list */
  const display =
    filter === "All"
      ? tagged
      : tagged.filter((p) => p.aiCategory === filter);

  /* States */
  if (loading || busy)
    return <p style={styles.loadingText}>⏳ Loading products…</p>;
  if (error)
    return (
      <p style={styles.errorText}>
        ❌ Failed to load products. Try again later.
      </p>
    );

  return (
    <>
      {/* Filter bar */}
      <div style={styles.filterBar}>
        {categories.map((c) => {
          const label = String(c);
          return (
            <button
              key={label}
              style={styles.filterBtn(filter === c)}
              onClick={() => setFilter(c)}
            >
              {label.charAt(0).toUpperCase() + label.slice(1)}
            </button>
          );
        })}
      </div>

      {/* Product grid */}
      <div style={styles.container}>
        {display.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <h1>hi,im just testing</h1>
    </>
  );
}

