-- Run in the Supabase SQL Editor before enabling owner editing.
-- Keep the archive's existing SELECT and INSERT policies.
begin;

alter table public.entries enable row level security;
revoke update on public.entries from anon;
grant update on public.entries to authenticated;

drop policy if exists entries_edit_owner_allow on public.entries;
create policy entries_edit_owner_allow
  on public.entries
  for update
  to authenticated
  using ((select auth.uid()) = owner)
  with check ((select auth.uid()) = owner);

-- Restrictive policies are combined with AND, so a pre-existing broad
-- UPDATE or ALL policy cannot allow editing somebody else's entry.
-- USING checks the old owner; WITH CHECK prevents ownership transfer.
drop policy if exists entries_edit_owner_guard on public.entries;
create policy entries_edit_owner_guard
  on public.entries
  as restrictive
  for update
  to public
  using ((select auth.uid()) = owner)
  with check ((select auth.uid()) = owner);

commit;
