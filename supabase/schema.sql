-- Right Click Plus — device registrations
-- Run this once in the Supabase SQL editor (or via CLI) after creating the project.

create table if not exists registered_devices (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  company_name text not null,
  contact_name text not null,
  email text not null,
  device_id text not null,
  device_name text not null,
  device_category text not null check (device_category in ('network', 'computer')),
  plus_item_code text not null,
  serial_number text not null,
  -- one registration per serial number
  constraint registered_devices_serial_unique unique (serial_number)
);

-- The API uses the service-role key, so lock the table down for anon/authenticated.
alter table registered_devices enable row level security;
