# Sprint Plan

MegaMart is a React storefront consuming the MegaMart backend API from `https://github.com/Vros15/ecommerce-backend-api`

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

- [x] **3. Add global styles**
  - `index.css` holds the reset, colour and spacing tokens, base element styles,
    and the shared `.container` wrapper

- [x] **4. Add routing and page shell**
  - Navigating between `/` and `/cart` works without a full page reload

- [x] **5. Render the product grid**
  - Products render from the live API, with visible loading and error states

- [x] **6. Add cart state**
  - Adding the same product twice sets its quantity to 2 rather than duplicating it

- [x] **7. Add products to the cart from the grid**
  - Clicking Add to Cart updates cart state from the home page

- [x] **8. Build the cart page**
  - Cart lists items with quantities and a correct total; Checkout alerts the total

- [x] **9. Show the cart count in the header**
  - Badge reflects total quantity across all items

---

## Sprint 2a - Admin Write Access (Clerk)

The API's write routes (products, customers, carts, orders) were locked to a
single admin account on 2026-08-10 - confirmed live via Postman, not just
planned (`POST /api/products` with no token now returns `401`, reads are
unaffected).

Deliberately narrower than "any signed-in user can write" - this is a public
portfolio demo, and the goal is stopping a stranger from deleting the
catalogue, not building general-purpose role management. One hardcoded
`ADMIN_USER_ID`, not a roles system.

- [x] **1. Install Clerk React SDK**
  - `VITE_CLERK_PUBLISHABLE_KEY` set in `.env.local` (gitignored - this repo
    intentionally has no `.env.example`)
- [x] **2. Wrap the app in `ClerkProvider`**
  - Storefront still renders and reads still work while signed out; nothing
    visible changes yet
- [x] **3. Add sign in / sign out to the header**
  - Signed out shows Clerk's sign-in; signed in shows the user button
- [x] **4. Attach the Clerk token to write requests**
  - `useAdminApi` fetches a fresh token per write call and never caches one -
    Clerk tokens expire in roughly 60 seconds
- [ ] **5. Add the admin product screen** - `/admin`, the one admin account
      can create, edit, and delete products. The client-side gate decides
      what renders; the API's `403` is the real boundary
  - [x] **5.1 Admin route with access gate** - signed-out, non-admin, and
        admin states, no product management yet
  - [x] **5.2 Admin product list** - read-only, reuses `fetchProducts`
  - [x] **5.3 Product form component** - one reusable form for create and
        edit, category dropdown matching the API's six values
  - [x] **5.4 Wire create and edit into the admin screen**
  - [ ] **5.5 Delete with confirmation**
- [x] **6. Document Clerk setup**
  - README explains the env var and that this repo must use the same Clerk
    instance as the API

---

## Sprint 2b - Phase 2

Planned after Sprint 2a is complete. Ordered by value relative to effort.

- [ ] Search, filter, and sort, wired to the API query parameters
- [ ] Custom hooks and wrapper components for repeated logic and layout
- [ ] Product detail pages at `/products/:id`
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
