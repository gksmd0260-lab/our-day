OUR DAY v5.9 ARCHIVE UPGRADE

추가:
1. 하단 '노래' 탭
- 날짜별 오늘의 우리 노래 아카이브
- 분위기 키워드 / 곡명 / 가수 / 추천 이유
- YouTube 바로가기
- 최신 날짜순 정렬

2. 사진 탭 업그레이드
- 사진 클릭 시 '그날의 기록' 화면 표시
- 해당 사진
- 그날 오늘의 질문
- 하능 / 지은 답변
- 두 사람 기분
- 오늘의 우리 노래
- 미션 기록
을 한 화면에서 확인

3. 지난 기록
- 캘린더 상세에 오늘의 우리 노래도 표시
- 사진 클릭 시 그날 기록 화면으로 연결

4. 관리자 초기화
- daily_songs 추천곡 기록도 함께 삭제

기존 v5.8에서 daily_songs 테이블을 이미 만들었다면
Supabase SQL을 다시 실행할 필요 없음.

업데이트:
- index.html / manifest.json / sw.js 교체
- api/recommend-song.js 유지 또는 새 파일로 교체
- 새 index.html에 기존 SUPABASE_URL / SUPABASE_ANON_KEY 다시 입력
- Commit → Vercel 자동 배포
