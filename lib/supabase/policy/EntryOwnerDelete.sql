-- Run in the Supabase SQL Editor before enabling entry deletion.
-- Preserve the archive's existing SELECT, INSERT and UPDATE policies.
begin;

alter table public.entries enable row level security;
revoke delete on public.entries from anon;
grant delete on public.entries to authenticated;

drop policy if exists entries_delete_owner_allow on public.entries;
create policy entries_delete_owner_allow
  on public.entries for delete to authenticated
  using ((select auth.uid()) = owner);

-- A broad pre-existing DELETE or ALL policy cannot bypass this guard.
drop policy if exists entries_delete_owner_guard on public.entries;
create policy entries_delete_owner_guard
  on public.entries as restrictive for delete to public
  using ((select auth.uid()) = owner);

-- Storage remove() needs both SELECT and DELETE permission on the object.
-- Ownership is the first folder of the path: the app always uploads to
-- "<user id>/<file>". Do NOT also require owner_id. It is NULL or different
-- for files added from the dashboard, a seed script or an anonymous upload,
-- and then remove() silently returns an empty list, so the photo stays in
-- Storage while the entry is already gone.
drop policy if exists photos_owner_cleanup_select on storage.objects;
create policy photos_owner_cleanup_select
  on storage.objects for select to authenticated
  using (bucket_id = 'photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists photos_owner_cleanup_delete on storage.objects;
create policy photos_owner_cleanup_delete
  on storage.objects for delete to authenticated
  using (bucket_id = 'photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text);

-- Because the folder decides ownership, nobody may upload into another
-- user's folder. The app's uploads already use the signed-in user's folder.
drop policy if exists photos_owner_folder_insert_guard on storage.objects;
create policy photos_owner_folder_insert_guard
  on storage.objects as restrictive for insert to public
  with check (
    bucket_id <> 'photos'
    or (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- Keep referenced photos even if another permissive storage policy exists.
-- Other buckets keep their existing rules.
drop policy if exists photos_owner_cleanup_guard on storage.objects;
create policy photos_owner_cleanup_guard
  on storage.objects as restrictive for delete to public
  using (
    bucket_id <> 'photos'
    or (
      (storage.foldername(name))[1] = (select auth.uid())::text
      and not exists (
        select 1 from public.entries as entry
        where strpos(entry.image, '/storage/v1/object/public/photos/' || storage.objects.name) > 0
      )
    )
  );

commit;
