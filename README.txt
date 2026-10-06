OUR DAY v5.15 - 한 줄 일기

추가 기능
- 하능/지은 각자 오늘의 한 줄 일기 작성
- 한 명만 작성한 상태에서는 상대방 일기 비공개
- 둘 다 작성 완료해야 서로의 일기 동시 공개
- 지난 기록에서 날짜별 일기 확인
- 사진을 누른 '그날의 기록'에도 일기 표시
- 노래 추천에 질문 답변 + 기분 + 두 사람의 한 줄 일기까지 반영
- 추천 버튼은 두 사람의 질문/기분/일기가 모두 준비된 뒤 활성화
- 관리자 전체 초기화에 일기 데이터 포함

필수 1회
Supabase > SQL Editor에서 supabase_diary_setup.sql 전체 실행

업데이트
1. supabase_diary_setup.sql 실행
2. index.html / sw.js / api/recommend-song.js 교체
3. index.html의 기존 SUPABASE_URL / SUPABASE_ANON_KEY 확인
4. Commit → Vercel 배포

추가 환경변수는 필요 없습니다.
