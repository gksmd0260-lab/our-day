OUR DAY v5.8 - AI 오늘의 우리 노래

1) Supabase SQL Editor에서 supabase_song_setup.sql 실행
2) OpenAI API key 생성
3) Google Cloud에서 YouTube Data API v3 활성화 후 API key 생성
4) Vercel > Settings > Environment Variables:
   OPENAI_API_KEY
   YOUTUBE_API_KEY
5) GitHub에 index.html / manifest.json / sw.js / api/recommend-song.js 업로드
6) index.html의 SUPABASE_URL / SUPABASE_ANON_KEY 다시 입력
7) Commit 후 Vercel Redeploy

API 키는 index.html에 넣지 말 것.
