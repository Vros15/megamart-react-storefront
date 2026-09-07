import { API_BASE_URL } from "../lib/constants.js";

/**
 * Creates a Stripe Checkout Session for the given cart items and returns the
 * URL to redirect to. Only productId and quantity are sent - price always
 * comes from the backend re-deriving it from the database, so nothing sent
 * from here can change what actually gets charged.
 *
 * @param {Array<{id: string, quantity: number}>} items - Cart line items.
 * @returns {Promise<string>} The Stripe-hosted checkout page URL.
 */
const createCheckoutSession = async (items) => {
  const response = await fetch(`${API_BASE_URL}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
    }),
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.message ?? `Request failed with status ${response.status}`);
  }

  return body.url;
};

/**
 * Fetches what was actually charged for a completed Checkout Session - the
 * confirmation page uses this instead of whatever the client-side cart
 * happened to contain, since that's just an assumption, not proof.
 *
 * @param {string} sessionId - The Stripe Checkout Session id.
 * @returns {Promise<{paid: boolean, total: number, items: Array<{name: string, quantity: number, amount: number}>}>}
 */
const fetchCheckoutSession = async (sessionId) => {
  const response = await fetch(`${API_BASE_URL}/checkout/session/${sessionId}`);
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.message ?? `Request failed with status ${response.status}`);
  }

  return body;
};

export { createCheckoutSession, fetchCheckoutSession };
