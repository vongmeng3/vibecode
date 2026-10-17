-- Read-only diagnostics: run in the Supabase SQL Editor.
-- Replace NULL below with the signed-in user's UUID and the exact object path
-- (for example, the user's UUID followed by /filename.png, without a bucket URL).
-- Do not put keys or tokens here. This script changes no rows or permissions.
with expected as (
  select null::uuid as signed_in_user_id, null::text as object_path
)
select object.bucket_id, object.name, object.owner_id,
  expected.signed_in_user_id,
  (storage.foldername(object.name))[1] as first_folder,
  (storage.foldername(object.name))[1] = expected.signed_in_user_id::text as folder_matches_user,
  object.owner_id = expected.signed_in_user_id::text as owner_matches_user
from storage.objects as object
cross join expected
where object.bucket_id = 'photos' and object.name = expected.object_path;

-- Verify which SELECT/DELETE rules are actually installed in this project.
select schemaname, tablename, policyname, permissive, roles, cmd, qual
from pg_policies
where ((schemaname = 'storage' and tablename = 'objects')
  or (schemaname = 'public' and tablename = 'entries'))
  and cmd in ('SELECT', 'DELETE', 'ALL')
order by schemaname, tablename, policyname;

-- folder_matches_user must be TRUE for the photo cleanup policies.
-- owner_matches_user may be FALSE or NULL; cleanup no longer depends on it.
-- A wrong folder is not fixed by repeating remove(); keep RLS intact.
-- Retry only the captured photo after confirming the entry is gone, the same
-- account is signed in, and no remaining entry references that object.
