OUR DAY v5.19 - PROFILE PHOTO

변경
- OUR DAY 아래의 하능/지은 한글 표시 제거 유지
- 홈 '우리 기록'의 원형 사진 아래 한글 이름 제거
- HaNeung & JiEun을 두 원형 사진 아래 중앙 배치
- 원형 사진을 눌러 프로필 사진 변경 가능
- 프로필 사진은 Supabase에 저장되어 하능/지은 두 기기에서 동일하게 보임

필수 1회
Supabase > SQL Editor에서
supabase_profile_setup.sql 전체 실행

사진 변경 방법
1. 홈 > 우리 기록
2. 바꾸고 싶은 원형 사진 누르기
3. 휴대폰/PC에서 사진 선택
4. 자동 업로드 후 바로 반영

업데이트
1. supabase_profile_setup.sql 실행
2. index.html / sw.js 교체
3. 기존 Supabase URL/Key 확인
4. Commit → Vercel 배포

추가 Vercel 환경변수 없음
