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
  - Search bar and category filtering both drive `useSearchParams`, so they
    combine freely (`?search=wireless&category=Electronics`); a `SortSelect`
    maps one dropdown to the API's `sortBy`/`sortOrder` pair
  - Hero hides whenever a filter is active - a "Back to School Season"
    banner above filtered results read like it was advertising unrelated
    products
  - Category filtering later moved from a separate `CategoryTabs` nav row
    onto the "Shop by category" tiles themselves - clicking a tile filters,
    clicking the active one again clears it. `CategoryTabs.jsx`/`.css`
    deleted rather than left unused. The tile grid now stays visible while a
    category filter is active (it's the filter control now, hiding it would
    remove the only way to switch or clear one), dimming every tile but the
    active one via the photo's own opacity instead of a flat grey box.
    Still hides on a search, same reasoning as the hero
  - Caught a real bug during this change: the tiles' representative photos
    were sourced from the same filtered fetch as the results grid, so once
    filtered to one category, the other five tiles lost their images
    entirely. Fixed with a second, always-unfiltered fetch just for the
    tiles (`fetchAllProductsForTiles` in `Home.jsx`)
- [ ] Custom hooks and wrapper components for repeated logic and layout
      (`useIsAdmin` and `useAnalytics` already shipped; more will land
      alongside the search/filter work)
- [x] Product detail pages at `/products/:id`
  - `fetchProductById` already existed and was unused; `ProductCard`'s image/
    name/category/price link to it, `AddToCartButton` sits outside that link
    so clicking it doesn't also navigate
  - A bad or deleted id shows the API's own error message with a link back,
    rather than a blank page or an uncaught crash

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
  - `Cart.jsx` originally handled both `?checkout=success` and
    `?checkout=cancelled`; success later moved to its own page (see Sprint
    4), so `Cart.jsx` now only handles `?checkout=cancelled`. Both were
    verified against a real live Stripe Checkout page, not mocked
- [x] 4. Wire a successful payment into a real order record - turned out to
      be bigger than one task, delivered in full as Sprint 4
- [x] 5. Document how to trigger a fake transaction safely
  - The cart page itself shows Stripe's published test card numbers in a
    small table, so a visitor trying the live demo isn't stuck at a real
    Stripe page with no idea what to enter
  - The same table lives as a code comment above `handleCheckout` in
    `CartSummary.jsx`, and in both repos' `v1.x`/`v1.0.0` release notes

---

## Sprint 4 - Order Identity and History

Same root cause as Sprint 3 task 4: the cart is client-side only, and a
Clerk-authenticated shopper has no `Customer` record, so nothing can attach
a completed payment to a real order, or answer "what has this shopper
bought." Order history and "wire a successful payment into an order" are the
same problem, not two separate features - splitting them apart would mean
building a page with nothing to read, or writes nobody can see. Backend work
landed first (`ecommerce-backend-api`, its own Sprint 9).

- [x] 1. `src/api/checkout.js` sends the Clerk token when the shopper is
      signed in - still works for guests with no token, matching the
      backend's optional-auth checkout route
- [x] 2. New `/orders` page, signed-in gated, fetching `GET /api/orders/me`
      - the header's `Orders` link (desktop and mobile) finally points
        somewhere real, instead of 404'ing via `NotFound`
- [x] 3. Full round-trip verification: signed in, paid with a real test
      card, confirmed the backend webhook fired and created a real order
      with the correct `clerkUserId`, confirmed it showed up on `/orders`
      filtered to that account and nobody else's

---

## Up Next - AI-Assisted Refund Support (Sprints 5 to 12)

A support chat built into the store, starting with refunds. A signed-in
shopper describes a problem ("my headphones arrived broken"), and the system
looks up MegaMart's written policies (RAG), finds the right order from the
shopper's own account, checks it against a refund policy written in code, and
opens a ticket for a person to approve.

How the pieces split up:

| Piece | Job |
| --- | --- |
| RAG (policy documents + vector search) | "What does MegaMart policy say?" |
| LLM (Claude) | Understands the message, asks follow-up questions, writes answers grounded in the retrieved policy |
| Backend code | "What is actually true?" Identity, order ownership, payment status, refund amount |
| Policy engine | Hard rules: ownership, paid, refund window, refundable amount |
| Decision provider | Continue, ask for more info, send to a person, or not eligible. Swappable, built so a dedicated decision model (JEV) can be evaluated later |
| Support agent | Approves or denies. **The AI never moves money** |

Built without frameworks like LangChain on purpose: every stage (chunking,
embeddings, retrieval, context assembly, structured output, evaluation) is a
small, readable module.

