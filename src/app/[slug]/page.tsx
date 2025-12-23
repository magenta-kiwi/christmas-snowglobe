"use client";
import { AnimatePresence, motion } from "framer-motion";
import { use, useEffect, useRef, useState } from "react";
import { sendLetter } from "../actions";
import MusicPlayer from "../components/musicplayer";
import Snowfall from "../components/snow";
import Snowglobe from "../components/snowglobe";

const KEYWORDS = [
  "사랑",
  "산타",
  "추억",
  "겨울밤",
  "설렘",
  "루돌프",
  "눈송이",
  "캐롤",
  "첫눈",
  "좋아해",
  "비밀",
  "붕어빵",
  "담요",
  "따뜻해",
  "우정",
  "약속",
  "소중해",
  "진심",
  "기적",
  "마법",
  "고마워",
  "소원",
  "함께",
  "첫인상",
  "첫만남",
];

const Ribbon = () => (
  <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-[80%]">
    <div className="relative flex justify-center">
      {/* 리본 중앙 부분 */}
      <div className="bg-[#B8001F] text-white px-7 py-2 font-bold tracking-wider text-sm shadow-lg relative z-10 border-y border-yellow-400/50 border-2 rounded-sm">
        CHRISTMAS CARD
        <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></span>
      </div>
      {/* 왼쪽 리본 날개 (그림자 효과 포함) */}
      <div
        className="absolute mr-52 top-2 bg-[#B8001F] h-8 w-10 origin-bottom-right -rotate-12 shadow-md z-0 border-y border-yellow-400/50 border-2"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%, 15% 50%)" }} // V자 컷팅
      />
      {/* 오른쪽 리본 날개 */}
      <div
        className="absolute ml-52 top-2 bg-[#B8001F] h-8 w-10 origin-bottom-left rotate-12 shadow-md z-0 border-y border-yellow-400/50 border-2"
        style={{ clipPath: "polygon(0 0, 100% 0, 85% 50%, 100% 100%, 0 100%)" }} // V자 컷팅
      />
    </div>
  </div>
);

export default function LetterWritePage({ params }: any) {
  const { slug } = use(params) as { slug: string };
  const [keyword, setKeyword] = useState("");
  const [content, setContent] = useState("");
  const [song, setSong] = useState("");
  const [sent, setSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [decodedName, setDecodedName] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setKeyword(KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)]);
    try {
      const namePart = slug.split("-")[0];
      setDecodedName(decodeURIComponent(atob(namePart)));
    } catch (e) {
      setDecodedName("unknown");
    }
  }, [slug]);

  // 글자 수에 따라 높이 자동 조절 (스크롤 제거)
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert("따뜻한 마음을 한 줄이라도 적어주세요! ❄️");
      return;
    }
    setIsSending(true);
    const result = await sendLetter(slug, content, keyword, song);
    if (result.success) setSent(true);
    else alert(result.error);
    setIsSending(false);
  };

  return (
    <div className="relative min-h-screen bg-[#850E35] py-12 px-6 flex flex-col items-center justify-center overflow-x-hidden">
      <Snowfall />
      <MusicPlayer />

      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative z-10 max-w-md w-full"
          >
            {/* 상단 장식 리본 */}
            <Ribbon />

            <div className="bg-[#FDFDFD] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden">
              {/* 카드 헤더 */}
              <div className="bg-red-50/50 p-8 pb-4 border-b border-red-100/50">
                <h1 className="text-xl font-black text-[#1F4529] tracking-tight">
                  Dear. {decodedName}
                </h1>
                <p className="mt-2 text-xs text-red-700/60 font-medium">
                  익명으로 편지가 전달돼요! (개발자도 몰라요)
                </p>
              </div>

              {/* 카드 본문 (편지지 느낌) */}
              <div className="p-8 space-y-6">
                <div className="relative">
                  {/* 키워드 실링 왁스/스티커 효과 */}
                  <div className="absolute -right-2 -top-12 rotate-12 z-10">
                    <div className="bg-[#1F4529] w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-lg border-2 border-[#47663B] text-[10px] font-black text-white leading-none">
                      <span className="text-lg mb-0.5">🎁</span>
                      {keyword}
                    </div>
                  </div>

                  {/* 줄이 쳐진 편지지 스타일 Textarea */}
                  <textarea
                    ref={textareaRef}
                    className="w-full min-h-[160px] bg-transparent border-none text-gray-800 placeholder:text-gray-300 focus:outline-none text-lg leading-[2rem] resize-none overflow-hidden"
                    style={{
                      backgroundImage:
                        "linear-gradient(transparent, transparent 31px, #f1f1f1 31px)",
                      backgroundSize: "100% 32px",
                    }}
                    placeholder={`${keyword}(을)를 생각하며 메시지를 남겨보세요.`}
                    value={content}
                    onChange={handleInput}
                  />
                </div>

                {/* 노래 추천 필드 */}
                <div className="group flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 transition-all focus-within:border-red-200 focus-within:bg-white">
                  <span className="text-xl">🎧</span>
                  <input
                    type="text"
                    className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-600 placeholder:text-gray-400"
                    placeholder="들려주고 싶은 노래는?"
                    value={song}
                    onChange={(e) => setSong(e.target.value)}
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSending}
                  className="w-full py-5 bg-[#B8001F] text-white font-bold rounded-2xl transition-all shadow-[0_10px_20px_rgba(133,14,53,0.3)] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSending ? (
                    <span className="animate-pulse">편지 부치는 중...</span>
                  ) : (
                    <>
                      편지 보내기 <span className="text-xl">✨</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* 전송 완료 화면 */
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <Snowglobe>
              <div className="flex flex-col items-center text-center p-4">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-6xl mb-4"
                >
                  💌
                </motion.div>
                <h2 className="text-2xl font-black text-white mb-2">
                  전송 완료!
                </h2>
                <p className="text-sm text-red-100/80 leading-relaxed">
                  작성하신 편지는 {decodedName} 님의
                  <br />
                  스노우볼 안에 소중히 보관되었어요.
                </p>
                <a
                  href="/create"
                  className="mt-6 px-6 py-3 bg-white text-[#850E35] rounded-full text-sm font-black hover:bg-red-50 transition-colors shadow-xl"
                >
                  나도 스노우볼 만들기 🌟
                </a>
              </div>
            </Snowglobe>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="fixed bottom-6 right-6 text-xs text-white/50 hover:text-white/80 transition-colors z-50">
        개발자에게 문의하기 : @wjeong_0411
      </p>
    </div>
  );
}
