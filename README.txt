OUR DAY v5.23

수정 1) 글꼴
- 전체 UI: Gowun Dodum
- OUR DAY / 홈 이름 / 카드 제목 / 질문 / 기록 제목 / 노래 제목: Gowun Batang
- 이전보다 딱딱하지 않고 조금 더 감성적인 분위기로 조정
- 너무 손글씨 느낌은 피하고 읽기 편한 정도로 유지

수정 2) 프로필 사진 재변경
- 기존 hidden input 재사용 방식 제거
- 프로필 사진을 누를 때마다 새 파일 선택 input을 생성
- 따라서 첫 변경 후 다른 사진으로 다시 바꿀 때도 정상적으로 change 이벤트 발생
- 새 이미지 URL에 캐시 방지 값도 저장해 이전 사진이 남는 현상 방지

업데이트
- index.html / sw.js 교체
- Commit → Vercel 배포
- 추가 SQL / 환경변수 없음
