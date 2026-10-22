-- OUR DAY v5.45: 필름 시뮬레이터 사진 원본 저장
-- 기존 사진은 url 컬럼 그대로 보존되며 새 업로드부터 원본과 프리셋이 함께 저장됩니다.
alter table public.daily_photos
  add column if not exists original_url text,
  add column if not exists filter_preset text default 'original';
