/**
 * Formats a number as US currency, e.g. 19.99 -> "$19.99".
 */
export const formatPrice = (price) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);
