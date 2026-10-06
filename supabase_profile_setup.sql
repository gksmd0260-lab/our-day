-- OUR DAY v5.19 - 공유 프로필 사진
create table if not exists public.couple_profiles (
  person text primary key,
  photo_url text,
  updated_at timestamptz default now()
);

alter table public.couple_profiles enable row level security;

drop policy if exists "public read write couple profiles" on public.couple_profiles;

create policy "public read write couple profiles"
on public.couple_profiles
for all
to anon
using (true)
with check (true);
