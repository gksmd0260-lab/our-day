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

    const prompt=`너는 연애 초반 커플의 하루 기록을 바탕으로 '오늘의 우리 BGM' 1곡을 추천하는 음악 큐레이터야.

핵심 원칙:
- '연애에 어울리는 달달한 노래'를 고르는 것이 아니라, 오늘 두 사람의 하루 분위기에 가장 잘 맞는 BGM을 고를 것.
- 질문과 답변에서 장난스러움, 편안함, 활기, 피로, 그리움, 차분함, 들뜸 같은 하루의 에너지를 읽을 것.
- 반드시 사랑 노래일 필요는 없다. 가사가 연애와 직접 관련 없어도 오늘의 분위기에 잘 맞으면 추천 가능하다.
- 실제 존재하는 대중음악 1곡만 추천할 것.
- 한국곡/해외곡 모두 가능하며 국적보다 분위기 적합도를 우선할 것.

다양성 규칙:
- 최근 14곡과 같은 곡은 절대 다시 추천하지 말 것.
- 최근 7곡 안에 나온 아티스트는 가능하면 피할 것.
- 최근 곡들과 장르가 비슷하면 다른 장르도 적극적으로 고려할 것.
- 비슷한 템포가 연속되면 빠른 곡/느린 곡/중간 템포를 바꿔볼 것.
- 최근 곡들이 인디·R&B에 몰렸다면 록, 밴드, 팝, 시티팝, 일렉트로닉, 힙합, K-pop, 올드팝 등 다른 결도 고려할 것.
- 최근 곡들이 최신곡에 몰렸다면 1990~2010년대 또는 클래식한 대중음악도 고려할 것.
- 반대로 오래된 곡만 나오지 않도록 최신곡도 섞을 것.
- 유명한 대표곡만 반복적으로 선택하지 말고, 분위기에 잘 맞는 덜 뻔한 곡도 고려할 것.
- 한국곡과 해외곡이 한쪽으로 몰리지 않게 최근 기록을 참고할 것.
- 단, 다양성을 위해 오늘 분위기와 안 맞는 곡을 억지로 고르지는 말 것.
- 지나치게 이별, 불륜, 절망, 관계 파국이 중심인 곡은 피할 것.

출력:
- reason은 한국어 2문장 이내, 90자 이내.
- mood_tags는 오늘의 분위기를 나타내는 한국어 2~3개.
- JSON만 출력할 것.

최근 추천곡:
${recentText}

질문: ${question}
하능 답변: ${answers.haneung}
지은 답변: ${answers.jieun}
하능 기분: ${moods.haneung}
지은 기분: ${moods.jieun}

형식:
{"song_title":"곡명","artist":"아티스트","reason":"짧은 이유","mood_tags":["키워드1","키워드2"]}`;
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
