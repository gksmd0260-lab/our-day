-- OUR DAY v5.2
-- 앱의 관리자 초기화 버튼이 Storage 사진 파일도 지울 수 있도록 DELETE 정책을 추가합니다.
-- Supabase > SQL Editor에서 한 번만 실행하세요.

drop policy if exists "public photo delete" on storage.objects;

create policy "public photo delete"
on storage.objects
for delete
to anon
using (bucket_id = 'couple-photos');
