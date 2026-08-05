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

- [ ] **3. Add global styles**
  - `index.css` holds the reset, colour and spacing tokens, base element styles,
    and the shared `.container` wrapper

- [x] **4. Add routing and page shell**
  - Navigating between `/` and `/cart` works without a full page reload

- [x] **5. Render the product grid**
  - Products render from the live API, with visible loading and error states

- [ ] **6. Add cart state**
  - Adding the same product twice sets its quantity to 2 rather than duplicating it

- [ ] **7. Add products to the cart from the grid**
  - Clicking Add to Cart updates cart state from the home page

- [ ] **8. Build the cart page**
  - Cart lists items with quantities and a correct total; Checkout alerts the total

- [ ] **9. Show the cart count in the header**
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

## Planned Folder Structure

The target layout. Directories are created as the task that needs them lands,
rather than up front, since git does not track empty directories and placeholder
files cannot be reviewed.

```text
src/
├── api/
│   ├── products.js          fetchProducts, fetchProductById
│   └── orders.js            added with order history
├── components/
│   ├── layout/
│   │   ├── Layout.jsx       header, <Outlet />, footer
│   │   ├── Layout.css
│   │   ├── Header.jsx       brand, nav, cart badge, account menu
│   │   ├── Header.css
│   │   ├── Footer.jsx
│   │   └── Footer.css
│   ├── products/
│   │   ├── ProductGrid.jsx  the list and its empty state
│   │   ├── ProductGrid.css
│   │   ├── ProductCard.jsx  one product
│   │   ├── ProductCard.css
│   │   └── AddToCartButton.jsx
│   ├── cart/
│   │   ├── CartItem.jsx     one line with quantity controls
│   │   ├── CartItem.css
│   │   ├── CartSummary.jsx  totals and checkout
│   │   └── CartSummary.css
│   ├── auth/
│   │   └── ProtectedRoute.jsx
│   └── ui/
│       ├── Button.jsx
│       ├── Button.css
│       ├── Spinner.jsx
│       ├── Spinner.css
│       ├── EmptyState.jsx
│       └── EmptyState.css
├── context/
│   ├── CartContext.jsx      the provider
│   └── cartReducer.js       state transitions, no React involved
├── hooks/
│   ├── useCart.js           reads CartContext
│   └── useFetch.js          loading, error, and data
├── lib/
│   ├── constants.js         API base URL
│   └── format.js            price formatting, image fallback
├── pages/
│   ├── Home.jsx
│   ├── Home.css
│   ├── Cart.jsx
│   ├── Cart.css
│   ├── ProductDetail.jsx    Sprint 2
│   ├── SignIn.jsx           Sprint 2
│   ├── SignUp.jsx           Sprint 2
│   ├── Profile.jsx          Sprint 2
│   ├── Orders.jsx           Sprint 2
│   └── NotFound.jsx
├── App.jsx                  route definitions
├── main.jsx                 providers and router
└── index.css                global: reset, tokens, base elements, .container
```

### Why it is arranged this way

**`pages/` versus `components/`** is the routing boundary. A page maps to a URL
and composes components. Nothing inside `components/` should know which route it
is rendered on.

**`components/` is grouped by feature.** A flat folder works up to roughly six
components; this app will hold more. `ui/` is reserved for components with no
domain knowledge, so a `Button` never learns what a product is.

**`AddToCartButton` is separate from `ProductCard`** because the product detail
page needs the same behaviour. Shared behaviour belongs in a hook or a shared
component, not duplicated across two callers.

**`cartReducer.js` is split from `CartContext.jsx`** so the state transitions
stay a plain function, testable without rendering anything.

**`ProtectedRoute` wraps routes rather than pages checking auth themselves**, so
the signed-in requirement is declared once in the route table.

---

## Routing Shape

`Layout` renders persistently and pages swap inside its `<Outlet />`, so the
header does not remount on navigation.

```jsx
<Routes>
  <Route element={<Layout />}>
    <Route path="/" element={<Home />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="*" element={<NotFound />} />
  </Route>
</Routes>
```

---

## Styling

Plain CSS, no framework.

- `src/index.css` is the global stylesheet: reset, `:root` custom properties for
  colour and spacing, base element styles, and shared utilities such as
  `.container`.
- Each component keeps a stylesheet beside it, imported by that component.
- **Class names are prefixed with the component name.** Importing a stylesheet
  inside a component does not scope it - Vite bundles all CSS together and every
  class is global. `.header-nav` and `.product-card-title` rather than `.nav` and
  `.title`.

This may be revisited once the project is complete.
