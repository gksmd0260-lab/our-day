-- OUR DAY v5.37: add discovery song fields
alter table public.daily_songs
  add column if not exists discovery_song_title text,
  add column if not exists discovery_artist text,
  add column if not exists discovery_reason text,
  add column if not exists discovery_youtube_url text,
  add column if not exists discovery_youtube_video_id text;
