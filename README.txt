OUR DAY v5.21 - PROFILE IMAGE RENDER FIX

수정
- 프로필 사진을 선택해도 초록색 원만 보이던 문제 수정
- 원인: .profileH / .profileJ의 !important background가 실제 사진 background-image를 덮어씀
- 선택한 사진이 원형 프로필 안에 cover 방식으로 표시되도록 수정
- "사진을 누르면 프로필 사진을 바꿀 수 있어." 안내 문구 제거
- 저장 성공/실패 문구는 필요할 때만 표시

업데이트
1. index.html / sw.js 교체
2. Commit → Vercel 배포
3. 추가 SQL / 환경변수 없음
