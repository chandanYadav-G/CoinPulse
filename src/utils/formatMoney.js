export function formatMoney(value, currency, options = {}) {
  // Keeping unavailable values explicit instead of rendering zeroes.
  if (!Number.isFinite(value)) return "—";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: value < 1 ? 4 : 0,
      ...options,
    }).format(value);
  } catch {
    // Fall back to a plain currency code if Intl rejects the requested currency.
    return `${currency} ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value)}`;
  }
}
