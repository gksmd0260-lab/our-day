export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { question, answers, moods, recent_songs = [] } = req.body || {};
    if (!question || !answers?.haneung || !answers?.jieun || !moods?.haneung || !moods?.jieun) return res.status(400).json({ error: "두 사람의 답변과 기분이 모두 필요해." });
    const openaiKey=process.env.OPENAI_API_KEY, youtubeKey=process.env.YOUTUBE_API_KEY;
    if(!openaiKey) return res.status(500).json({error:"OPENAI_API_KEY가 Vercel에 설정되지 않았어."});
    if(!youtubeKey) return res.status(500).json({error:"YOUTUBE_API_KEY가 Vercel에 설정되지 않았어."});
    const recentText=(recent_songs||[]).length
      ? (recent_songs||[]).map((s,i)=>`${i+1}. ${s.song_title} - ${s.artist}`).join("\n")
      : "없음";
    const prompt=`너는 연애 초반 커플의 하루 기록을 바탕으로 '오늘의 우리 노래' 1곡을 추천하는 큐레이터야.\n\n조건:\n- 답변과 기분을 가볍고 따뜻하게 해석할 것.\n- 과한 심리분석, 관계 진단, 미래 예측은 하지 말 것.\n- 실제 존재하는 대중음악 1곡만 추천할 것.\n- 한국곡/해외곡 모두 가능하고, 국적보다 오늘 분위기 적합도를 우선할 것.\n- 최근 추천곡 목록을 보고 한국곡과 해외곡이 한쪽으로 몰리지 않게 균형을 잡을 것.\n- 최근 14곡에서 한국곡이 많았다면 해외곡을 더 적극적으로 고려하고, 해외곡이 많았다면 한국곡도 적극 고려할 것.\n- 단, 분위기와 전혀 맞지 않는 곡을 억지로 선택하지는 말 것.\n- 최근 14곡과 같은 곡은 다시 추천하지 말 것.\n- 최근 7곡 안에 나온 아티스트는 가능하면 피할 것.\n- 장르/템포/정서가 며칠 연속 비슷하게 반복되지 않게 다양성을 줄 것.\n- 지나치게 이별/불륜/절망 중심의 곡은 피할 것.\n- reason은 한국어 2문장 이내, 90자 이내.\n- mood_tags는 한국어 2~3개.\n- JSON만 출력.\n\n최근 추천곡:\n${recentText}\n\n질문: ${question}\n하능 답변: ${answers.haneung}\n지은 답변: ${answers.jieun}\n하능 기분: ${moods.haneung}\n지은 기분: ${moods.jieun}\n\n형식: {"song_title":"곡명","artist":"아티스트","reason":"짧은 이유","mood_tags":["키워드1","키워드2"]}`;
    const oa=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{Authorization:`Bearer ${openaiKey}`,"Content-Type":"application/json"},body:JSON.stringify({model:"gpt-6-luna",input:prompt})});
    const oaData=await oa.json(); if(!oa.ok) return res.status(502).json({error:oaData?.error?.message||"OpenAI 추천 생성 실패"});
    const raw=oaData.output_text||oaData.output?.flatMap(x=>x.content||[]).find(x=>x.type==="output_text")?.text||"";
    let song; try{song=JSON.parse(raw.replace(/^```json\s*/i,"").replace(/```$/,"").trim());}catch{ return res.status(502).json({error:"AI 추천 결과를 읽지 못했어. 다시 시도해줘."}); }
    if(!song.song_title||!song.artist) return res.status(502).json({error:"AI가 곡 정보를 완성하지 못했어."});
    const u=new URL("https://www.googleapis.com/youtube/v3/search");
    u.searchParams.set("part","snippet");u.searchParams.set("q",`${song.artist} ${song.song_title} official audio`);u.searchParams.set("type","video");u.searchParams.set("maxResults","5");u.searchParams.set("regionCode","KR");u.searchParams.set("safeSearch","moderate");u.searchParams.set("key",youtubeKey);
    const yt=await fetch(u), ytData=await yt.json(); if(!yt.ok) return res.status(502).json({error:ytData?.error?.message||"YouTube 검색 실패"});
    const item=(ytData.items||[]).find(x=>x.id?.videoId), videoId=item?.id?.videoId||null;
    return res.status(200).json({song_title:song.song_title,artist:song.artist,reason:song.reason||"오늘 두 사람의 분위기와 잘 어울리는 곡이야.",mood_tags:Array.isArray(song.mood_tags)?song.mood_tags.slice(0,3):[],youtube_video_id:videoId,youtube_url:videoId?`https://www.youtube.com/watch?v=${videoId}`:null});
  } catch(e){console.error(e);return res.status(500).json({error:e.message||"서버 오류"});}
}
