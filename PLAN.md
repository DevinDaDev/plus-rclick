# Right Click Plus — Build Plan (v2: store + accounts + requests)

Working rule: each stage ships deployed and testable on its own. Stripe money-movement
is LAST — everything else works before we wire payments.

## Stage 1 — Cart & product pages (front end, no payments) — NO BLOCKERS
- Device cards: button becomes **Add to cart**; clicking the image or name opens a
  product detail page (`/devices/[id]`) with a bigger photo, description, specs list,
  what Plus includes, and Add to cart.
- **Cart drawer** slides in from the right when an item is added (and from a cart icon
  in the header): line items with photo, qty +/- steppers, remove, subtotal, estimated
  tax, discount-code field, total, Checkout button. Cart persists in localStorage.
- **Checkout page** (`/checkout`): contact + company + shipping form, order summary.
  "Place order" submits the order (no card yet — see Stage 2) and shows a confirmation
  screen. Discount codes validated against a simple list for now.
- Tax: flat CA sales-tax estimate for now (marked TODO; Stripe Tax replaces it later).

## Stage 2 — Supabase foundation — NEEDS: Devin creates the Supabase project
- Tables: `customers`, `orders`, `order_items`, `registered_devices`,
  `spare_requests`, `device_configs`. RLS on everything; API routes use service role.
- Stage-1 checkout writes a real order (status: `pending_payment`) and sends the
  confirmation email via Resend (already wired).
- Serial-number registration and the request form write to these tables too.
- Devin's step: create project at supabase.com → run my schema.sql → add
  SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY to Vercel.

## Stage 3 — Accounts & login
- Supabase Auth with **email magic links** (no passwords to forget/support).
- Placing an order auto-creates the account; confirmation email doubles as the
  "sign in to your account" invite.
- `/account` dashboard: My Devices (registered, with Plus expiry), My Orders,
  My Requests. Devices from an order are auto-attached to the account; serials get
  registered by the customer (or our team) after delivery.

## Stage 4 — Spare requests become tickets
- Logged-in flow: in My Devices, every covered device has a **Request spare** button —
  no form re-typing, the account info rides along. One optional "what happened" note.
- Creates a `spare_requests` row with a status trail (Requested → In prep → Shipped →
  Returned / Bought out) the customer can see in their account.
- Team notification: email to the team inbox immediately; RcDevDash/ticketing
  integration is one function swap later (the delivery function is already isolated).
- The public /request form stays as the no-login fallback and writes into the same
  table, so the team sees everything in one place.

## Stage 5 — Configuration upload & management
- Per registered **network** device in My Devices: "Configuration" panel with
  - upload a config/backup file (Supabase Storage, PRIVATE bucket, signed URLs only), or
  - mark "Right Click manages my config" (e.g. Ubiquiti cloud-managed — team handles it).
- Version history kept (each upload is a new version, nothing overwritten).
- Team gets notified on new uploads. Configs are sensitive — service-role access only,
  never public, encrypted at rest by Supabase.

## Stage 6 — Stripe wiring — NEEDS: Stripe API key (after approval)
- Cart checkout hands off to Stripe (payment element or hosted checkout) using the
  Stage-1/2 order as the source of truth; webhook marks order `paid`.
- Stripe Tax replaces the flat estimate; discount codes become Stripe coupons.
- Paid order → confirmation email → account invite → devices appear in My Devices.

## Open decisions (defaults I'll use unless told otherwise)
- Tax estimate: flat 7.75%% CA placeholder until Stripe Tax. (TODO marker in code)
- Discount codes: hardcoded list in Stage 1, Supabase table in Stage 2.
- Team notifications: email to devin@rclick.com until the domain is verified in
  Resend / a team inbox is chosen; RcDevDash tickets later.
- Magic-link login over passwords (less support burden for small-biz users).
