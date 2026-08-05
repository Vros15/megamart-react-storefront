import { API_BASE_URL } from "../lib/constants.js";

/**
 * Converts one raw product from the API into the shape the rest of the app uses.
 *
 * Maps MongoDB's `_id` onto `id` so that database detail never reaches
 * components, which need a plain `id` for React keys and route parameters.
 */
const normalizeProduct = (product) => ({
  id: product._id,
  name: product.name,
  price: product.price,
  image: product.image ?? null,
  description: product.description ?? "",
  category: product.category ?? null,
  stock: typeof product.stock === "number" ? product.stock : null,
});



/**
 * Turns an object of filters into a URL query string.
 *
 * Empty values are left out on purpose. The API rejects `?category=` with a 400,
 * and a filter dropdown holds an empty string when nothing is selected, so
 * without this, clearing a filter would break the page.
 *
 * @param {object} params - Query values, for example { category: "Audio", limit: 5 }.
 * @returns {string} A string like "?category=Audio&limit=5", or "" if empty.
 */
const buildQueryString = (params) => {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, value);
    }
  }

  const query = search.toString();

  return query ? `?${query}` : "";
};




/**
 * Sends the request and returns the parsed JSON body, throwing on failure.
 *
 * `fetch` only rejects when the network fails, so a 400 or 500 arrives here as a
 * normal response with `ok` set to false. Checking it in one place means no
 * caller can forget to.
 *
 * @param {string} url - The full URL to request.
 * @returns {Promise<object>} The parsed response body.
 */
const request = async (url) => {
  const response = await fetch(url);

  // A failed request may return HTML or nothing at all, so parsing is allowed to
  // fail without throwing before the status has been checked.
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    // The API explains what was wrong in `message`, which is far more useful to
    // show a user than the status code.
    throw new Error(body?.message ?? `Request failed with status ${response.status}`);
  }

  return body;
};



/**
 * Fetches products, optionally filtered, sorted, and paginated.
 *
 * @param {object} [params] - Any of: category, search, minPrice, maxPrice,
 *   inStock, sortBy, sortOrder, page, limit.
 * @returns {Promise<{products: Array<object>, meta: object|null}>} Normalized
 *   products plus the API's pagination information.
 */
const fetchProducts = async (params = {}) => {
  const body = await request(`${API_BASE_URL}/products${buildQueryString(params)}`);

  return {
    products: (body?.products ?? []).map(normalizeProduct),
    meta: body?.meta ?? null,
  };
};



/**
 * Fetches a single product by its id.
 *
 * @param {string} id - The product's id.
 * @returns {Promise<object>} One normalized product.
 */


const fetchProductById = async (id) => {
  const body = await request(`${API_BASE_URL}/products/${id}`);

  if (!body?.product) {
    throw new Error("Product not found.");
  }

  return normalizeProduct(body.product);
};

export { fetchProducts, fetchProductById };
