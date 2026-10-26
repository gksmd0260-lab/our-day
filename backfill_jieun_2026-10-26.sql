-- OUR DAY: 2026-10-26 지은 누락 기록 복구
-- Supabase SQL Editor에서 한 번 실행. 다른 날짜/사용자 기록에는 영향 없음.
-- 저장된 날의 노래가 없다면 앱 기록 → 10월 26일 → 그날 기록에서 '그날의 노래 추천받기' 실행.
begin;

insert into public.daily_answers(day,person,answer)
values ('2026-10-26','지은','클라이밍')
on conflict(day,person) do update set answer=excluded.answer;

insert into public.daily_moods(day,person,mood)
values ('2026-10-26','지은','보고싶어')
on conflict(day,person) do update set mood=excluded.mood;

insert into public.daily_diaries(day,person,diary)
values ('2026-10-26','지은','일요일에 최하능이랑 오랫동안 놀 수 있어서 좋았다. 영통하면서 시내 돌아다니긴 했는데 그래도 최하능이랑 같이 놀면 더 재밌엇을 것 같은데.. 아숩다 그리고 썸머타임이 끝나서 이젠 좀 더 못 볼 것 같아서 아쉬워ㅠ')
on conflict(day,person) do update set diary=excluded.diary;

insert into public.daily_missions(day,person,done,answer)
values ('2026-10-26','지은',true,
  '__OURDAY_MISSION_V2__'||json_build_object(
   'type','date_text','category','memory',
   'text','최하능이 내가 좋다고 말해줘서 지루할 뻔했던 하루가 행복해졋어',
   'date','2026-10-01',
   'attachmentUrl','','attachmentKind',''
  )::text
)
on conflict(day,person) do update set
  done=true,
  answer=excluded.answer;

commit;
