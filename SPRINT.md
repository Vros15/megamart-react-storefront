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

---

## Sprint 2c - Phase 2

Up next. Ordered by value relative to effort.

- [ ] Search, filter, and sort, wired to the API query parameters
- [ ] Custom hooks and wrapper components for repeated logic and layout
- [ ] Product detail pages at `/products/:id`
- [ ] Order history

---

## Sprint 3 - Payments (Stripe)

Planned. Integrate Stripe's API in test mode to generate fake transactions,
not real charges, matching this project's portfolio-demo scope (see the
`ADMIN_USER_ID` reasoning in Sprint 2a for the same "solve the actual
problem, not the general one" approach).

- [ ] 1. Add Stripe test-mode keys (`STRIPE_SECRET_KEY` on the backend,
      `VITE_STRIPE_PUBLISHABLE_KEY` on the frontend), gitignored like the
      Clerk keys
- [ ] 2. Backend: an endpoint that creates a Stripe Checkout Session (or
      Payment Intent) for a cart's total, test mode only
- [ ] 3. Frontend: replace the checkout `alert()` with a real Stripe
      Checkout redirect (or Stripe Elements), using Stripe's published test
      card numbers
- [ ] 4. Wire a successful payment into the existing order flow (`POST
      /api/orders/:customer`), so a completed checkout actually produces an
      order, not just a cleared cart
- [ ] 5. Document how to trigger a fake transaction safely: test mode keys
      only, Stripe's test card numbers, no path to a real charge

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
