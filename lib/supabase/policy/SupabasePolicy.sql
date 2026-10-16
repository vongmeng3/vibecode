begin;

alter table public.entries
  add constraint entries_title_required
  check (
    title_en ~ '[^[:space:]]'
    or title_kh ~ '[^[:space:]]'
  ),

  add constraint entries_description_required
  check (
    description_en ~ '[^[:space:]]'
    or description_kh ~ '[^[:space:]]'
  ),

  add constraint entries_contributor_required
  check (
    contributor_en ~ '[^[:space:]]'
    or contributor_kh ~ '[^[:space:]]'
  ),

  add constraint entries_place_required
  check (
    place_en ~ '[^[:space:]]'
    or place_kh ~ '[^[:space:]]'
  ),

  add constraint entries_photo_required
  check (
    image is not null
    and image ~ '[^[:space:]]'
  );

commit;
