OUR DAY v5

추가/수정
- 홈 화면 디자인 개선
- 오늘 상대방이 답변/기분/사진/미션을 남겼는지 홈에서 상태 표시
- 기념일 카드: 100/200/300/365/500/730/1000일 중 다음 일정 표시
- 사진 전용 갤러리 탭 추가
- 오늘 사진/지난 기록 사진/갤러리 사진을 눌러 크게 보기
- 모바일 '지금 기분' 버튼이 세로로 깨지지 않도록 가로 스크롤 방식 적용
- PIN 기본값 1001
- Service Worker를 network-first 방식으로 변경하여 새 배포 반영 개선
- 기존 365개 질문 / 기록 달력 / D-DAY / 함께한 날짜 기능 유지

업데이트 방법
1. GitHub의 index.html / manifest.json / sw.js를 이 버전 파일로 교체
2. 새 index.html의 CONFIG에 기존 SUPABASE_URL / SUPABASE_ANON_KEY를 다시 입력
3. COUPLE_PIN은 1001로 이미 설정되어 있음
4. Commit changes
5. Vercel 배포 완료 후 새로고침

Supabase SQL은 다시 실행할 필요 없습니다.
