export const money = (n) => `$${n.toFixed(2)}`;

export function safeJSONParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function normalizeCoupon(code) {
  return (code || "").trim().toUpperCase();
}

export function extrasPrice(extrasObj, extrasList) {
  return extrasList.reduce(
    (sum, ex) => sum + (extrasObj?.[ex.key] ? ex.price : 0),
    0
  );
}

export function slug(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
