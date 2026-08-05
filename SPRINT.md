# Sprint Plan

MegaMart is a React storefront consuming the MegaMart backend API.

Each task below is one commit. Tasks are ordered so the application runs after
every one of them.

API base: `https://ecommerce-backend-api-dusky.vercel.app/api/products`

---

## Sprint 1 - Core Application

Covers the full assignment brief: fetch products, add to cart, track quantity,
show a total, alert on checkout, and navigate with React Router.

- [x] **1. Scaffold project and remove Vite boilerplate**
  - `npm run dev` serves a clean page with no Vite demo content

- [x] **2. Add products API client**
  - `fetchProducts` returns products normalised as `id`, `name`, `price`, `image`,
    `description`, `category`, `stock`, plus the API's pagination `meta`

- [ ] **3. Add routing and page shell**
  - Navigating between `/` and `/cart` works without a full page reload

- [ ] **4. Render the product grid**
  - Products render from the live API, with visible loading and error states

- [ ] **5. Add cart state**
  - Adding the same product twice sets its quantity to 2 rather than duplicating it

- [ ] **6. Add products to the cart from the grid**
  - Clicking Add to Cart updates cart state from the home page

- [ ] **7. Build the cart page**
  - Cart lists items with quantities and a correct total; Checkout alerts the total

- [ ] **8. Show the cart count in the header**
  - Badge reflects total quantity across all items

---

## Sprint 2 - Phase 2

Planned after Sprint 1 is complete. Ordered by value relative to effort.

- [ ] Search, filter, and sort, wired to the API query parameters
- [ ] Custom hooks and wrapper components for repeated logic and layout
- [ ] Product detail pages at `/products/:id`
- [ ] Clerk authentication, with the API verifying tokens rather than only the UI
- [ ] Add products through a form, restricted to signed-in users
- [ ] Order history

---

## Styling

Tailwind CSS v4 via `@tailwindcss/vite`. Added in task 3, when there is layout
worth styling.
