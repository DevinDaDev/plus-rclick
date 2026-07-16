-- Right Click Plus — database schema (Stage 2)
-- Run this once in the Supabase SQL editor after creating the project.
-- Safe to re-run: everything is IF NOT EXISTS.

-- Customers (companies). Stage 3 links auth users to these rows.
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  company_name text not null,
  contact_name text not null,
  email text not null unique,
  phone text
);

-- Orders placed through the store. Stage 6 flips status to 'paid' via Stripe webhook.
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_id uuid references customers(id),
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'paid', 'fulfilled', 'cancelled')),
  shipping_address text not null,
  subtotal_cents integer not null,
  discount_cents integer not null default 0,
  discount_code text,
  tax_cents integer not null,
  total_cents integer not null,
  stripe_session_id text
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  device_id text not null,
  device_name text not null,
  plus_item_code text not null,
  qty integer not null check (qty > 0),
  unit_price_cents integer not null
);

-- Devices registered for Plus coverage (serial numbers).
create table if not exists registered_devices (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_id uuid references customers(id),
  company_name text not null,
  contact_name text not null,
  email text not null,
  device_id text not null,
  device_name text not null,
  device_category text not null check (device_category in ('network', 'computer')),
  plus_item_code text not null,
  serial_number text not null,
  plus_expires_at timestamptz not null default (now() + interval '1 year'),
  constraint registered_devices_serial_unique unique (serial_number)
);

-- Spare/replacement requests (the ticket queue). Stage 4 adds the status trail UI.
create table if not exists spare_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_id uuid references customers(id),
  registered_device_id uuid references registered_devices(id),
  company_name text not null,
  contact_name text not null,
  email text not null,
  phone text,
  device_id text not null,
  device_name text not null,
  serial_number text,
  reason text,
  preferred_contact text,
  status text not null default 'requested'
    check (status in ('requested', 'in_prep', 'shipped', 'returned', 'bought_out', 'closed'))
);

-- Config uploads metadata (files live in a PRIVATE storage bucket, Stage 5).
create table if not exists device_configs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  registered_device_id uuid not null references registered_devices(id) on delete cascade,
  storage_path text,
  rc_managed boolean not null default false,
  note text,
  version integer not null default 1
);

-- The API uses the service-role key only. Lock everything down for anon/authenticated;
-- Stage 3 adds narrow customer-scoped read policies.
alter table customers enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table registered_devices enable row level security;
alter table spare_requests enable row level security;
alter table device_configs enable row level security;
