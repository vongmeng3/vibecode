-- Run in the Supabase SQL Editor after the Lab 10 gate (status column,
-- reviewers table, is_reviewer and review_entry already exist).
--
-- Decision (Sprint 3 brief, "Can a reviewer take down something already
-- published?"): yes. A reviewer can take a published entry off the public
-- shelf by sending it back to its contributor as 'returned'. Nothing is
-- deleted and nothing in the entry is rewritten; ownership stays with the
-- contributor, who can fix it and send it for review again.
--
-- This is a separate door from review_entry on purpose, so the lab's
-- function (and attack 3 that tests it) stays exactly as written.
begin;

create or replace function public.take_down_entry(entry_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_reviewer() then
    return false;
  end if;
  update public.entries set status = 'returned'
    where id = entry_id and status = 'published';
  return found;
end;
$$;
revoke execute on function public.take_down_entry(uuid) from public, anon;
grant execute on function public.take_down_entry(uuid) to authenticated;

commit;
