OUR DAY v5.20 - iPhone 프로필 사진 변경 수정

수정
- iPhone Safari에서 사진을 선택해도 프로필이 안 바뀌던 문제 수정
- element id를 전역변수처럼 쓰지 않고 document.getElementById로 명확히 참조
- 사진 선택 직후 원형 프로필에 즉시 미리보기 표시
- Supabase 저장 완료/실패 메시지를 홈에 표시
- 저장 실패 시 기존 서버 사진으로 자동 복원

업데이트
1. index.html / sw.js 교체
2. Commit → Vercel 배포
3. 기존 v5.19에서 supabase_profile_setup.sql을 이미 실행했다면 추가 SQL 없음

만약 '프로필 사진 변경 실패: new row violates row-level security policy' 같은 문구가 뜨는 경우에만
supabase_profile_storage_fix.sql을 Supabase SQL Editor에서 1회 실행
