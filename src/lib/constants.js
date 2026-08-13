// Base URL for the MegaMart API. Override with VITE_API_URL to point at a local
// backend without touching code.
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "https://ecommerce-backend-api-dusky.vercel.app/api";

// Clerk user ID of the one account allowed to manage products. This only
// decides what the admin screen renders - it is not a security boundary.
// Anyone can edit client-side JavaScript, so the API's own 403 (checked
// against the same ID, server-side) is the real gate.
export const ADMIN_USER_ID = "user_3HkeVubl3lmYiO4Ie1aYYkw5kfj";
