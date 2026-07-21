// src/utils/aiClassifier.js
import OpenAI from "openai";

/* ──────────────── Setup ──────────────── */
const KEY = import.meta.env.VITE_OPENAI_KEY;
if (!KEY) {
  throw new Error("[aiClassifier] Missing VITE_OPENAI_KEY in .env.local");
}

const openai = new OpenAI({
  apiKey: KEY,
  dangerouslyAllowBrowser: true,
});

const LABELS = ["clothes", "footwear", "electronics", "accessories", "other"];

/* ───────── Single‑title helper (unchanged) ───────── */
export async function classifyTitle(title) {
  const prompt =
    `Category (${LABELS.join(", ")}):\n` +
    `Title: "${title}"\n` +
    `Answer:`;

  const res = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 5,
    temperature: 0,
  });

  const label = res.choices[0].message.content.trim().toLowerCase();
  return LABELS.includes(label) ? label : "other";
}

/* ───────── All‑titles helper (ONE API call) ───────── */
export async function classifyAll(titles) {
  const list = titles.map((t, i) => `${i + 1}. ${t}`).join("\n");
  const prompt =
    `Classify EACH product title below into one of: ${LABELS.join(", ")}.\n` +
    `Reply with a JSON array (same order).\n\n` +
    list;

  const res = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
  });

  try {
    const arr = JSON.parse(res.choices[0].message.content);
    return Array.isArray(arr)
      ? arr.map((l) => (LABELS.includes(l) ? l : "other"))
      : titles.map(() => "other");
  } catch {
    return titles.map(() => "other");
  }
}
