-- OUR DAY v5.20 - profile image storage access check/fix
-- 기존 오늘 사진 업로드가 이미 정상이라면 보통 실행할 필요가 없습니다.

drop policy if exists "our day couple photos insert" on storage.objects;
create policy "our day couple photos insert"
on storage.objects for insert to anon
with check (bucket_id = 'couple-photos');

drop policy if exists "our day couple photos select" on storage.objects;
create policy "our day couple photos select"
on storage.objects for select to anon
using (bucket_id = 'couple-photos');
