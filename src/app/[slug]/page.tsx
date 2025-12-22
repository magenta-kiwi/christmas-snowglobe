"use client";
import { use, useEffect, useState } from "react";
import Snowfall from "../components/snow";
import Snowglobe from "../components/snowglobe";
import MusicPlayer from "../components/musicplayer";

const KEYWORDS = ["사랑", "산타", "추억", "겨울밤", "하트", "양말", "눈송이"];

export default function LetterWritePage({ params }: any) {
  const { slug } = use(params) as {slug:string};
  const [keyword, setKeyword] = useState("");
  const [content, setContent] = useState("");
  const [song, setSong] = useState("");
  const [sent, setSent] = useState(false);

  const [decodedName, setDecodedName] = useState("");

  useEffect(() => {
    const k = KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)];
    setKeyword(k);
  }, []);

  useEffect(()=>{
    try{
      const namePart = slug.split("-")[0];

      const decoded = decodeURIComponent(atob(namePart));
      setDecodedName(decoded);
    }catch(e){
      setDecodedName("unknown");
    }
  }, [slug]);

  const handleSubmit = () => {
    setSent(true);
  };

  return (
    <div className="relative min-h-screen bg-[#850E35] py-10 px-4 flex flex-col items-center justify-center overflow-hidden">
      {/* 화면 전체 눈 내림 */}
      <Snowfall />
      <MusicPlayer/>

      {!sent ? (
        // 1. 편지 작성 화면: 글래스모피즘 스타일의 편지지
        <div className="relative z-10 max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-[2.5rem] p-8 animate-fadeIn">
          <h1 className="text-center text-2xl font-black text-white mb-6 drop-shadow-md">
            Dear. {decodedName}
          </h1>
          <p className="my-5 text-center text-[12px] text-[#EEEEEE]">자유롭게 당신의 마음을 전해보세요!<br/>익명으로 편지가 전달될 거에요.</p>

          {/* 키워드 태그: 선물 태그 같은 느낌 */}
          <div className="flex flex-col items-center mb-6">
            <div className="text-yellow-400 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg animate-bounce">
              당신의 키워드 : {keyword} 🎁
            </div>
          </div>

          <div className="space-y-4">
            <textarea
              className="w-full h-40 bg-white/10 border border-white/20 rounded-2xl p-5 text-white placeholder:text-red-100/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all resize-none"
              placeholder={`키워드를 포함해서 메시지를 적어주세요.`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div className="relative">
              <span className="absolute left-4 top-2 text-lg">🎧</span>
              <input
                type="text"
                className="w-full bg-white/10 border border-white/20 rounded-xl p-3 pl-12 text-white placeholder:text-red-100/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                placeholder="어울리는 노래 추천 (선택)"
                value={song}
                onChange={(e) => setSong(e.target.value)}
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-gradient-to-r from-red-500 to-red-700 text-white font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl border border-red-400"
            >
              편지 보내기 ✨
            </button>
          </div>
        </div>
      ) : (
        // 2. 전송 완료 화면: 스노우볼 안에 메시지 배치
        <div className="animate-fadeIn">
          <Snowglobe>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="text-5xl mb-2">💌</div>
              <h2 className="text-2xl font-bold text-white leading-tight drop-shadow-lg">
                편지가 스노우볼에
                <br />
                도착했어요!
              </h2>
              <p className="text-sm text-blue-100 opacity-80 px-2">
                따뜻한 마음이 {decodedName} 님에게
                <br />
                눈송이처럼 전달될 거예요.
              </p>

              <a
                href="/create"
                className="px-6 py-2.5 bg-white/20 hover:bg-white/30 border border-white/40 rounded-full text-sm font-bold text-white transition-all backdrop-blur-sm"
              >
                나도 편지함 만들기 🌟
              </a>
            </div>
          </Snowglobe>
        </div>
      )}
      <p className="fixed bottom-6 right-6 text-xs text-white/50 hover:text-white/80 transition-colors z-50">
      개발자에게 문의하기 : @wjeong_0411
    </p>
    </div>
  );
}
