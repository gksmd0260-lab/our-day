-- OUR DAY v5.30 mission answer migration
alter table public.daily_missions
add column if not exists answer text;
