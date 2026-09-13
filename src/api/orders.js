import { API_BASE_URL } from "../lib/constants.js";

/**
 * Fetches the signed-in shopper's own orders. The backend filters strictly
 * by the verified token's own user id - there is no way to ask for anyone
 * else's orders from here, client-supplied or otherwise.
 *
 * @param {string} token - The shopper's Clerk session token. Required -
 * unlike checkout, this route has no guest path.
 * @returns {Promise<Array<object>>}
 */
const fetchMyOrders = async (token) => {
  const response = await fetch(`${API_BASE_URL}/orders/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.message ?? `Request failed with status ${response.status}`);
  }

  return body.orders;
};

export { fetchMyOrders };