Each task below starts with **Backend:** (`ecommerce-backend-api`) or
**Frontend:** (this repo). Sizes are S / M / L / XL. The backend's
[`SPRINT.md`](https://github.com/Vros15/ecommerce-backend-api/blob/main/SPRINT.md)
tracks its share of this work as its own Sprints 10 to 17 (same order).

### Sprint 5 - Security Prerequisites (S)

- [ ] 1. Backend: restrict order, customer, and cart read endpoints to admin
      access (the storefront only uses `GET /api/orders/me`)
- [ ] 2. Backend: generic error message for unexpected 500s, real message
      only for known `AppError`s
- [ ] 3. Backend: separate test database, and fix the failing product-count
      test
- [ ] 4. Backend: shared Stripe client with a pinned API version
- [ ] 5. Backend: small structured JSON logger for all new code

### Sprint 6 - RAG Foundation (L)

MegaMart's support policies can be ingested and searched.

- [ ] 1. Backend: confirm MongoDB Atlas Vector Search is available on the
      cluster, and pick the embedding model (Voyage AI)
- [ ] 2. Backend: write the policy documents in `knowledge/` (refunds,
      damaged products, duplicate charges, returns, cancellations,
      shipping, FAQ), each with a version and effective date
- [ ] 3. Backend: `config/refundPolicy.js` holds the hard numbers, plus a
      test that fails if the written policy and the config disagree
- [ ] 4. Backend: `EmbeddingProvider` with a real and a fake (offline)
      implementation
- [ ] 5. Backend: `KnowledgeDocument` and `KnowledgeChunk` models
- [ ] 6. Backend: chunker that splits on headings so each chunk is one
      policy section, with configurable size and overlap
- [ ] 7. Backend: ingestion script (`npm run ingest:knowledge`): load,
      clean, block anything that looks like a secret, skip unchanged docs,
      chunk, embed, store, mark old versions as superseded
- [ ] 8. Backend: `Retriever` with Atlas Vector Search and an in-memory
      version for tests; every result carries its source and version
- [ ] 9. Backend: retrieval evaluation (`npm run eval:retrieval`) with 30
      labelled questions, reporting how often the right policy comes back

### Sprint 7 - Grounded Support Chat (XL)

A shopper can ask policy questions and get answers based on MegaMart's
actual policies, with no made-up rules.

- [ ] 1. Backend: `LLMProvider` (Claude) with a fake for tests, timeouts,
      and bounded retries
- [ ] 2. Backend: `Conversation`, `Message`, and `AiDecision` models
- [ ] 3. Backend: AI gateway: sign-in required, per-user message limits
      stored in MongoDB, message length cap, off unless the AI key is set
- [ ] 4. Backend: intent detection with schema-validated output (refund or
      not, reason, order hint, what's missing)
- [ ] 5. Backend: prompt assembly with clearly labelled sections, policy
      text treated as data, not instructions
- [ ] 6. Backend: grounded reply that must cite the policy chunks it used,
      and a fixed "let me get a person" reply when no policy matches
- [ ] 7. Backend: support orchestrator (code-driven workflow, the AI gets no
      tools of its own) and `POST /api/support/chat`
- [ ] 8. Frontend: `/support` chat page, with entry points in the header
      and on `/orders`, checked at 375px
- [ ] 9. Backend: chat evaluation (`npm run eval:support`) including
      prompt-injection attempts, with latency and token counts

### Sprint 8 - Trusted Refund Context (L)

Real order and payment facts, never taken from the AI or the shopper's text.

- [ ] 1. Backend: add payment details to orders (Stripe payment id, amount
      in cents, payment status, amount refunded, line-item snapshot)
- [ ] 2. Backend: webhook saves those, only for paid sessions
- [ ] 3. Backend: one-time backfill for existing orders
- [ ] 4. Backend: match the shopper's description to one of **their own**
      orders, and ask when it's ambiguous
- [ ] 5. Backend: refund context from the order plus live Stripe data
- [ ] 6. Backend: refund policy engine as a pure, fully tested function
- [ ] 7. Backend: evaluation cases for someone else's order, an expired
      window, and an already-refunded order

### Sprint 9 - Decisions and Ticket Escalation (M)

- [ ] 1. Backend: `DecisionProvider` interface with a rules-based version
- [ ] 2. Backend: `Ticket` and `AuditEvent` models, ticket state machine
- [ ] 3. Backend: automatic ticket creation with the full case attached:
      conversation summary, policy references, policy result,
      recommendation, reason for escalation
- [ ] 4. Backend: shopper ticket routes (list, detail, reply)
- [ ] 5. Frontend: `/support/tickets` list and detail pages

### Sprint 10 - Support Desk (L)

- [ ] 1. Backend: support-agent role through Clerk, alongside admin
- [ ] 2. Frontend: role-aware navigation (`useIsSupportAgent`)
- [ ] 3. Backend: ticket queue and detail routes, deny and request-info
      actions
- [ ] 4. Frontend: `/admin/support` queue with status filters
- [ ] 5. Frontend: ticket detail: customer, order, payment, conversation,
      cited policy, policy checks, recommendation, history
- [ ] 6. Frontend: simple refund request form as a fallback if the AI is
      unavailable

### Sprint 11 - Stripe Test Refunds (L)

- [ ] 1. Backend: `Refund` model
- [ ] 2. Backend: refund service: reloads the ticket, order, and payment,
      re-checks the policy, calculates the amount itself, then refunds
      through Stripe with an idempotency key so it can only happen once
- [ ] 3. Backend: approve route and Stripe refund webhooks
- [ ] 4. Frontend: approve action; shopper sees "Refunded"
- [ ] 5. Backend: tests for double clicks, retries, and Stripe failures

### Sprint 12 - Evaluation and Hardening (M)

- [ ] 1. Backend: grow the evaluation set to 50+ cases (target 100+), one
      report covering intent accuracy, retrieval quality, made-up answer
      rate, escalation accuracy, security, latency, and cost
- [ ] 2. Backend: failure tests: AI timeout, bad AI output, embedding
      outage, missing search index, rate limits
- [ ] 3. Backend: tune model settings from the evaluation numbers
- [ ] 4. Backend: support metrics, including how often agents agree with
      the AI's recommendation
- [ ] 5. Backend: `docs/ai/` write-ups for the shipped system (RAG,
      refund workflow, security, evaluation)

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
