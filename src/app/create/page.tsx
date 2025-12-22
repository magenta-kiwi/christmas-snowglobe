// app/create/page.tsx
"use client";
import { useState } from "react";
import Snowglobe from "../components/snowglobe";
import MusicPlayer from "../components/musicplayer";

export default function CreatePage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const handleCreate = () => {
    if (!name.trim()) {
      alert("닉네임을 입력해 주세요!");
      return;
    }
    const encodedName = btoa(encodeURIComponent(name.trim()));

    // 2. 뒤에 붙는 랜덤값 (중복 방지용)
    const randomSuffix = Math.random().toString(36).slice(2, 5);

    // 3. 이제 slug는 "7ZmN6ri464+Z-abc" 같은 형태가 됩니다.
    const newSlug = `${encodedName}-${randomSuffix}`;

    setSlug(newSlug);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#070F2B] via-[#1B1A55] to-[#535C91] py-10 px-4 flex flex-col items-center justify-center overflow-hidden text-white">
      <MusicPlayer />

      {!slug ? (
        // [적용] 스노우볼 내부에 편지함 만들기 폼 배치
        <Snowglobe>
          <h1 className="mt-3 text-xl font-black text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.5)]">
            🎄Christmas Snowglobe🎄
            <br />
          </h1>
          <p className="text-blue-100 text-xs opacity-90 leading-relaxed mt-2">
            이브에 보낸 편지는
            <br />
            크리스마스 당일에 도착합니다!
          </p>

          <div className="space-y-3 pt-2">
            <input
              type="text"
              placeholder="닉네임 입력"
              className="w-50 h-10 bg-white/20 border border-white/30 rounded-xl p-3 mt-3 text-white placeholder:text-blue-200 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all text-center"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              onClick={handleCreate}
              className="w-35 h-10 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-lg text-sm"
            >
              스노우볼 만들기 ✨
            </button>
          </div>
        </Snowglobe>
      ) : (
        // 링크 생성 완료 시에도 테마 유지
        <div className="max-w-md w-full text-center animate-fadeIn z-10">
          <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">
            ✨ 링크 생성 완료!
          </h2>
          <div className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-6 border border-white/20 break-all mb-6">
            <span className="font-mono text-yellow-200 text-sm">
              {typeof window !== "undefined" &&
                `${window.location.origin}/${slug}`}
            </span>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/${slug}`
              );
              alert("링크가 복사되었습니다!");
            }}
            className="py-4 px-8 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl shadow-xl transition-all"
          >
            링크 복사하기 📋
          </button>
        </div>
      )}
      {/* 개발자 문의 정보 - 우측 하단 고정 */}
    <p className="fixed bottom-6 right-6 text-xs text-white/50 hover:text-white/80 transition-colors z-50">
      개발자에게 문의하기 : @wjeong_0411
    </p>
    </div>
  );
}
