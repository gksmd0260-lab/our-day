OUR DAY v5.2

추가:
- 홈 > 관리자 > 테스트 데이터 전체 초기화
- 관리자 PIN 확인
- 2단계 삭제 확인
- daily_answers / daily_moods / daily_photos / daily_missions 전체 삭제
- couple-photos Storage 실제 이미지 파일까지 삭제
- 초기화 후 화면 자동 갱신

기본 ADMIN_PIN = 1001

필수 1회 작업:
1. Supabase > SQL Editor
2. supabase_reset_policy.sql 내용 전체 붙여넣기
3. Run

업데이트:
- index.html / manifest.json / sw.js를 GitHub에 교체
- 기존 SUPABASE_URL / SUPABASE_ANON_KEY 다시 입력
- Commit 후 Vercel 재배포
