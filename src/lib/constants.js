// Base URL for the MegaMart API. Override with VITE_API_URL to point at a local
// backend without touching code.
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "https://ecommerce-backend-api-dusky.vercel.app/api";
