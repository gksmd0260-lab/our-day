OUR DAY v5.22

수정
1. 지은 프로필 사진 업로드 안정화
- iPhone 사진(HEIC/HEIF 포함)을 가능하면 브라우저에서 JPEG로 변환 후 업로드
- 선택 즉시 미리보기
- 하능/지은 각각 별도 파일명으로 저장
- 같은 사진을 다시 선택해도 change 이벤트가 발생하도록 input 초기화
- 저장 실패 시 해당 사용자 이름과 오류 원인을 표시

2. 글꼴 통일
- 전체 UI를 iPhone/Android/Windows에서 자연스럽게 보이는 시스템 산세리프 계열로 통일
- OUR DAY 로고만 기존 serif 유지
- 홈 이름, 기록 월 제목, 카드 제목, 버튼, 입력창, 숫자 모두 동일 계열 적용

업데이트
- index.html / sw.js 교체
- Commit → Vercel 배포
- 추가 SQL / 환경변수 없음
