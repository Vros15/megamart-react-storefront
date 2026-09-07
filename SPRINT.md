# Sprint Plan

MegaMart is a React storefront consuming the MegaMart backend API from `https://github.com/Vros15/ecommerce-backend-api`

Each task below is one commit. Tasks are ordered so the application runs after
every one of them.

API base: `https://ecommerce-backend-api-dusky.vercel.app/api/products`

---

## Sprint 1 - Core Application

Covers the core feature set: fetch products, add to cart, track quantity,
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
- [x] **5. Add the admin product screen** - `/admin`, the one admin account
      can create, edit, and delete products. The client-side gate decides
      what renders; the API's `403` is the real boundary
  - [x] **5.1 Admin route with access gate** - signed-out, non-admin, and
        admin states, no product management yet
  - [x] **5.2 Admin product list** - read-only, reuses `fetchProducts`
  - [x] **5.3 Product form component** - one reusable form for create and
        edit, category dropdown matching the API's six values
  - [x] **5.4 Wire create and edit into the admin screen**
  - [x] **5.5 Delete with confirmation**
- [x] **6. Document Clerk setup**
  - README explains the env var and that this repo must use the same Clerk
    instance as the API

---

## Sprint 2b - Mobile Navigation

Landed ahead of Sprint 2c - the header worked at desktop widths and squeezed
at phone widths, a logo, full search bar, and three nav links on one line
left the search bar (the only flexible element) with almost no room.

Two approaches were tried and dropped before landing on the third:

- A hamburger menu for Orders/sign-in freed up some width, but not enough to
  matter without also shrinking the search bar to an icon - more interactive
  surface than the problem justified for a nav that's currently two links.
- A toast notification on "Add to Cart" was built and verified, then pulled
  once the fixed bottom bar's own Cart badge made it feel redundant.

- [x] **1. Checkmark + toast feedback on Add to Cart**
  - Button morphs to a drawn checkmark on click, no toast (removed - see above)
- [x] **2. Fixed bottom tab bar on mobile** - Home, Orders, Account, Cart,
      replacing the squeezed header nav below the breakpoint
  - Page content gets bottom padding so nothing sits hidden behind it
- [x] **3. Search bar scoped to the home page, wraps full-width on mobile**
  - No search bar on `/cart` or `/admin`; wraps to its own row instead of
    shrinking, so the input stays usable at phone widths
- [x] **4. Real SVG icon set with active-tab tinting**
  - Icons injected inline (`src/components/ui/Icon.jsx`) so `currentColor`
    lets the active tab tint itself from one CSS rule, driven by
    react-router's own active-route detection
- [x] **5. Admin tab in the mobile nav** - shown only for the admin account,
      via a new `useIsAdmin` hook (Clerk `useUser()` plus the same
      `ADMIN_USER_ID` check `Admin.jsx` already used). Desktop nav doesn't
      have this yet, mobile only for now
- [x] **6. Fixed hero image sizing on mobile** - the existing breakpoint only
      reversed row order (`row-reverse`), which still split the width between
      text and image; switched to `column-reverse` so both get the full width

---

## Sprint 2c - Phase 2

Up next. Ordered by value relative to effort.

- [x] Search, filter, and sort, wired to the API query parameters
  - Search bar and category tabs both drive `useSearchParams`, so they
    combine freely (`?search=wireless&category=Electronics`); a `SortSelect`
    maps one dropdown to the API's `sortBy`/`sortOrder` pair
  - Hero and the category tile grid hide whenever a filter is active - a
    "Back to School Season" banner above filtered results read like it was
    advertising unrelated products
- [ ] Custom hooks and wrapper components for repeated logic and layout
      (`useIsAdmin` and `useAnalytics` already shipped; more will land
      alongside the search/filter work)
- [x] Product detail pages at `/products/:id`
  - `fetchProductById` already existed and was unused; `ProductCard`'s image/
    name/category/price link to it, `AddToCartButton` sits outside that link
    so clicking it doesn't also navigate
  - A bad or deleted id shows the API's own error message with a link back,
    rather than a blank page or an uncaught crash
