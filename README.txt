OUR DAY Shared v2

1) Supabase 프로젝트 생성
2) SQL Editor에서 supabase_setup.sql 전체 실행
3) Supabase Project Settings > API에서 Project URL과 anon/publishable key 확인
4) index.html의 CONFIG 안:
   SUPABASE_URL
   SUPABASE_ANON_KEY
   COUPLE_PIN
   RETURN_DATE
   값을 수정
5) GitHub 새 repository에 index.html / manifest.json / sw.js 업로드
6) Vercel에서 해당 GitHub repository Import 후 Deploy

주의
- 이 버전은 둘만 편하게 쓰는 개인 프로젝트용 단순 구조입니다.
- 브라우저에 anon/publishable key를 넣는 것은 Supabase의 일반적인 클라이언트 사용 방식이지만,
  반드시 RLS 정책으로 접근 범위를 제어해야 합니다.
- 현재 PIN은 프론트엔드 코드에 들어 있어 강한 보안 기능은 아닙니다.
  완전 비공개가 필요하면 다음 버전에서 Supabase Auth로 바꾸세요.
