# MegaMart

A React storefront: browse products, manage a cart, check out, and, signed in
as the one admin account to *create, edit, and delete* the catalogue itself.

Built to for Ecommerce webpages (fetch products, cart, checkout, routing),
extended past the brief to a full storefront with its own backend and a real
authenticated admin panel.

Live demo: <https://megamart-react-storefront.vercel.app>
Backend API repo: <https://github.com/Vros15/ecommerce-backend-api>

---

## What it does

- Fetches products from a live API and renders them in a grid, with real
  loading and error states
- Cart: add, quantity merges automatically on a repeat add, live total,
  checkout
- Clerk authentication: sign in / sign out from the header
- `/admin`: gated to a single admin account. Create, edit, and delete
  products against the live database, with server-side enforcement — not
  just a hidden route

---

## Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| UI | React 19 | Function components + hooks throughout, no class components |
| Build | Vite 8 | Fast dev server, no config overhead for a project this size |
| Routing | React Router 8 (`react-router`, not `react-router-dom`) | v8 merged the two packages |
| Auth | Clerk (`@clerk/clerk-react`) | Hosted auth, short-lived JWTs, no password/session handling to build myself |
| State | React Context + `useReducer` | Cart state is one flat array with one transition (add); Redux would be more machinery than the problem needs |
| Styling | Plain CSS, custom properties | No framework; avoids the overhead of CSS-in-JS or Tailwind for this project size |
| Backend | Node/Express/MongoDB, self-built, deployed on Vercel | Full control over write auth, query params, and response shape see the [backend repo](https://github.com/Vros15/ecommerce-backend-api) |
| Linting | oxlint | Faster than ESLint, sufficient for a project this size |

No test framework is wired up yet. Everything in this repo has been verified
against the live API and a real browser session instead see
[How this was verified](#how-this-was-verified).

---

## Architecture

```text
src/
├── api/
│   └── products.js          fetchProducts, fetchProductById — normalizes
│                             the API's Mongo shape (_id → id) once, here,
│                             so no component ever sees a database detail
├── assets/
│   ├── branding/              logo mark
│   └── nav-icons/              Lucide-style SVGs, injected inline so their
│                               currentColor stroke can be tinted by CSS
├── components/
│   ├── layout/               Header (desktop nav + mobile tab bar), SearchBar
│   ├── products/              ProductGrid, ProductCard, CategoryTabs/Grid
│   ├── cart/                  CartItem, CartSummary
│   ├── admin/                 AdminDashboard, AdminProductList, ProductForm
│   └── ui/                    Spinner, ImageWithFallback, Icon no domain knowledge
├── context/
│   ├── CartContext.jsx        the provider
│   └── cartReducer.js         state transitions as a plain function,
│                             no React import testable without rendering
├── hooks/
│   ├── useFetch.js            loading/error/data + refetch()
│   └── useAdminApi.js         authenticated write requests
├── lib/
│   ├── constants.js            API base URL, admin user id, pagination cap
│   ├── format.js
│   └── categories.js
├── pages/                     one per route: Home, Cart, Admin, NotFound
├── App.jsx                    route table
└── main.jsx                   provider tree: ClerkProvider > BrowserRouter >
                               CartProvider > App
```

**`pages/` vs `components/`** is the routing boundary a page maps to a URL
and composes components; nothing under `components/` knows what route it's
rendered on.

**`components/` is grouped by feature**, not type. `admin/` and `cart/` each
hold everything specific to that feature; `ui/` is reserved for components
with zero domain knowledge (a `Spinner` never learns what a product is).

**`cartReducer.js` is split from `CartContext.jsx`** so the state transitions
are a plain function inspectable and testable without mounting anything.

---

## Key design decisions

**Custom backend API**
(Read-only) An admin panel needs real writes, real auth, and a real database
so the backend is a separate Node/Express/MongoDB project I built and deployed
myself, documented in its own repo.

**One hardcoded `ADMIN_USER_ID`, not a roles system.** Clerk supports
`publicMetadata` roles, which would generalize better, but this is a public
portfolio demo with exactly one person who should ever write to it, not a
multi-tenant product. A roles system would be complexity spent on a problem
that doesn't exist yet. The client-side check only decides what renders; the
API independently checks the same ID server-side and returns `403` that's
the actual boundary, confirmed live via Postman (unauthenticated `POST
/api/products` returns `401`).

**Context + `useReducer` over Redux (or Zustand, etc.) for cart state.** One
piece of state, one array, one real transition (add, with quantity merging).
Pulling in a state library would be solving a problem this app doesn't have.

**No CSS framework; component-name-prefixed class names.** Vite bundles all
CSS together with no scoping, so `.title` from one component collides with
`.title` from another. Prefixing (`.product-card-title`, not `.title`) avoids
that without needing CSS Modules or a framework for a project this size.

**Clerk over a hand-rolled auth system.** Session handling, token refresh, and
password storage are exactly the kind of thing worth not building yourself.
Tokens expire in roughly 60 seconds, so `useAdminApi` fetches a fresh one on
every write rather than caching it.

**A fixed bottom tab bar on mobile, not a hamburger menu.** The original
header squeezed a logo, a full search bar, and three nav links onto one line
— on a phone, the search bar (the only flexible element) just got crushed.
Two other approaches were tried and dropped before this one: a hamburger menu
for Orders/sign-in freed up some width but not enough to matter without also
shrinking the search bar to an icon, and a toast notification on "Add to
Cart" ended up feeling redundant once the bottom bar's Cart badge already
updates live. The bottom bar mirrors Amazon's mobile app pattern for the same
reason they use it primary actions (Home, Orders, Account, Cart) stay
reachable with one tap regardless of scroll position, without competing with
the header for width. Icons are real SVG assets injected inline
(`src/components/ui/Icon.jsx`) rather than an `<img>`, specifically so their
`stroke="currentColor"` can inherit whatever color the tab's CSS sets —
that's what lets the active tab tint itself from one rule, using
react-router's own active-route detection instead of extra state.

---

## Getting started

```bash
npm install
npm run dev
```

Requires a `.env.local` (gitignored, not committed, see `.gitignore`) with:

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=https://ecommerce-backend-api-dusky.vercel.app/api   # optional, this is the default
```

The Clerk key must come from the **same Clerk instance** the backend API
validates tokens against, a key from a different instance will produce
tokens the API correctly rejects as unauthenticated.

### Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run oxlint |

---

## How this was verified

No automated test suite exists yet (see [Roadmap](#roadmap)). Every feature
in this repo was checked against real data instead of assumed correct:

- API responses inspected directly via curl/Postman before writing the
  frontend code that depends on them
- Cart, checkout, and admin CRUD clicked through in an actual running browser
  session, not just read for logic
- The admin write lock verified from both sides: an authenticated request
  from a real signed-in session succeeds, and an unauthenticated request to
  the same endpoint returns `401`
- A live pagination bug (products past the API's default 20-item page limit
  going invisible on both the storefront and the admin list) was caught from
  real usage, root-caused against the live API's actual response, and fixed
  see `MAX_PRODUCTS_LIMIT` in `src/lib/constants.js`
- The mobile layout checked at 375px and 1280px: no horizontal overflow at
  either width, the search bar and account nav swap correctly at the
  breakpoint, and the active tab bar item follows the actual route

---

## Roadmap

Full task-by-task plan and status: [`SPRINT.md`](./SPRINT.md).

Short version- What's planned next:

- Search, filter, and sort wired to the API's query parameters
- Product detail pages (`/products/:id`)
- Order history
- Automated tests
