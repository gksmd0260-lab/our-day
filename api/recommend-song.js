export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { day, question, answers, moods, diaries, recent_songs = [] } = req.body || {};
    if (!question || !answers?.haneung || !answers?.jieun || !moods?.haneung || !moods?.jieun || !diaries?.haneung || !diaries?.jieun) return res.status(400).json({ error: "두 사람의 답변, 기분, 한 줄 일기가 모두 필요해." });
    const openaiKey=process.env.OPENAI_API_KEY, youtubeKey=process.env.YOUTUBE_API_KEY;
    if(!openaiKey) return res.status(500).json({error:"OPENAI_API_KEY가 Vercel에 설정되지 않았어."});
    if(!youtubeKey) return res.status(500).json({error:"YOUTUBE_API_KEY가 Vercel에 설정되지 않았어."});
    
    // 20일 언어 순환: 한국어 8(40%) / 영어 7(35%) / 일본어 4(20%) / 중국어 1(5%).
    // 순환 경계까지 포함해 같은 언어가 이틀 연속 나오지 않도록 배치했다.
    const languageCycle=[
      "ko","en","ja","ko","en","ko","ja","en","ko","en",
      "ja","ko","en","ko","ja","en","ko","en","zh","ko"
    ];
    const languageLabels={
      ko:"한국어",
      en:"영어",
      ja:"일본어",
      zh:"중국어"
    };
    const languageInstructions={
      ko:"가사가 주로 한국어인 곡을 추천할 것. K-pop, 한국 인디, 밴드, R&B, 힙합, 발라드 등 장르는 자유롭게 선택.",
      en:"가사가 주로 영어인 곡을 추천할 것. 미국/영국뿐 아니라 영어권 전반에서 선택 가능.",
      ja:"가사가 주로 일본어인 곡을 추천할 것. J-pop, 시티팝, 일본 밴드, 인디, R&B 등에서 선택.",
      zh:"가사가 주로 중국어인 곡을 추천할 것. 너무 마이너한 곡보다는 한국 사용자도 들어본 적 있을 법한 유명 OST, 대만 드라마/영화 OST, 대만·중화권 대중가요를 우선 고려할 것. 곡의 유명도보다 오늘 두 사람의 분위기와의 적합도가 더 중요하지만, 분위기가 비슷하다면 더 익숙하고 접근성 좋은 곡을 선택할 것."
    };
    const languageAnchor=new Date("2026-10-12T00:00:00+09:00");
    const languageDay=new Date(String(day||new Date().toISOString().slice(0,10))+"T00:00:00+09:00");
    const languageIndex=((Math.floor((languageDay-languageAnchor)/86400000)%languageCycle.length)+languageCycle.length)%languageCycle.length;
    const targetLanguage=languageCycle[languageIndex];
    const targetLanguageLabel=languageLabels[targetLanguage];
    const targetLanguageInstruction=languageInstructions[targetLanguage];

    const laneIndex=(()=>{
      const source=String(day||new Date().toISOString().slice(0,10));
      let h=0;
      for(const ch of source) h=(h*31+ch.charCodeAt(0))>>>0;
      return h%6;
    })();
    const lanes=[
      "팝/대중음악",
      "인디/밴드/록",
      "R&B/소울",
      "힙합/그루브",
      "시티팝/레트로",
      "포크/일렉트로닉/기타 장르"
    ];
    const diversityLane=lanes[laneIndex];

    const recentText=(recent_songs||[]).length
      ? (recent_songs||[]).map((s,i)=>`${i+1}. ${s.song_title} - ${s.artist}`).join("\n")
      : "없음";

    const prompt=`너는 연애 초반 커플의 하루 기록을 바탕으로 '오늘의 우리 BGM' 1곡을 추천하는 음악 큐레이터야.

핵심 원칙:
- '연애에 어울리는 달달한 노래'를 고르는 것이 아니라, 오늘 두 사람의 하루 분위기에 가장 잘 맞는 BGM을 고를 것.
- 질문과 답변에서 장난스러움, 편안함, 활기, 피로, 그리움, 차분함, 들뜸 같은 하루의 에너지를 읽을 것.
- 반드시 사랑 노래일 필요는 없다. 가사가 연애와 직접 관련 없어도 오늘의 분위기에 잘 맞으면 추천 가능하다.
- 실제 존재하는 대중음악 1곡만 추천할 것.
- 오늘 지정된 언어권 안에서 고르되, 그 안에서는 오늘 분위기 적합도를 가장 우선할 것.
- 추천의 최우선 기준은 질문 답변, 기분, 한 줄 일기에서 읽히는 그날의 실제 분위기다. 언어 비율이나 장르 다양성은 그 다음 기준으로 적용할 것.
- 다양성을 맞추기 위해 분위기와 상관없는 곡을 억지로 끼워 넣지 말 것.
- 같은 조건이라면 지나치게 마이너하거나 낯선 곡보다 대중적으로 어느 정도 알려졌고 쉽게 들을 수 있는 곡을 우선할 것.
- 언어 분류는 아티스트 국적이 아니라 실제 보컬/가사의 주 사용 언어를 기준으로 할 것.

다양성 규칙:
- 최근 14곡과 같은 곡은 절대 다시 추천하지 말 것.
- 최근 7곡 안에 나온 아티스트는 가능하면 피할 것.
- 최근 곡들과 장르가 비슷하면 다른 장르도 적극적으로 고려할 것.
- 비슷한 템포가 연속되면 빠른 곡/느린 곡/중간 템포를 바꿔볼 것.
- 최근 곡들이 인디·R&B에 몰렸다면 록, 밴드, 팝, 시티팝, 일렉트로닉, 힙합, K-pop, 올드팝 등 다른 결도 고려할 것.
- 최근 곡들이 최신곡에 몰렸다면 1990~2010년대 또는 클래식한 대중음악도 고려할 것.
- 반대로 오래된 곡만 나오지 않도록 최신곡도 섞을 것.
- 유명한 대표곡만 반복적으로 선택하지 말되, 지나치게 마이너하거나 맥락 없는 곡은 피할 것.
- OST는 적극 추천 가능하다. 특히 일본어·중국어 차례에는 영화/드라마/애니메이션 OST 중 오늘 분위기와 잘 맞고 비교적 인지도가 있는 곡을 우선 후보로 둘 것.
- 언어 비율은 20일 기준으로 한국어 40%, 영어 35%, 일본어 20%, 중국어 5%를 목표로 한다.
- 오늘의 지정 언어는 반드시 '${targetLanguageLabel}'이다.
- 오늘 언어 지침: ${targetLanguageInstruction}
- 같은 언어가 이틀 연속 나오지 않도록 한다. 최근 추천곡을 보고 직전 곡과 같은 주 사용 언어로 판단되면 후보를 바꿀 것.
- 특히 영어권 팝으로 편중되지 않도록 일본어·중국어 차례에는 반드시 해당 언어권 곡을 고를 것.
- 오늘의 장르 다양성 방향: ${diversityLane}. 지정 언어 안에서 가능한 한 이 장르 결을 우선 고려할 것.
- 최근 3곡과 같은 넓은 장르 결을 연속해서 고르지 말 것.
- 단, 가사 정서가 오늘 기록과 정면으로 충돌하는 곡은 피할 것.
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
하능 한 줄 일기: ${diaries.haneung}
지은 한 줄 일기: ${diaries.jieun}

형식:
{"song_title":"곡명","artist":"아티스트","language":"${targetLanguageLabel}","reason":"짧은 이유","mood_tags":["키워드1","키워드2"]}`;
    const oa=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{Authorization:`Bearer ${openaiKey}`,"Content-Type":"application/json"},body:JSON.stringify({model:"gpt-6-luna",input:prompt})});
    const oaData=await oa.json(); if(!oa.ok) return res.status(502).json({error:oaData?.error?.message||"OpenAI 추천 생성 실패"});
    const raw=oaData.output_text||oaData.output?.flatMap(x=>x.content||[]).find(x=>x.type==="output_text")?.text||"";
    let song; try{song=JSON.parse(raw.replace(/^```json\s*/i,"").replace(/```$/,"").trim());}catch{ return res.status(502).json({error:"AI 추천 결과를 읽지 못했어. 다시 시도해줘."}); }
    if(!song.song_title||!song.artist) return res.status(502).json({error:"AI가 곡 정보를 완성하지 못했어."});
    const u=new URL("https://www.googleapis.com/youtube/v3/search");
    u.searchParams.set("part","snippet");u.searchParams.set("q",`${song.artist} ${song.song_title} official audio`);u.searchParams.set("type","video");u.searchParams.set("maxResults","5");u.searchParams.set("regionCode","KR");u.searchParams.set("safeSearch","moderate");u.searchParams.set("key",youtubeKey);
    const yt=await fetch(u), ytData=await yt.json(); if(!yt.ok) return res.status(502).json({error:ytData?.error?.message||"YouTube 검색 실패"});
    const item=(ytData.items||[]).find(x=>x.id?.videoId), videoId=item?.id?.videoId||null;
    return res.status(200).json({song_title:song.song_title,artist:song.artist,language:song.language||targetLanguageLabel,reason:song.reason||"오늘 두 사람의 분위기와 잘 어울리는 곡이야.",mood_tags:Array.isArray(song.mood_tags)?song.mood_tags.slice(0,3):[],youtube_video_id:videoId,youtube_url:videoId?`https://www.youtube.com/watch?v=${videoId}`:null});
  } catch(e){console.error(e);return res.status(500).json({error:e.message||"서버 오류"});}
}