- [ ] Order history

---

## Sprint 2d - Analytics

- [x] **1. Google Analytics (GA4)** - `gtag.js` loaded and configured with
      `send_page_view: false`, since a single-page app only fires one real
      page load; a custom `useAnalytics` hook sends a `page_view` event on
      every route change instead (`src/lib/analytics.js`,
      `src/hooks/useAnalytics.js`). A no-op with `VITE_GA_MEASUREMENT_ID`
      unset, unlike Clerk's hard failure - missing analytics shouldn't block
      the app from running

---

## Sprint 3 - Payments (Stripe)

Planned. Integrate Stripe's API in test mode to generate fake transactions,
not real charges, matching this project's portfolio-demo scope (see the
`ADMIN_USER_ID` reasoning in Sprint 2a for the same "solve the actual
problem, not the general one" approach).

- [x] 1. Add Stripe test-mode keys - `STRIPE_SECRET_KEY` and `FRONTEND_URL`
      on the backend only (`.env` locally, Vercel env vars for the live
      deployment), gitignored like the Clerk keys
  - No frontend key needed: the backend returns a ready-to-use Checkout
    Session `url`, so the frontend just redirects to it. The original plan
    assumed a `VITE_STRIPE_PUBLISHABLE_KEY` for Stripe.js/Elements, which
    turned out unnecessary for a plain redirect flow
- [x] 2. Backend: `POST /api/checkout` creates a Stripe Checkout Session for
      the given cart items (`ecommerce-backend-api`)
  - Stateless with respect to this API's own database - the frontend cart is
    client-side only, there is no backend Cart/Customer record to attach to
  - Re-fetches every product from MongoDB for its real price and checks
    requested quantity against actual stock - a client-submitted price or
    quantity is never trusted
  - Deliberately has no `requireAuth`/`requireAdmin`, unlike every other
    write route - it doesn't write to the database, and any shopper should
    be able to check out
  - Caught and fixed two real bugs during verification: the Stripe SDK
    throws synchronously in its constructor with no key, which crashed the
    app on `require()` alone until the client was moved from module scope
    into the handler; and this Stripe account's Managed Payments (on by
    default, requires a tax code per item) had to be explicitly disabled for
    a test-mode session that doesn't need real tax compliance
- [x] 3. Frontend: replace the checkout `alert()` with a real redirect to
      the Checkout Session URL (`src/api/checkout.js`, `CartSummary.jsx`)
  - `Cart.jsx` handles the `?checkout=success`/`?checkout=cancelled` return:
    success clears the cart (`CLEAR_CART`, new in `cartReducer.js`) and
    shows a confirmation; cancelled leaves the cart untouched. Verified both
    against a real live Stripe Checkout page, not mocked
- [ ] 4. Wire a successful payment into a real order record - still an open
      question, since there is no Customer identity behind the current
      Clerk-based frontend for an `Order` to attach to
- [x] 5. Document how to trigger a fake transaction safely
  - The cart page itself shows Stripe's published test card numbers in a
    small table, so a visitor trying the live demo isn't stuck at a real
    Stripe page with no idea what to enter
  - The same table lives as a code comment above `handleCheckout` in
    `CartSummary.jsx`, and in both repos' `v1.x`/`v1.0.0` release notes

---

## Folder Structure, Routing, and Styling

This was a Sprint 1-era planned layout, written before Sprint 2a and the
mobile work landed and diverged from it - no `Footer.jsx` or
`ProtectedRoute.jsx` were built, Clerk's own components are used directly
instead, and `admin/`/`ui/Icon.jsx` weren't anticipated at all. Rather than
maintain two versions of the same map, the current, accurate structure lives
in the README: see [Architecture](./README.md#architecture) for the real
folder layout and the reasoning behind it, and
[Key design decisions](./README.md#key-design-decisions) for styling and
routing choices.

This may be revisited once the project is complete.
