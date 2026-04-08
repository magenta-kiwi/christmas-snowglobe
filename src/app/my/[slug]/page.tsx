"use client";
import { use, useEffect, useState } from "react";
import { getLetters } from "../../actions";
import MusicPlayer from "../../components/musicplayer";
import PhysicsSnowglobe from "../../components/physics-snowglobe";
import Snowfall from "../../components/snow";
import Snowglobe from "../../components/snowglobe";

const EMOJIS = ["☃️", "🎁", "🎄", "🎅", "💝", "⭐", "💚", "❄️"];
const nickNames = [
  "눈송이",
  "눈사람",
  "산타",
  "스노우맨",
  "선물상자",
  "딸기케이크",
  "마카롱",
  "럭키",
  "테디베어",
  "솜사탕",
  "요정",
  "핫초코",
  "붕어빵",
  "군고구마",
  "귤",
  "오로라",
  "반짝이",
  "솔방울",
  "얼음꽃",
  "달빛",
  "눈꽃",
  "구름",
  "목도리",
];

export default function MyBoxPage({ params }: any) {
  const { slug } = use(params) as { slug: string };
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const key = searchParams.get("key");
    async function fetchLetters() {
      if (!key) {
        alert("잘못된 접근입니다.");
        return;
      }
      const result = await getLetters(slug, key); // key 전달
      if (result.success) {
        setData(result);
      } else {
        alert(result.error);
      }
    }
    fetchLetters();
  }, [slug]);

  if (!data)
    return (
      <div className="min-h-screen bg-[#850E35] flex items-center justify-center text-white">
        스노우볼 가져오는 중... ❄️
      </div>
    );

  return (
    <div className="relative min-h-screen bg-[#850E35] py-10 px-4 flex flex-col items-center justify-center">
      <Snowfall />
      <MusicPlayer />

      <h1 className="relative z-10 text-2xl font-black text-white mb-2 drop-shadow-md mt-10">
        ❄️ {data.userName}님의 스노우볼 ❄️
      </h1>
      <p className="relative z-10 text-red-200 text-sm mb-8">
        {data.isLocked
          ? `현재 ${data.count}개의 편지가 도착했어요`
          : `총 ${data.count}개의 편지가 도착했어요. 메리 크리스마스!`}
      </p>

      {/* 1. 크리스마스 전: 스노우볼 시각화 모드 */}
      {data.isLocked ? (
        <div className="flex flex-col items-center animate-fadeIn">
          <Snowglobe>
            <Snowfall mode="contained" />
            <PhysicsSnowglobe count={data.count} />
          </Snowglobe>

          <div className="mt-10 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-center">
            <p className="text-yellow-400 font-bold mb-2">
              🔒 아직은 열어볼 수 없어요!
            </p>
            <p className="text-white text-sm leading-relaxed">
              크리스마스 당일이 되면
              <br />
              스노우볼 안의 편지들을 읽어볼 수 있어요.
            </p>
          </div>
        </div>
      ) : (
        /* 2. 크리스마스 당일: 편지 목록 모드 */
        <div className="w-full max-w-md space-y-8 animate-fadeIn pb-24 px-2">
          {data.letters.map((letter: any, i: any) => {
            // 인덱스를 활용해 닉네임을 고정적으로 선택 (리렌더링 시 변하지 않음)
            const randomNick = nickNames[i % nickNames.length];

            // 카드마다 약간씩 다른 회전각도를 주어 자연스럽게 배치
            const rotation = i % 2 === 0 ? "rotate-1" : "-rotate-1";

            return (
              <div
                key={i}
                className={`relative bg-white rounded-[2.5rem] p-8 shadow-2xl border-b-8 border-red-100 transform transition-transform hover:scale-[1.02] ${rotation}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* 장식용 마스킹 테이프 느낌 */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-red-500/20 backdrop-blur-sm rounded-md rotate-2 z-10" />

                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#D84040] uppercase tracking-widest mb-1">
                      From.
                    </span>
                    <span className="text-lg font-black text-gray-800">
                      익명의 {randomNick}
                    </span>
                  </div>

                  {/* 우표 느낌의 키워드 박스 */}
                  <div className="flex flex-col items-center justify-center w-15 h-10 bg-red-50 border-4 border-dashed border-red-200 rounded-xl rotate-3">
                    <span className="text-2xl">
                      {/* {i % 2 === 0 ? "🎁" : "🎄"} */}
                    </span>
                    <span className="text-[10px] font-bold text-red-400">
                      {letter.keyword}
                    </span>
                  </div>
                </div>

                {/* 편지 내용 */}
                <div className="relative">
                  {/* 장식용 따옴표 */}
                  <span className="absolute -top-2 -left-2 text-4xl text-red-100 font-serif">
                    "
                  </span>
                  <p className="relative z-10 text-gray-700 leading-relaxed whitespace-pre-wrap font-medium pl-2">
                    {letter.content}
                  </p>
                </div>

                {/* 하단 음악 섹션 */}
                {letter.song && (
                  <div className="mt-8 pt-5 border-t border-dashed border-gray-200">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full">
                      <span className="animate-pulse">🎧</span>
                      <span className="text-xs text-[#365E32] font-bold tracking-tight">
                        한번 들어봐! {letter.song}
                      </span>
                    </div>
                  </div>
                )}

                {/* 카드 오른쪽 하단 작은 눈송이 장식 */}
                <div className="absolute bottom-4 right-6 text-red-50 opacity-50 text-4xl pointer-events-none">
                  {i % 3 === 0 ? "❄️" : i % 3 === 1 ? "💝" : "🎅"}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <p className="fixed bottom-6 right-6 text-xs text-white/50 hover:text-white/80 transition-colors z-50">
        개발자에게 문의하기 : Your name
      </p>
    </div>
  );
}
